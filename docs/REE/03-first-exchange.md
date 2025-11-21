---
sidebar_position: 3
---

# Develop Your First BTCFi DApp in REE

This document demonstrates how to develop a REE BTCFi DApp implementing a typical lending scenario using the **[ree-exchange-sdk](https://github.com/octopus-network/ree-exchange-sdk)**. This is a simple lending application where users can deposit the rune HOPE•YOU•GET•RICH and borrow BTC sats at a 1:1 ratio. Since users need BTC available in the pool to borrow against their rune deposits, we'll also implement a `deposit` action that allows users to deposit BTC into the pool. This document covers developing both an Exchange backend (canister) and an Exchange frontend with core functionality. If you want to learn how to develop an Exchange Client to integrate with an existing Exchange, please refer to the RichSwap integration documentation.

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

Next, add the `ree-exchange-sdk` dependency to your `Cargo.toml` file:

```toml
[dependencies]
ree-exchange-sdk = "0.11"
```

### 2. Define Exchange Storage

REE Exchange SDK provides three types of storage:

**Exchange State**

Exchange State is a global state that does not change with block production or REE transaction submissions. It typically has dedicated interfaces to modify it.

**Block State**

Block State is a type of state that needs to be updated when the exchange receives notification of a new block produced on the Bitcoin network. If the Bitcoin network experiences a reorg, the SDK can automatically roll back the reorganized state.

**Pool State**

Pool State is the most commonly used state in exchanges. It changes with the submission of REE transactions and can automatically roll back invalid modifications after a Bitcoin network reorg. Most of the exchange's core logic will be stored in Pool State.

### 3. Implement a demo Exchange State and Block State

The current lending application has simple business logic and can function without Exchange State and Block State. For demonstration purposes, we'll design a hypothetical scenario that uses these state types.

We'll design an Exchange State that stores the current exchange version. This version will change when the exchange is upgraded, and we'll define it as an incrementing integer.

First, open the `src/lib.rs` file and add:

```rust
type Version = u32;
```

We will use this type to store the exchange version.

Next, define:

```rust
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct BlockState {
    pub block_number: u32,
}
```

This is a hypothetical Block State that stores the latest block height. It has no practical meaning in the lending application.

That's it—both Exchange State and Block State are now defined. If your exchange doesn't need these two states, you can skip defining them. We will introduce how to use them later.

### 4. Define Pool State

Next, we'll define the core data structure for the lending application: the Pool State.

In a typical blockchain lending application, the core business logic involves depositing one type of asset and then borrowing another type of asset at a certain ratio. The most critical storage structure needs to store the current quantities of both assets in the smart contract. Users submit REE transactions to perform lending operations, ultimately changing the asset quantities in the state. This state is ideal for storing in Pool State.

Create a new file `pool.rs` under the `src/` directory and define the following structure:

```rust
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct PoolState {
    pub id: Txid,
    pub nonce: u64,
    pub utxo: Option<Utxo>,
    pub rune_id: CoinId,
}
```

Where:
- `id` is the txid of the REE transaction that modified the Pool State
- `nonce` is an incrementing number used to prevent replay attacks
- `utxo` stores the assets in the Pool State. In this lending application, we use a single UTXO to hold both asset types
- `rune_id` records the ID of the rune in the lending application. The two assets are BTC and HOPE•YOU•GET•RICH. Users can deposit HOPE•YOU•GET•RICH to borrow BTC from the pool

Next, we need to implement `ree_exchange_sdk::StateView` for `PoolState`. Its `inspect_state` method needs to return a `ree_exchange_sdk::StateInfo`, which allows the SDK to automatically generate methods for displaying pool information.

```rust
impl StateView for PoolState {
    fn inspect_state(&self) -> StateInfo {
        StateInfo {
            txid: self.id,
            nonce: self.nonce,
            btc_reserved: self.btc_supply(),
            coin_reserved: vec![CoinBalance {
                id: self.rune_id,
                value: self.rune_supply() as u128,
            }],

            utxos: self
                .utxo
                .as_ref()
                .map(|u| vec![u.clone()])
                .unwrap_or_default(),
            attributes: "".to_string(),
        }
    }
}
```

### 5. Define the Exchange

Create a new file `lending.rs` under the `src/` directory.

Then add a new module decorated with the `ree_exchange_sdk_macro::exchange` Procedural Macro. All other Procedural Macros provided by the SDK must be defined within this module.

```rust
#[exchange]
pub mod exchange {
    // ...
}
```

Next, we need to define a unit struct and implement the `Pools` trait for it:

```rust
    #[pools]
    pub struct LendingPools;

    impl Pools for LendingPools {
        type PoolState = PoolState;
        type BlockState = BlockState;

        const POOL_STATE_MEMORY: u8 = 0;
        const BLOCK_STATE_MEMORY: u8 = 1;

        fn network() -> ree_exchange_sdk::Network {
            ree_exchange_sdk::Network::Testnet4
        }

        fn finalize_threshold() -> u32 {
            64
        }
    }
```

Where:
- The associated type `PoolState` points to the `PoolState` we defined
- The associated type `BlockState` points to the `BlockState` we defined
- `POOL_STATE_MEMORY` and `BLOCK_STATE_MEMORY` set the stable memory IDs for PoolState and BlockState. The value range is 0 to 99, and developers must ensure memory IDs don't conflict.
- `network()` is used to distinguish between Bitcoin testnet4 and mainnet. The SDK will use the network to determine the signature network type and connect to either testnet or mainnet REE orchestrator.
- `finalize_threshold` sets the number of confirmations after which a state is considered finalized and impossible to reorganize. For Bitcoin mainnet, 3 to 6 confirmations are recommended; for Bitcoin testnet4, 64 confirmations are recommended. Pool State and Block State entries exceeding this threshold will be pruned.

Next, we define the Exchange State:

```rust
    #[storage(2)]
    pub type ExchangeStorage = ree_exchange_sdk::store::StableCell<Version>;
```

Where `#[storage(2)]` allocates stable memory ID 2 for this Exchange State. The value range is also 0 to 99 and should not conflict with other memory IDs. We use a `StableCell` to store the `Version` we defined earlier.

Next, we define a hook to modify BlockState:

```rust
    #[hook]
    impl Hook for LendingPools {
        fn on_block_confirmed(block: Block) {
            let _ = LendingPools::commit(
                block.block_height,
                BlockState {
                    block_number: block.block_height,
                },
            );
        }
    }
```

The `Hook` trait requires implementing an `on_block_confirmed` method, which receives the latest confirmed block from REE as its parameter. The lending application itself doesn't require Block State; here, for demonstration purposes, we simply record the latest confirmed block height into the Block State.

Now we define the two main actions for the lending application: `deposit` and `borrow`. The signatures of these two methods are very similar:

```rust
    #[action]
    pub async fn deposit(_psbt: &Psbt, args: ActionArgs) -> ActionResult<PoolState> {
        // ...
    }

    #[action]
    pub async fn borrow(_psbt: &Psbt, args: ActionArgs) -> ActionResult<PoolState> {
        // ...
    }
```

Both actions receive the PSBT of the REE transaction submitted by the user to complete the deposit or borrow operation. These methods must verify that the PSBT correctly implements the expected exchange logic. For example, if a user borrows 1000 sats by depositing 1000 HOPE•YOU•GET•RICH, the `borrow` method should verify that: (1) the inputs contain the pool's UTXO (to pay out sats) and the user's UTXO (to pay HOPE•YOU•GET•RICH), and (2) the outputs show that the user receives 1000 sats while the pool's BTC decreases by 1000 sats but gains 1000 HOPE•YOU•GET•RICH. Developers are also responsible for implementing additional validation, such as verifying that the pool has sufficient BTC available for the requested borrow amount.

After validation passes, the action method must return the new Pool State resulting from successful execution of this action. The SDK will automatically commit this state to the Pool State storage.

Instead of directly validating the PSBT, exchanges can choose to validate the `ActionArgs` parameter. The core data in `ActionArgs` is the REE Intention, which provides a summary of the REE transaction that has already been validated by the orchestrator. It contains the essential information about the transaction's action type and the changes to user and pool assets. The lending application uses this validation approach. For detailed implementation, please refer to these two action methods in the lending demo source code.

### 6. Implementing pre_deposit() and pre_borrow() for Frontend PSBT Construction

When users perform deposit or borrow operations on the frontend, the frontend needs to construct the PSBT required for the REE transaction. To build a complete PSBT, the frontend needs to query the exchange's current state in addition to receiving user input. Therefore, the canister needs to implement `pre_deposit()` and `pre_borrow()` to provide the information needed for the frontend to construct the PSBT.

`pre_deposit()` is straightforward. Since we allow users to deposit any amount of BTC, it primarily returns the pool's UTXO information and nonce. `pre_borrow()` performs additional validation to ensure the pool has sufficient BTC available for the requested borrow amount.

```rust
#[query]
pub fn pre_deposit(
    pool_address: String,
    amount: CoinBalance,
) -> Result<DepositOffer, ExchangeError> {
    if amount.value < CoinMeta::btc().min_amount {
        return Err(ExchangeError::TooSmallFunds);
    }
    let pool = exchange::LendingPools::get(&pool_address).ok_or(ExchangeError::InvalidPool)?;
    let state = pool.states().last().clone();
    Ok(DepositOffer {
        pool_utxo: state.map(|s| s.utxo.clone()).flatten(),
        nonce: state.map(|s| s.nonce).unwrap_or_default(),
    })
}

#[query]
pub fn pre_borrow(pool_address: String, amount: CoinBalance) -> Result<BorrowOffer, ExchangeError> {
    let pool = exchange::LendingPools::get(&pool_address).ok_or(ExchangeError::InvalidPool)?;
    let recent_state = pool.states().last().ok_or(ExchangeError::EmptyPool)?;
    let (input_runes, output_btc) = crate::pool::available_to_borrow(&pool, amount)?;
    Ok(BorrowOffer {
        nonce: recent_state.nonce,
        pool_utxo: recent_state.utxo.clone().expect("already checked"),
        input_runes,
        output_btc,
    })
}
```

### 7. Implementing the Deposit Action on the Frontend

Now, let's outline how to implement the user deposit action on the frontend, interacting with the canister methods defined in Section 6. The frontend follows an **inquiry/invoke pattern**:

1.  **Inquiry step:**
    *   The frontend calls the `pre_deposit` query method on the Exchange canister, passing the target pool address and the desired deposit amount.
    *   The canister returns the necessary information (such as the pool's current UTXO and nonce) needed to construct the transaction.

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

2.  **Transaction construction and signing:**
    *   The frontend uses the parameters received from `pre_deposit` (such as the pool's UTXO and nonce) combined with the user's input (deposit amount and their UTXOs) to construct a PSBT.
    *   The frontend prompts the user to sign the PSBT inputs using their Bitcoin wallet (e.g., UniSat, Xverse).

    **PSBT Construction:**

    Constructing the PSBT requires understanding the UTXO model. The complete implementation for this deposit example can be found in the REE Lending Demo repository: [DepositContent.tsx#L116-L329](https://github.com/octopus-network/ree-lending-demo/blob/5a6c454cbeb1f3bc01a0b19cc2f3db6f629acb52/src/ree-lending-demo-frontend/src/components/ManagePoolModal/DepositContent.tsx#L116-L329).

    We plan to abstract this implementation into a library in the future to simplify development. Here's the basic principle:

    A Bitcoin transaction essentially destroys a set of input UTXOs and creates a set of output UTXOs. In our deposit example, we need to construct a transaction where:
    *   **Inputs:** Combine the pool's current BTC UTXO (obtained via `pre_deposit`) and the user's UTXO(s) used to pay for the deposit (obtained from the user's wallet).
    *   **Outputs:** Create new UTXOs:
        1.  One UTXO belonging to the pool, with a BTC balance increased by the deposited amount.
        2.  One UTXO belonging to the user (change), with a BTC amount equal to the user's input UTXO(s) minus the deposit amount and minus the transaction fee.

    This process effectively transfers the deposited BTC from the user to the pool while accounting for the network transaction fee.

3.  **Invoke step:**
    *   The frontend sends the user-signed PSBT along with an `IntentionSet` to the `invoke` method on the REE Orchestrator canister.
    *   The Orchestrator validates the PSBT and `IntentionSet`, calls the corresponding action method on the specified Exchange canister (as defined in Section 5), collects the exchange's signature on the PSBT, broadcasts the fully signed transaction to the Bitcoin network, and returns the Bitcoin transaction ID (`txid`).

    **Understanding the `invoke` Call and `IntentionSet`:**

    The Orchestrator's `invoke` function is the main entry point for executing actions within REE. It expects `InvokeArgs`:

    ```rust
    // Arguments for the Orchestrator's invoke function
    #[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
    pub struct InvokeArgs {
        pub psbt_hex: String,
        pub intention_set: IntentionSet,
        pub initiator_utxo_proof: Vec<u8>,
    }
    ```

    The crucial part is the `IntentionSet`, which details *what* the transaction aims to achieve:

    ```rust
    /// Represents a coin input in an intention.
    #[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq, Eq, PartialOrd, Ord)]
    pub struct InputCoin {
        /// The address of the owner of the coins
        pub from: String,
        pub coin: CoinBalance,
    }

    /// Represents a coin output in an intention.
    #[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq, Eq, PartialOrd, Ord)]
    pub struct OutputCoin {
        /// The address of the receiver of the coins
        pub to: String,
        pub coin: CoinBalance,
    }

    /// Represents an intention to perform an action in a specific pool of an exchange.
    #[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
    pub struct Intention {
        pub exchange_id: String,
        pub action: String,
        pub action_params: String,
        pub pool_address: String,
        pub nonce: u64,
        pub pool_utxo_spent: Vec<String>,
        pub pool_utxo_received: Vec<Utxo>,
        pub input_coins: Vec<InputCoin>,
        pub output_coins: Vec<OutputCoin>,
    }

    /// Represents a set of intentions to be executed in a transaction.
    #[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
    pub struct IntentionSet {
        /// The address of the initiator of the transaction
        pub initiator_address: String,
        /// The fee in satoshis for the transaction
        pub tx_fee_in_sats: u64,
        /// The list of intentions to be executed in the transaction
        pub intentions: Vec<Intention>,
    }
    ```

    For our deposit example, the `Intention` specifies:
    *   `action`: "deposit"
    *   `exchange_id`: The canister ID of the lending exchange
    *   `pool_address`: The address of the target pool
    *   `nonce`: The nonce received from `pre_deposit`
    *   `pool_utxo_spent`: Empty for a simple deposit (the pool doesn't spend existing UTXOs)
    *   `pool_utxo_received`: The new UTXO the pool will receive, combining the deposited amount with existing pool funds
    *   `input_coins`: The BTC amount the user is depositing from their wallet
    *   `output_coins`: Typically empty for a simple deposit (change is handled in the PSBT outputs)

    The Orchestrator validates fields such as `exchange_id` and `pool_address` and ensures the `IntentionSet` aligns with the PSBT data before calling the Exchange's action method.

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

## Summary

This completes the core implementation of the lending application. You can experience the deployed application or review the complete source code to understand implementation details not covered in this tutorial.

* **Live Demo:** [https://lending-demo.omnity.network/](https://lending-demo.omnity.network/)
* **Source Code:** [https://github.com/octopus-network/ree-lending-demo](https://github.com/octopus-network/ree-lending-demo)

Last updated on Nov 13, 2025