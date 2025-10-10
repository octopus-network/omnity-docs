---
sidebar_position: 3
---

# Develop Your First BTCFi DApp in REE

This document demonstrates how to develop a REE BTCFi DApp implementing a typical lending scenario on the blockchain. It includes developing both an Exchange backend (canister) and an Exchange Frontend with core functionality. If you want to learn how to develop an Exchange Client to integrate with an existing Exchange, please refer to the RichSwap integration documentation.

For a more complete demo application and source code, please refer to:

* **Demo:** [https://lending-demo.omnity.network/](https://lending-demo.omnity.network/)
* **GitHub:** [https://github.com/octopus-network/ree-lending-demo](https://github.com/octopus-network/ree-lending-demo)

## Prerequisites

Before you begin, ensure you meet the following requirements:

1.  **Basic Knowledge:** Understand the fundamentals of developing canisters using Rust and basic frontend development.
2.  **Development Environment:** Have the Rust toolchain and the DFINITY Canister SDK (dfx) installed.
    * **Install Rust:** [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
    * **Install dfx:** [https://internetcomputer.org/docs/building-apps/getting-started/install](https://internetcomputer.org/docs/building-apps/getting-started/install)

This document will not cover the installation process in detail.

## Getting Started

### 1. Create a new project

We can use the `dfx` tool to quickly create a project template with a Rust backend canister and a React frontend:

```bash
dfx new --type rust --frontend react ree-demo-exchange
```

Executing this command generates the following project structure:

```
./ree-demo-exchange
├── src
│   ├── ree-demo-exchange-backend # Backend Canister project (Rust)
│   └── ree-demo-exchange-frontend # Frontend project (React)
├── dfx.json                 # Dfx configuration file
└── ...                      # Other configuration files
```

* `ree-demo-exchange-backend`: This directory contains the Rust canister project where we will write the core logic.
* `ree-demo-exchange-frontend`: This directory contains the React project for the frontend user interface.

### 2. Define the core data structure: pool

First, we need to define the core data structure representing a lending pool, `Pool`. A `Pool` primarily holds assets and records its state change history.

Create a new file `pool.rs` in the `ree-demo-exchange-backend/src` directory and define the following structures (code provided as a reference snippet):

```rust
// Pool represents the basic structure of a lending pool
// It maintains the pool's state history, metadata, and address information
pub struct Pool {
    pub states: Vec<PoolState>, // chain of historical pool states
    pub meta: CoinMeta,
    pub pubkey: Pubkey,
    pub addr: String, // pool address (cached to avoid re-acquisition costs)
}

impl Pool {
    pub fn base_id(&self) -> CoinId {
        self.meta.id
    }

    // Assigns a unique derivation path to each pool based on its base asset ID
    // This ensures different pools have different addresses and use different private keys to hold assets
    pub fn derivation_path(&self) -> Vec<Vec<u8>> {
        vec![self.base_id().to_string().as_bytes().to_vec()]
    }
}
```

**Explanation:**

* The `Pool` struct stores metadata about the associated asset (`CoinMeta`), the pool's public key (`Pubkey`), a cached pool address (`addr`), and a list of historical states (`states`).
* The `derivation_path` method generates a unique path based on the pool's base asset id (`CoinId`). This is crucial for generating deterministic addresses using Chain-key technology, ensuring different pools have distinct addresses controlled by different underlying keys managed by the IC.

### 3. Manage pool state: `PoolState`

We need a way to represent the state of a pool at a specific point in time, usually after a transaction.

Define the `PoolState` struct within `pool.rs` (code provided as a reference snippet):

```rust
// PoolState represents the state of a pool
// A new PoolState is created and added to the Pool's states chain after each transaction
pub struct PoolState {
    pub id: Option<Txid>, // transaction id that created this state (none for initial state)
    pub nonce: u64,       // incremental counter to prevent replay attacks
    pub utxo: Option<Utxo>, // the utxo holding the pool's assets
}
```

We can then implement methods on the `Pool` struct to manage these states (code provided as a reference snippet):

```rust
impl Pool {
    // Adds a new PoolState to the chain after a transaction is executed
    pub(crate) fn commit(&mut self, state: PoolState) {
        self.states.push(state);
    }
}
```

**Explanation:**

* `PoolState` records the state after a specific transaction (`Txid`), including the UTXO holding the pool's assets at that time and a `nonce` to prevent replay attacks.
* The `finalize` method is used after a transaction is confirmed on the underlying blockchain. It sets the state corresponding to the confirmed `txid` as the new base state and removes older states to save storage.
* The `commit` method appends a new `PoolState` to the history, typically after a transaction has been submitted but not yet finalized.

### 4. Store pool data

We need a persistent way to store all the created `Pool` instances, ensuring data survives canister upgrades. The IC provides `StableBTreeMap` for this purpose.

Define the storage in `ree-demo-exchange-backend/src/lib.rs` (code provided as a reference snippet):

```rust
// LENDING_POOLS stores all lending pools
// It's a mapping from pool_address (String) to Pool information
static LENDING_POOLS: RefCell<StableBTreeMap<String, Pool, Memory>> = RefCell::new(
    StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
    )
);
```

**Explanation:**

* `LENDING_POOLS` is declared as a static `RefCell` containing a `StableBTreeMap`.
* This map uses the `Pool`'s address (String) as the key and the `Pool` struct as the value.
* It is initialized using memory obtained from a `MEMORY_MANAGER` (typically defined using `thread_local!`), ensuring the data resides in stable memory.

### 5. Initialize a demo pool

For demonstration purposes, it's useful to have a function that initializes a sample `Pool` when the canister is deployed. This function is restricted to the canister's controller.

Create a new file `lending.rs` in `ree-demo-exchange-backend/src` and implement the `init_pool` function (code provided as a reference snippet):

```rust
#[update]
// init_pool creates a demonstration lending pool when the exchange is deployed
// This pool allows users to borrow BTC satoshis at a 1:1 ratio by depositing RICH tokens as collateral
async fn init_pool() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    if !ic_cdk::api::is_controller(&caller) {
        return Err("Not authorized".to_string());
    }

    let id = CoinId::rune(72798, 1058);
    let meta = CoinMeta {
        id,
        symbol: "HOPE•YOU•GET•RICH".to_string(),
        min_amount: 1,
    };
    // Request a pool address from the REE system
    let (untweaked, _, addr) = request_ree_pool_address(
        crate::SCHNORR_KEY_NAME,
        vec![id.to_string().as_bytes().to_vec()],
        Network::Testnet4,
    )
    .await?;

    // Initialize the pool with empty state
    let pool = crate::Pool {
        meta,
        pubkey: untweaked.clone(),
        addr: addr.to_string(),
        states: vec![],
    };
    // Store the pool in the LENDING_POOLS storage
    crate::LENDING_POOLS.with_borrow_mut(|p| {
        p.insert(addr.to_string(), pool);
    });
    Ok(())
}
```

**Explanation:**

* `init_pool` is an `#[update]` method because it modifies canister state (`LENDING_POOLS`) and makes an `await` call.
* It first checks if the caller is a controller.
* It defines metadata for a sample Rune asset (`HOPE•YOU•GET•RICH`).
* **Key Step:** It calls `request_ree_pool_address`. This represents an interaction with the IC's Chain-key signing service to derive a Bitcoin-compatible address.
    * **Important:** Real Chain-key calls are asynchronous (`async`) and cost Cycles.
    * The derived address (`addr`) and public key (`pubkey`) are deterministic for a given canister ID, key name, and derivation path.
    * Therefore, this call is typically made only once when creating the `Pool`, and the resulting address and public key are cached within the `Pool` struct to avoid repeated costs. The `Pool` effectively "holds" the private key corresponding to this address, managed securely by the IC.
* It creates a new `Pool` instance with an empty initial state (`states: vec![]`).
* It stores the newly created `pool` in the `LENDING_POOLS` stable map.

### 6. Implement required exchange methods

An Exchange canister interacting with a framework like REE usually needs to implement a standard set of interface methods. The five required methods mentioned are: `get_pool_list`, `get_pool_info`, `rollback_tx`, `new_block`, and `execute_tx`.

Let's implement the first three query methods. Create a new file `exchange.rs` in `ree-demo-exchange-backend/src` (code provided as reference snippets):

```rust
#[query]
// Returns a list of all lending pools
// Each pool entry contains its name (symbol) and address
pub fn get_pool_list() -> GetPoolListResponse {
    let pools = crate::get_pools(); // assumes a helper function get_pools() exists
    pools
        .iter()
        .map(|p| PoolBasic {
            name: p.meta.symbol.clone(),
            address: p.addr.clone(),
        })
        .collect()
}

#[query]
// Returns detailed information about a specific pool identified by its address
pub fn get_pool_info(args: GetPoolInfoArgs) -> GetPoolInfoResponse {
    let GetPoolInfoArgs { pool_address } = args;
    let p = crate::get_pool(&pool_address)?; // assumes a helper function get_pool() exists

    Some(PoolInfo {
        key: p.pubkey.clone(),
        name: p.meta.symbol.clone(),
        key_derivation_path: vec![p.meta.id.to_bytes()], // simplified example path
        address: p.addr.clone(),
        nonce: p.states.last().map(|s| s.nonce).unwrap_or_default(),
        btc_reserved: p.states.last().map(|s| s.btc_supply()).unwrap_or_default(), // assumes btc_supply() exists
        coin_reserved: p
            .states
            .last()
            .map(|s| {
                vec![CoinBalance {
                    id: p.meta.id,
                    value: s.rune_supply() as u128, // assumes rune_supply() exists
                }]
            })
            .unwrap_or_default(),
        utxos: p
            .states
            .last()
            .and_then(|s| s.utxo.clone())
            .map(|utxo| vec![utxo])
            .unwrap_or_default(),
        attributes: p.attrs(), // assumes attrs() exists
    })
}
```

**Explanation:**

* `get_pool_list`: A `#[query]` method (read-only, fast) that iterates through the stored pools (assuming a helper like `get_pools()`) and returns a list of basic pool information (`PoolBasic`).
* `get_pool_info`: A `#[query]` method that takes a `pool_address`, looks up the corresponding `Pool` (assuming a helper like `get_pool()`), and returns detailed `PoolInfo` if found. It extracts data like `nonce`, asset reserves, and `utxos` from the latest `PoolState`.

### 7. Implementing the Deposit Action

We first implement the necessary methods in the canister for the deposit action, including `pre_deposit()` and `execute_tx`.

`pre_deposit` receives the quantity of assets the user wants to deposit. This method typically needs to return the information required for the deposit transaction corresponding to the user's input. In this example, we only accept any amount of BTC assets deposited by the user, so we can ignore the user's input and only return the pool's UTXO and nonce.
We can add the following method in `lending.rs`:

```rust
#[query]
// pre_deposit queries the information needed to build a deposit transaction
// by specifying the target pool address and deposit amount
pub fn pre_deposit(
    pool_address: String,
    amount: CoinBalance,
) -> Result<DepositOffer, ExchangeError> {
    if amount.value < CoinMeta::btc().min_amount {
        return Err(ExchangeError::TooSmallFunds);
    }
    let pool = crate::get_pool(&pool_address).ok_or(ExchangeError::InvalidPool)?;
    let state = pool.states.last().clone();
    Ok(DepositOffer {
        pool_utxo: state.map(|s| s.utxo.clone()).flatten(),
        nonce: state.map(|s| s.nonce).unwrap_or_default(),
    })
}
```

Next, we implement `execute_tx`. This method accepts the PSBT constructed by the frontend and validated by the orchestrator, along with the user's intention set. There are three steps to be done in this method:
1. Validate that the intention set meets the pool's requirements. In this example, it should be that the user transfers out a certain amount of BTC, and the pool receives a certain amount of BTC (i.e., the deposit process). Other necessary validations should also be performed.
2. Call the `ree_pool_sign` method provided by the `ree-types` library to sign the UTXO held by the pool, releasing the assets.
3. Execute this transaction and modify the exchange pool state. The user will then be able to see the result of the deposit.
A reference code looks like this:

```rust
#[update(guard = "ensure_testnet4_orchestrator")]
// Accepts transaction execution requests from the orchestrator
// Verifies the submitted PSBT (Partially Signed Bitcoin Transaction)
// If validation passes, signs the pool's UTXOs and updates the exchange pool state
// Only the orchestrator can call this function (ensured by the guard)
pub async fn execute_tx(args: ExecuteTxArgs) -> ExecuteTxResponse {
    let ExecuteTxArgs {
        psbt_hex,
        txid,
        intention_set,
        intention_index,
        zero_confirmed_tx_queue_length: _zero_confirmed_tx_queue_length,
    } = args;
    // Decode and deserialize the PSBT
    let raw = hex::decode(&psbt_hex).map_err(|_| "invalid psbt".to_string())?;
    let mut psbt = Psbt::deserialize(raw.as_slice()).map_err(|_| "invalid psbt".to_string())?;

    // Extract the intention details
    let intention = intention_set.intentions[intention_index as usize].clone();
    let Intention {
        exchange_id: _,
        action: _,
        action_params: _,
        pool_address,
        nonce,
        pool_utxo_spend,
        pool_utxo_receive,
        input_coins,
        output_coins,
    } = intention;

    // Get the pool from storage
    let pool = crate::LENDING_POOLS
        .with_borrow(|m| m.get(&pool_address).expect("already checked in pre_*; qed"));

    // Process the transaction based on the action type
    match intention.action.as_ref() {
        "deposit" => {
            // Validate the deposit transaction and get the new pool state
            let (new_state, consumed) = pool
                .validate_deposit(
                    txid,
                    nonce,
                    pool_utxo_spend,
                    pool_utxo_receive,
                    input_coins,
                    output_coins,
                )
                .map_err(|e| e.to_string())?;

            // Sign the UTXO if there's an existing one to spend
            if let Some(ref utxo) = consumed {
                ree_pool_sign(
                    &mut psbt,
                    utxo,
                    crate::SCHNORR_KEY_NAME,
                    pool.derivation_path(),
                )
                .await
                .map_err(|e| e.to_string())?;
            }

            // Update the pool with the new state
            crate::LENDING_POOLS.with_borrow_mut(|m| {
                let mut pool = m
                    .get(&pool_address)
                    .expect("already checked in pre_deposit; qed");
                pool.commit(new_state);
                m.insert(pool_address.clone(), pool);
            });
        }
        _ => {
            return Err("invalid method".to_string());
        }
    }

    // Return the serialized PSBT with the exchange's signatures
    Ok(psbt.serialize_hex())
}
```

### 8. Implementing the Deposit Action on the Frontend

Now, let's outline how to implement the user deposit action on the frontend, interacting with the canister methods defined in Section 7. We'll use the **inquiry/invoke pattern**:

1.  **The inquiry step:**
    *   The frontend invokes the `pre_deposit` query method on the Exchange canister, passing the target pool address and the desired deposit amount.
    *   The canister returns the necessary information (like the pool's current UTXO and nonce) needed to construct the transaction.

    *Frontend Example (React `useEffect` hook):*
    ```typescript
    // Simplified example of calling pre_deposit when the input amount changes
    useEffect(() => {
      if (!Number(debouncedInputAmount)) {
        return;
      }
      const btcAmount = parseCoinAmount(debouncedInputAmount, BITCOIN);
      setIsQuoting(true);
      // Call the exchange canister's pre_deposit method
      lendingActor
        .pre_deposit(pool.address, { id: BITCOIN.id, value: BigInt(btcAmount) })
        .then((res: any) => {
          if (res.Ok) {
            // Store the returned offer (pool UTXO, nonce)
            setDepositOffer(res.Ok);
          }
        })
        .finally(() => {
          setIsQuoting(false);
        });
    }, [debouncedInputAmount]); // Re-run when amount changes
    ```

2.  **Transaction construction & signing:**
    *   The frontend uses the parameters received from `pre_deposit` (like the pool's UTXO and nonce) and the user's input (deposit amount, their UTXOs) to construct a PSBT.
    *   The frontend prompts the user to sign the PSBT inputs belonging to them using their Bitcoin wallet (e.g., UniSat, Xverse).

    *Explanation on PSBT Construction:*

    Constructing the PSBT currently involves some complexity, requiring developers to understand the UTXO calculation model. The specific implementation for this deposit example can be found in the REE Lending Demo repository: [DepositContent.tsx#L116-L329](https://github.com/octopus-network/ree-lending-demo/blob/5a6c454cbeb1f3bc01a0b19cc2f3db6f629acb52/src/ree-lending-demo-frontend/src/components/ManagePoolModal/DepositContent.tsx#L116-L329).

    We plan to abstract this implementation into a library method in the future to simplify development. Here's the basic principle behind constructing this PSBT:

    A Bitcoin transaction essentially destroys a set of input UTXOs and creates a set of output UTXOs. In our deposit example, we need to construct a transaction where:
    *   **Inputs:** Combine the pool's current BTC UTXO (obtained via `pre_deposit`) and the user's UTXO(s) used to pay for the deposit (obtained from the user's wallet).
    *   **Outputs:** Create new UTXOs:
        1.  One UTXO belonging to the pool, with a BTC balance increased by the deposited amount.
        2.  One UTXO belonging to the user (change), with a BTC amount equal to the user's input UTXO(s) minus the deposit amount and minus the transaction fee.

    This process effectively transfers the deposited BTC from the user to the pool while accounting for the network transaction fee.

3.  **Invoke:**
    *   The frontend sends the user-signed PSBT along with an `IntentionSet` to the `invoke` method on the REE Orchestrator canister.
    *   The Orchestrator validates the PSBT and the `IntentionSet`, calls the corresponding `execute_tx` method on the specified Exchange canister (as described in Section 7), gathers the exchange's signature on the PSBT, broadcasts the final transaction to the Bitcoin network, and eventually returns the Bitcoin transaction ID (`txid`).

    **Understanding the `invoke` Call and `IntentionSet`:**

    The Orchestrator's `invoke` function is the main entry point for executing actions within REE. It expects `InvokeArgs`:

    ```rust
    // Arguments for the Orchestrator's invoke function
    pub struct InvokeArgs {
        pub psbt_hex: String,      // User-signed PSBT (hex encoded)
        pub intention_set: IntentionSet, // Describes the user's and exchange's actions
    }
    ```

    The crucial part is the `IntentionSet`, which details *what* the transaction aims to achieve:

    ```rust
    // Defines the overall goal of the transaction
    pub struct IntentionSet {
        pub initiator_address: String, // User's address (for change/refunds)
        pub tx_fee_in_sats: u64,     // Proposed Bitcoin transaction fee
        pub intentions: Vec<Intention>, // List of specific actions (usually one)
    }

    // Defines a single action within the transaction
    pub struct Intention {
        pub exchange_id: String,        // Target Exchange canister ID
        pub action: String,             // Action name (e.g., "deposit")
        pub action_params: String,    // Optional extra parameters for the exchange
        pub pool_address: String,       // Target Pool address within the exchange
        pub nonce: u64,                 // Nonce obtained from pre_deposit
        pub pool_utxo_spend: Vec<String>, // Pool UTXOs being spent (if any)
        pub pool_utxo_receive: Vec<String>, // New UTXOs the pool will receive
        pub input_coins: Vec<InputCoin>,    // Coins the user is spending
        pub output_coins: Vec<OutputCoin>,   // Coins the user might receive (e.g., change)
    }

    // Represents coins being spent
    pub struct InputCoin {
        pub from: String,      // Owner address (usually the user)
        pub coin: CoinBalance, // Asset type and amount
    }

    // Represents coins being received
    pub struct OutputCoin {
        pub to: String,        // Receiver address
        pub coin: CoinBalance, // Asset type and amount
    }
    ```

    For our deposit example, the `Intention` would specify:
    *   `action`: "deposit"
    *   `exchange_id`: The ID of our lending exchange canister.
    *   `pool_address`: The address of the specific BTC pool.
    *   `nonce`: The nonce received from `pre_deposit`.
    *   `pool_utxo_spend`: Often empty for a simple deposit, unless the pool consolidates funds.
    *   `pool_utxo_receive`: The new UTXO representing the deposited amount combined with existing pool funds.
    *   `input_coins`: The BTC the user is sending from their wallet.
    *   `output_coins`: Usually empty for a simple deposit, unless there's change involved.

    The Orchestrator validates fields like `exchange_id` and `pool_address` and ensures the `IntentionSet` aligns with the PSBT data before calling the Exchange's `execute_tx`.

    *Frontend Example (React `onSubmit` function):*
    ```typescript
    // Simplified example of constructing IntentionSet and calling invoke
    const onSubmit = async () => {
      if (!psbt || !depositOffer) { // Ensure PSBT and pre_deposit info exist
        return;
      }
      setIsSubmiting(true);
      try {
        // Get the signed PSBT hex from the user's wallet
        const psbtBase64 = psbt.toBase64();
        const res = await signPsbt(psbtBase64); // Wallet signing function
        const signedPsbtHex = res?.signedPsbtHex ?? "";
        if (!signedPsbtHex) throw new Error("Signing Failed");

        // Construct the IntentionSet
        const intentionSet = {
          tx_fee_in_sats: fee, // Calculated fee
          initiator_address: paymentAddress, // User's address
          intentions: [
            {
              action: "deposit",
              exchange_id: EXCHANGE_ID, // Your Exchange Canister ID
              input_coins: inputCoins, // User's BTC input
              pool_utxo_spend: [], // Pool spends nothing in simple deposit
              pool_utxo_receive: poolReceiveOutpoints, // Expected pool output
              output_coins: [], // No other outputs in simple deposit
              pool_address: pool.address,
              action_params: "",
              nonce: depositOffer.nonce, // Nonce from pre_deposit
            },
          ],
        };

        // Call the Orchestrator's invoke method
        const txid = await Orchestrator.invoke({
          intention_set: intentionSet,
          psbt_hex: signedPsbtHex,
        });

        // Handle success (e.g., update UI, track spent UTXOs)
        addSpentUtxos(toSpendUtxos);
        onSuccess(txid);

      } catch (error: any) {
        // Handle errors (e.g., user rejection, network issues)
        if (error.code !== 4001) { // Ignore user wallet rejection
          console.error(error);
          toast(error.toString());
        }
      } finally {
        setIsSubmiting(false);
      }
    };
    ```



## State Management: Handling Blockchain Events

Previously, we implemented the flow for a successful deposit. However, a robust REE exchange must also handle exceptional situations to ensure consistent operation. The main exceptions include Bitcoin blockchain reorganizations (reorgs) and scenarios where transactions broadcast by REE fail to get confirmed on the Bitcoin network.

We have already covered four of the six required REE interface methods. This chapter introduces the remaining two: `new_block()` and `rollback_tx()`. These methods are crucial for maintaining correct state in response to blockchain events.

It's important to note that the implementation logic for `new_block()` and `rollback_tx()` is often standard across most exchanges. We plan to potentially move this common logic into an SDK or framework in the future to simplify development. For now, we'll explain their purpose and provide reference implementations.

To enable state rollback in exceptional cases, we first need to add this code snippet at the end of the `execute_tx()` method to record the pool associated with the transaction and whether it has been confirmed.

```rust
#[update(guard = "ensure_testnet4_orchestrator")]
pub async fn execute_tx(args: ExecuteTxArgs) -> ExecuteTxResponse {
...
    // Record the transaction as unconfirmed and track which pools it affects
    crate::TX_RECORDS.with_borrow_mut(|m| {
        ic_cdk::println!("new unconfirmed txid: {} in pool: {} ", txid, pool_address);
        let mut record = m.get(&(txid.clone(), false)).unwrap_or_default();
        if !record.pools.contains(&pool_address) {
            record.pools.push(pool_address.clone());
        }
        m.insert((txid.clone(), false), record);
    });

 ...
}
```

### Handling New Blocks: `new_block()`
A note on REE transaction confirmation order: when a block contains multiple transactions, the Runes indexer calls the Orchestrator’s new_block_detected method, with the transactions in the parameters following the same order as they appear in the block.

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

### Handling Rejected Transactions: `rollback_tx()`

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

### Supporting Pool Methods (`finalize` and `rollback`)

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




Last updated on July 20, 2025