# State Management

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>State Management: Handling Blockchain Events</h3>
    <p>Handling New Blocks: new_block()</p>
    <p>Handling Rejected Transactions: rollback_tx()</p>
    <p>Handling Pool State: execute_tx()</p>
  </div>

 <div style={{ flex: '1 0 50%' }}>
   <Tabs>
          <TabItem value="reorg" label="reorg.rs" default>
          <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              <code>
                {`
pub(crate) fn detect_reorg(
    network: Network,
    new_block: NewBlockInfo,
) -> std::result::Result<(), ReorgError> {
    ic_cdk::println!(
        "Processing new block - height: {}, hash: {}, timestamp: {}, confirmed_txs: {:?}",
        new_block.block_height,
        new_block.block_hash,
        new_block.block_timestamp,
        new_block.confirmed_txids
    );
    let current_block = BLOCKS.with_borrow(|m| m.iter().rev().next().map(|(_height, block)| block));
    match current_block {
        None => {
            ic_cdk::println!("No blocks found in exchange - this is expected for new exchanges");
            return Ok(());
        }
        Some(current_block) => {
            ic_cdk::println!(
                "Current block - height: {:?}, hash: {:?}, timestamp: {:?}",
                current_block.block_height,
                current_block.block_hash,
                current_block.block_timestamp
            );
            if new_block.block_height == current_block.block_height + 1 {
                ic_cdk::println!("New block is the next block in the chain");
                return Ok(());
            } else if new_block.block_height > current_block.block_height + 1 {
                ic_cdk::println!("New block is more than one block ahead of the current block");
                return Err(ReorgError::Unrecoverable);
            } else {
                let reorg_depth = current_block.block_height - new_block.block_height + 1;
                ic_cdk::println!("Detected reorg - depth: {}", reorg_depth,);
                if reorg_depth > get_max_recoverable_reorg_depth(network) {
                    ic_cdk::println!("Reorg depth is greater than the max recoverable reorg depth");
                    return Err(ReorgError::Unrecoverable);
                }
                let target_block = BLOCKS.with_borrow(|m| {
                    m.get(&new_block.block_height)
                        .ok_or(ReorgError::BlockNotFoundInState {
                            height: new_block.block_height,
                        })
                })?;
                if target_block.block_hash == new_block.block_hash {
                    ic_cdk::println!("New block is a duplicate block");
                    return Err(ReorgError::DuplicateBlock {
                        height: new_block.block_height,
                        hash: new_block.block_hash,
                    });
                }
                return Err(ReorgError::Recoverable {
                    height: current_block.block_height,
                    depth: reorg_depth,
                });
            }
        }
    }
}
pub fn handle_reorg(height: u32, depth: u32) {
    ic_cdk::println!("Rolling back state after reorg of depth {depth} at height {height}");
    for h in (height - depth + 1..=height).rev() {
        ic_cdk::println!("Rolling back change record at height {h}");
        let block = BLOCKS.with_borrow(|m| m.get(&h).unwrap());
        for txid in block.confirmed_txids.iter() {
            TX_RECORDS.with_borrow_mut(|m| {
                if let Some(record) = m.remove(&(txid.clone(), true)) {
                    m.insert((txid.clone(), false), record);
                    ic_cdk::println!("Unconfirm txid: {}", txid);
                }
            });
        }
        BLOCKS.with_borrow_mut(|m| m.remove(&h));
    }
    ic_cdk::println!(
        "Successfully rolled back state to height {}",
        height - depth,
    );
}
                `}
              </code>
            </pre>
          </TabItem>
           <TabItem value="exchange" label="exchange.rs" default>
           <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              <code>
                {`
#[update(guard = "ensure_orchestrator")]
pub fn new_block(args: NewBlockArgs) -> NewBlockResponse {
    match crate::reorg::detect_reorg(Network::Testnet4, args.clone()) {
        Ok(_) => {}
        Err(crate::reorg::ReorgError::DuplicateBlock { height, hash }) => {
            ic_cdk::println!(
                "Duplicate block detected at height {} with hash {}",
                height,
                hash
            );
        }
        Err(crate::reorg::ReorgError::Unrecoverable) => {
            return Err("Unrecoverable reorg detected".to_string());
        }
        Err(crate::reorg::ReorgError::BlockNotFoundInState { height }) => {
            return Err(format!("Block not found in state at height {}", height));
        }
        Err(crate::reorg::ReorgError::Recoverable { height, depth }) => {
            crate::reorg::handle_reorg(height, depth);
        }
    }
    let NewBlockArgs {
        block_height,
        block_hash: _,
        block_timestamp: _,
        confirmed_txids,
    } = args.clone();
    // Store the new block information
    BLOCKS.with_borrow_mut(|m| {
        m.insert(block_height, args);
        ic_cdk::println!("new block {} inserted into blocks", block_height,);
    });
    // Mark transactions as confirmed
    for txid in confirmed_txids {
        TX_RECORDS.with_borrow_mut(|m| {
            if let Some(record) = m.get(&(txid.clone(), false)) {
                m.insert((txid.clone(), true), record.clone());
                ic_cdk::println!("confirm txid: {} with pools: {:?}", txid, record.pools);
            }
        });
    }
    // Calculate the height below which blocks are considered fully confirmed (beyond reorg risk)
    let confirmed_height =
        block_height - crate::reorg::get_max_recoverable_reorg_depth(Network::Testnet4) + 1;
    let exchange_pool_address =
        read_state(|s| s.address.clone()).ok_or("pool address not init".to_string())?;
    // Finalize transactions in confirmed blocks
    BLOCKS.with_borrow(|m| {
        m.iter()
            .take_while(|(height, _)| *height <= confirmed_height)
            .for_each(|(height, block_info)| {
                ic_cdk::println!("finalizing txs in block: {}", height);
                block_info.confirmed_txids.into_iter().for_each(|txid| {
                    TX_RECORDS.with_borrow_mut(|m| {
                        if let Some(record) = m.get(&(txid.clone(), true)) {
                            record.pools.iter().for_each(|pool| {
                                if pool.eq(&exchange_pool_address) {
                                    mutate_state(|s| {
                                        s.finalize(txid.clone()).map_err(|e| e.to_string())
                                    })
                                    .unwrap();
                                }
                            });
                        }
                    })
                })
            })
    });
    BLOCKS.with_borrow_mut(|m| {
        let heights_to_remove: Vec<u32> = m
            .iter()
            .take_while(|(height, _)| *height <= confirmed_height)
            .map(|(height, _)| height)
            .collect();
        for height in heights_to_remove {
            ic_cdk::println!("removing block: {}", height);
            m.remove(&height);
        }
    });
    Ok(())
}
#[update(guard = "ensure_orchestrator")]
pub fn rollback_tx(args: RollbackTxArgs) -> RollbackTxResponse {
    let cookie_pool =
        read_state(|s| s.address.clone()).ok_or("pool address not init".to_string())?;
    TX_RECORDS.with_borrow(|m| {
        let maybe_unconfirmed_record = m.get(&(args.txid.clone(), false));
        let maybe_confirmed_record = m.get(&(args.txid.clone(), true));
        let record = maybe_confirmed_record.or(maybe_unconfirmed_record).unwrap();
        ic_cdk::println!(
            "rollback txid: {} with pools: {:?}",
            args.txid,
            record.pools
        );
        record.pools.iter().for_each(|pool_address| {
            if pool_address.eq(&cookie_pool) {
                // Rollback the state of the pool
                mutate_state(|s| s.rollback(args.txid)).unwrap();
            }
        });
    });
    Ok(())
}
#[update(guard = "ensure_orchestrator")]
pub async fn execute_tx(args: ExecuteTxArgs) -> ExecuteTxResponse {
    let ExecuteTxArgs {
        psbt_hex,
        txid,
        intention_set,
        intention_index,
        zero_confirmed_tx_queue_length: _zero_confirmed_tx_queue_length,
    } = args;
    let raw = hex::decode(&psbt_hex).map_err(|_| "invalid psbt".to_string())?;
    let mut psbt = Psbt::deserialize(raw.as_slice()).map_err(|_| "invalid psbt".to_string())?;
    let intention = intention_set.intentions[intention_index as usize].clone();
    let initiator = intention_set.initiator_address.clone();
    let Intention {
        exchange_id: _,
        action,
        action_params: _,
        pool_address,
        nonce,
        pool_utxo_spend,
        pool_utxo_receive,
        input_coins,
        output_coins,
    } = intention;
    read_state(|s| {
        return s
            .address
            .clone()
            .ok_or("Exchange address not init".to_string())
            .and_then(|address| {
                address
                    .eq(&pool_address)
                    .then(|| ())
                    .ok_or("address not match".to_string())
            });
    })?;
    match action.as_str() {
        "register" => {
            let (new_state, consumed) = read_state(|es| {
                es.validate_register(
                    txid.clone(),
                    nonce,
                    pool_utxo_spend,
                    pool_utxo_receive,
                    input_coins,
                    output_coins,
                    initiator.clone(),
                )
            })
            .map_err(|e| e.to_string())?;
            let key_name = read_state(|s| s.key_path.clone());
            ree_pool_sign(
                &mut psbt,
                vec![&consumed],
                "key_1",
                vec![key_name.into_bytes()],
            )
            .await
            .map_err(|e| e.to_string())?;
            let principal_byte_buf = get_principal(initiator.clone())
                .await
                .map_err(|e| format!("get_principal failed: {:?}, initiator: {:?}", e, initiator))?
                .0?;
            let principal_of_initiator = Principal::from_slice(&principal_byte_buf);
            mutate_state(|s| {
                s.game.register_new_gamer(initiator.clone());
                s.commit(new_state);
            });
            ADDRESS_PRINCIPLE_MAP.with_borrow_mut(|m| {
                m.insert(principal_of_initiator, initiator.clone());
            });
        }
        "withdraw" => {
            let (new_state, consumed) = read_state(|es| {
                es.validate_withdraw(
                    txid.clone(),
                    nonce,
                    pool_utxo_spend,
                    pool_utxo_receive,
                    input_coins,
                    output_coins,
                    initiator.clone(),
                )
            })
            .map_err(|e| e.to_string())?;
            let key_name = read_state(|s| s.key_path.clone());
            ree_pool_sign(
                &mut psbt,
                vec![&consumed],
                "key_1",
                vec![key_name.into_bytes()],
            )
            .await
            .map_err(|e| e.to_string())?;
            mutate_state(|s| {
                s.commit(new_state);
                s.game.withdraw(initiator.clone())
            })
            .map_err(|e| e.to_string())?;
        }
        _ => {
            return Err("invalid method".to_string());
        }
    }
    TX_RECORDS.with_borrow_mut(|m| {
        ic_cdk::println!("new unconfirmed txid: {} in pool: {} ", txid, pool_address);
        let mut record = m.get(&(txid.clone(), false)).unwrap_or_default();
        if !record.pools.contains(&pool_address) {
            record.pools.push(pool_address.clone());
        }
        m.insert((txid.clone(), false), record);
    });
    Ok(psbt.serialize_hex())
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
  </div>
</div>