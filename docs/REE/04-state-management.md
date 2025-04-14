---
sidebar_position: 4
---

# State Management: Handling Blockchain Events

Previously, we implemented the flow for a successful deposit. However, a robust REE exchange must also handle exceptional situations to ensure consistent operation. The main exceptions include Bitcoin blockchain reorganizations (reorgs) and scenarios where transactions broadcast by REE fail to get confirmed on the Bitcoin network.

We have already covered four of the six required REE interface methods. This chapter introduces the remaining two: `new_block()` and `rollback_tx()`. These methods are crucial for maintaining correct state in response to blockchain events.

It's important to note that the implementation logic for `new_block()` and `rollback_tx()` is often standard across most exchanges. We plan to potentially move this common logic into an SDK or framework in the future to simplify development. For now, we'll explain their purpose and provide reference implementations.

## Handling New Blocks: `new_block()`

The Orchestrator calls the `new_block()` method on an exchange canister whenever it learns that a new Bitcoin block has been indexed.

Upon receiving this notification, the exchange typically performs the following actions:

1.  **Check for Reorgs:** Determine if the new block indicates a blockchain reorganization. If a reorg occurred, the confirmation count for recent transactions within the exchange needs recalculation.
2.  **Update Confirmations:** If there's no reorg, update the confirmation count for pending transactions based on the new block height.
3.  **Finalize Transactions:** If a transaction's confirmation count reaches the exchange's predefined security threshold (meaning it's considered highly unlikely to be reversed), the exchange can finalize its state. This often involves pruning older, now unnecessary state history related to that transaction to save storage costs.

*Reference Implementation (`new_block`):*

```rust
#[update(guard = "ensure_testnet4_orchestrator")]
// Accepts notifications from the orchestrator about newly confirmed blocks
// Used to finalize transactions and handle blockchain reorganizations (reorgs)
// All exchanges implement this interface in the same way - will be moved to SDK in the future
// Only the orchestrator can call this function (ensured by the guard)
pub fn new_block(args: NewBlockArgs) -> NewBlockResponse {
    // Check for blockchain reorganizations
    match crate::reorg::detect_reorg(BitcoinNetwork::Testnet, args.clone()) {
        Ok(_) => {} // No reorg or handled internally
        Err(crate::reorg::Error::DuplicateBlock { height, hash }) => {
            return Err(format!(
                "Duplicate block detected at height {} with hash {}",
                height, hash
            ));
        }
        Err(crate::reorg::Error::Unrecoverable) => {
            // Critical error, manual intervention might be needed
            return Err("Unrecoverable reorg detected".to_string());
        }
        Err(crate::reorg::Error::Recoverable { height, depth }) => {
            // Handle the recoverable reorg (e.g., revert state)
            crate::reorg::handle_reorg(height, depth);
        }
    }
    let NewBlockArgs {
        block_height,
        block_hash: _,
        block_timestamp: _,
        confirmed_txids, // List of txids confirmed in this new block
    } = args.clone();

    // Store the new block information (e.g., for reorg detection)
    crate::BLOCKS.with_borrow_mut(|m| {
        m.insert(block_height, args);
        ic_cdk::println!("new block {} inserted into blocks", block_height);
    });

    // Mark transactions included in this block as confirmed
    for txid in confirmed_txids {
        crate::TX_RECORDS.with_borrow_mut(|m| {
            // Update record status from unconfirmed (false) to confirmed (true)
            if let Some(record) = m.get(&(txid.clone(), false)) {
                m.insert((txid.clone(), true), record.clone());
                ic_cdk::println!("confirm txid: {} with pools: {:?}", txid, record.pools);
                 m.remove(&(txid.clone(), false)); // Optional: remove unconfirmed entry
            }
        });
    }
    // Calculate the height below which blocks are considered stable (finalized)
    let confirmed_height =
        block_height.saturating_sub(crate::reorg::get_max_recoverable_reorg_depth(BitcoinNetwork::Testnet)) + 1;

    // Finalize transactions in blocks that are now considered stable
    crate::BLOCKS.with_borrow(|m| {
        m.iter()
            .take_while(|(height, _)| *height <= confirmed_height)
            .for_each(|(height, block_info)| {
                ic_cdk::println!("finalizing txs in stable block: {}", height);
                block_info.confirmed_txids.iter().for_each(|txid| {
                    crate::TX_RECORDS.with_borrow_mut(|tx_records| {
                        // Get the record for the confirmed transaction
                        if let Some(record) = tx_records.get(&(txid.clone(), true)) {
                            ic_cdk::println!(
                                "finalize txid: {} with pools: {:?}",
                                txid,
                                record.pools
                            );
                            // Call finalize on each affected pool to make the state permanent
                            record.pools.iter().for_each(|pool_address| {
                                crate::LENDING_POOLS.with_borrow_mut(|pools| {
                                    if let Some(mut pool) = pools.get(pool_address) {
                                        // The finalize method removes state before this txid
                                        if let Err(e) = pool.finalize(txid.clone()) {
                                             ic_cdk::println!("Error finalizing pool {}: {:?}", pool_address, e);
                                        } else {
                                             pools.insert(pool_address.clone(), pool); // Update pool state
                                        }
                                    } else {
                                         ic_cdk::println!("Pool {} not found during finalize", pool_address);
                                    }
                                });
                            });
                            // Optional: Remove the finalized tx record if no longer needed
                            // tx_records.remove(&(txid.clone(), true));
                        }
                    });
                });
            });
    });

    // Clean up information for blocks older than the stable height
    crate::BLOCKS.with_borrow_mut(|m| {
        let heights_to_remove: Vec<u32> = m
            .iter()
            .take_while(|(height, _)| *height <= confirmed_height)
            .map(|(height, _)| height)
            .collect();
        for height in heights_to_remove {
            ic_cdk::println!("removing finalized block info: {}", height);
            m.remove(&height);
        }
    });
    Ok(())
}
```

## Handling Rejected Transactions: `rollback_tx()`

The Orchestrator calls `rollback_tx()` when it detects that a previously broadcast transaction is unlikely to ever be confirmed (e.g., it was rejected by the Bitcoin network or replaced by another transaction).

Since the exchange pool state is typically managed as a chain of states linked by transactions, the exchange needs to undo the state changes caused by the rejected transaction *and* any subsequent transactions that depended on it.

*Reference Implementation (`rollback_tx`):*

```rust
#[update(guard = "ensure_testnet4_orchestrator")]
// Accepts notifications from the orchestrator to roll back rejected transactions
// When a transaction is rejected, this function returns the pool to its state before that transaction
// Only the orchestrator can call this function (ensured by the guard)
pub fn rollback_tx(args: RollbackTxArgs) -> RollbackTxResponse {
    crate::TX_RECORDS.with_borrow_mut(|m| {
        // Find the record for the transaction to be rolled back
        // It could be marked as unconfirmed (false) or maybe even confirmed (true) if a reorg happened
        let record = m.get(&(args.txid.clone(), false))
            .or_else(|| m.get(&(args.txid.clone(), true)))
            .cloned(); // Clone the record data

        if let Some(record) = record {
             ic_cdk::println!(
                "rollback txid: {} affecting pools: {:?}",
                args.txid,
                record.pools
             );

            // Roll back each affected pool to its state *before* this transaction occurred
            record.pools.iter().for_each(|pool_address| {
                crate::LENDING_POOLS.with_borrow_mut(|pools| {
                    if let Some(mut pool) = pools.get(pool_address) {
                        // The rollback method removes the state for txid and subsequent states
                        if let Err(e) = pool.rollback(args.txid) {
                             ic_cdk::println!("Error rolling back pool {}: {:?}", pool_address, e);
                        } else {
                             pools.insert(pool_address.clone(), pool); // Update pool state
                        }
                    } else {
                         ic_cdk::println!("Pool {} not found during rollback", pool_address);
                    }
                });
            });

             // Remove the transaction record after rollback
             m.remove(&(args.txid.clone(), false));
             m.remove(&(args.txid.clone(), true));
        } else {
             ic_cdk::println!("Transaction record not found for rollback: {}", args.txid);
             // Depending on requirements, might return an error or just log
        }
    });
    Ok(())
}
```

## Supporting Pool Methods (`finalize` and `rollback`)

To support the `new_block` and `rollback_tx` logic, the `Pool` struct needs methods to manipulate its chain of `PoolState` entries.

```rust
impl Pool {
    // Rollback the pool state to before the specified transaction
    // Removes the state created by txid and all subsequent states
    pub(crate) fn rollback(&mut self, txid: Txid) -> Result<(), ExchangeError> {
        let idx = self
            .states
            .iter()
            .position(|state| state.id == Some(txid))
            .ok_or(ExchangeError::InvalidState("rollback txid not found in pool state chain".to_string()))?;

        // Truncate the states vector, removing the state at index `idx` and all subsequent states
        self.states.truncate(idx);
        Ok(())
    }

    // Finalize a transaction by making its state the new base state
    // Removes all states *before* the specified transaction
    pub(crate) fn finalize(&mut self, txid: Txid) -> Result<(), ExchangeError> {
        let idx = self
            .states
            .iter()
            .position(|state| state.id == Some(txid))
            .ok_or(ExchangeError::InvalidState("finalize txid not found in pool state chain".to_string()))?;

        // If the state to finalize is already the first one, nothing to do
        if idx == 0 {
            return Ok(());
        }

        // Efficiently remove states before index `idx`
        self.states.rotate_left(idx);
        self.states.truncate(self.states.len() - idx);
        Ok(())
    }
}
```

By implementing `new_block` and `rollback_tx` (along with the supporting `Pool` methods), an REE exchange can maintain accurate and consistent state even when faced with common blockchain events like confirmations, reorgs, and transaction rejections.



Last updated on April 9, 2025