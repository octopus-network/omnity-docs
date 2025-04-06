---
sidebar_position: 2
---

# REE Dev Guide

### Introduction to REE and Exchange
* ***What is REE? ***

REE (Runes Exchange Environment) is a decentralized execution layer for Bitcoin DeFi, enabling open and composable smart contracts to interact directly with Bitcoin assets—without the need for bridges, wrapped assets, or third-party wallets.

Unlike traditional Bitcoin Layer 2 solutions, REE preserves Bitcoin’s security while enhancing programmability through Turing-complete smart contracts, all while maintaining native Bitcoin transactions and a seamless user experience.

* ***Key Differences Between REE and Traditional Bitcoin L2 ***

| Feature          | Traditional Bitcoin L2 | REE (Bridgeless)           |
|------------------|------------------------|----------------------------|
| Asset Handling   | Requires bridging/wrapping | Direct native Bitcoin assets |
| Smart Contracts  | Limited Programmability| Fully Turing-complete|
| Signing Mechanism| Centralized/semi-centralized | Fully decentralized (via ICP)|
| Wallet Compatibility| Often needs new wallets| Works with native Bitcoin wallets|

* ***Key Advantages of REE ***

** REE offers compelling advantages for the Bitcoin DeFi ecosystem.** 
For end-users, it delivers a seamless experience by supporting standard Bitcoin wallets and enabling faster transactions - all while maintaining Bitcoin's robust security through decentralized validation. For developers, REE provides an open-source (FOSS), highly composable environment that facilitates easy protocol interoperability and shared liquidity. Builders gain additional power through a sophisticated smart contract platform, complete with comprehensive development tools, practical implementation examples, and integrated mechanisms for implementing value capture strategies.

---

### Core Concepts
* ***PSBT (Partially Signed Bitcoin Transaction)  ***

PSBT is a standardized Bitcoin transaction formatthat enables collaborative signing workflows on Bitcoin. The protocol's defining characteristic is its ability to let multiple parties sequentially sign individual transaction components offline, which are then aggregated into a final valid transaction for blockchain broadcast - establishing the foundation for secure multi-party transactions on Bitcoin.

* ***DPS (Decentralized PSBT Signing)  ***

DPS is REE's mechanism for handling transaction signing. It leverages the PSBT standard but decentralizes the signing process itself onto the ICP (Internet Computer Protocol) blockchain. This approach ensures signatures are managed transparently and trustlessly, without a central coordinator.

* ***Coin  ***

Within the REE environment, a **Coin** represents a unit of value based on Bitcoin's UTXO model. REE primarily recognizes native Bitcoin (BTC) and assets created using the Runes protocol as Coins.

* ***Pool  ***

A **Pool** functions as a managed container within an Exchange protocol. Controlled by its associated Exchange via ICP smart contracts, each Pool holds specific **Coin** assets (e.g., BTC or a particular Rune) along with the necessary state information and transaction history related to those assets.

* ***Exchange  ***

An **Exchange** is a specific Bitcoin DeFi (BTCFi) protocol built as a smart contract running on the REE platform. Its main role is to define the logic for asset interactions, primarily enabling the exchange of **Coins** between end-users and the **Pools** managed by the Exchange. Exchanges are responsible for validating transactions according to their predefined rules, managing the liquidity within their Pools, and participating in the DPS process to get transactions settled on the Bitcoin blockchain.

*(Note: The relationship between an Exchange and its Pools is often referred to as the 'Exchange-Pool Model', which is central to how REE applications manage UTXO-based assets.)*

* ***Orchestrator   ***

The **Orchestrator** is a critical component within REE that oversees the entire lifecycle of a transaction. It coordinates the necessary steps, including managing signature collection through DPS, validating UTXOs involved in the transaction, and handling final confirmations or initiating rollbacks if issues arise. The Orchestrator ensures that transactions are processed atomically and maintain consistency across the system.

---

###  Develop Your First Exchange
Developing a Basic Exchange Canister on the Internet Computer (IC).

This document provides a step-by-step guide to building a fundamental Exchange Canister on the Internet Computer, using a key feature from a hypothetical Lending DApp as an example. We’ll explore the process of enabling users to deposit BTC into a Lending Pool to earn interest, covering the essential implementation details.

- Demo: [https://ree-lending-demo.vercel.app/](https://ree-lending-demo.vercel.app/)
- GitHub: [https://github.com/octopus-network/ree-lending-demo](https://github.com/octopus-network/ree-lending-demo)

#### Prerequisites

Before you begin, ensure you meet the following requirements:

1.  **Basic Knowledge:** Understand the fundamentals of developing canisters using Rust and basic frontend development.
2.  **Development Environment:** Have the Rust toolchain and the DFINITY Canister SDK (dfx) installed.
    * **Install Rust:** [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
    * **Install dfx:** [https://internetcomputer.org/docs/building-apps/getting-started/install](https://internetcomputer.org/docs/building-apps/getting-started/install)

This document will not cover the installation process in detail.

#### Getting Started

*** 1. Create a New Project ***

We can use the `dfx` tool to quickly create a project template with a Rust backend canister and a React frontend:

```bash
dfx new --type rust --frontend react ree-demo-exchange
```

Executing this command generates the following project structure:

```
./ree-demo-exchange
├── src
│   ├── declarations          # Canister interface definitions
│   ├── ree-demo-exchange-backend # Backend Canister project (Rust)
│   └── ree-demo-exchange-frontend # Frontend project (React)
├── dfx.json                 # Dfx configuration file
└── ...                      # Other configuration files
```

* `ree-demo-exchange-backend`: This directory contains the Rust canister project where we will write the core logic.
* `ree-demo-exchange-frontend`: This directory contains the React project for the frontend user interface.

*** 2. Define the Core Data Structure: Pool ***

First, we need to define the core data structure representing a lending pool, `Pool`. A `Pool` primarily holds assets and records its state change history.

Create a new file `pool.rs` in the `ree-demo-exchange-backend/src` directory and define the following structures (code provided as a reference snippet):

```rust
// Pool represents the basic structure of a lending pool
// It maintains the pool's state history, metadata, and address information
pub struct Pool {
    pub states: Vec<PoolState>, // Chain of historical pool states
    pub meta: CoinMeta,
    pub pubkey: Pubkey,
    pub addr: String, // Pool address (cached to avoid re-acquisition costs)
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
* The `derivation_path` method generates a unique path based on the pool's base asset ID (`CoinId`). This is crucial for generating deterministic addresses using Chain-key technology, ensuring different pools have distinct addresses controlled by different underlying keys managed by the IC.

*** 3. Manage Pool State: `PoolState` ***

We need a way to represent the state of a pool at a specific point in time, usually after a transaction.

Define the `PoolState` struct within `pool.rs` (code provided as a reference snippet):

```rust
// PoolState represents the state of a pool
// A new PoolState is created and added to the Pool's states chain after each transaction
pub struct PoolState {
    pub id: Option<Txid>, // Transaction ID that created this state (None for initial state)
    pub nonce: u64,       // Incremental counter to prevent replay attacks
    pub utxo: Option<Utxo>, // The UTXO holding the pool's assets
}
```

We can then implement methods on the `Pool` struct to manage these states (code provided as a reference snippet):

```rust
impl Pool {
    // ... (derivation_path and other methods) ...

    // Finalize a transaction by making its state the new base state
    // Removes all states before the specified transaction
    pub(crate) fn finalize(&mut self, txid: Txid) -> Result<(), ExchangeError> {
        let idx = self
            .states
            .iter()
            .position(|state| state.id == Some(txid))
            .ok_or(ExchangeError::InvalidState("txid not found".to_string()))?;
        if idx == 0 {
            return Ok(());
        }
        self.states.rotate_left(idx);
        self.states.truncate(self.states.len() - idx);
        Ok(())
    }

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

*** 4. Store Pool Data ***

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

*** 5. Initialize a Demo Pool ***

For demonstration purposes, it's useful to have a function that initializes a sample `Pool` when the canister is deployed or upgraded. This function is usually restricted to the canister's controller.

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

*** 6. Implement Required Exchange Methods (Partial) ***

An Exchange canister interacting with a framework like REE (Rune Exchange Engine) usually needs to implement a standard set of interface methods. The six required methods mentioned are: `get_pool_list`, `get_pool_info`, `get_minimal_tx_value`, `rollback_tx`, `new_block`, and `execute_tx`.

Let's implement the first three query methods. Create a new file `exchange.rs` in `ree-demo-exchange-backend/src` (code provided as reference snippets):

```rust
#[query]
// Returns a list of all lending pools
// Each pool entry contains its name (symbol) and address
pub fn get_pool_list() -> GetPoolListResponse {
    let pools = crate::get_pools(); // Assumes a helper function get_pools() exists
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
    let p = crate::get_pool(&pool_address)?; // Assumes a helper function get_pool() exists

    Some(PoolInfo {
        key: p.pubkey.clone(),
        name: p.meta.symbol.clone(),
        key_derivation_path: vec![p.meta.id.to_bytes()], // Simplified example path
        address: p.addr.clone(),
        nonce: p.states.last().map(|s| s.nonce).unwrap_or_default(),
        btc_reserved: p.states.last().map(|s| s.btc_supply()).unwrap_or_default(), // Assumes btc_supply() helper
        coin_reserved: p
            .states
            .last()
            .map(|s| {
                vec![CoinBalance {
                    id: p.meta.id,
                    value: s.rune_supply() as u128, // Assumes rune_supply() helper
                }]
            })
            .unwrap_or_default(),
        utxos: p
            .states
            .last()
            .and_then(|s| s.utxo.clone())
            .map(|utxo| vec![utxo])
            .unwrap_or_default(),
        attributes: p.attrs(), // Assumes attrs() helper
    })
}


#[query]
// Returns the minimum transaction value required for acceptance by the exchange
// Normally, the difficulty (minimal value) increases as zero_confirmed_tx_queue_length grows
// Longer queues require higher transaction values to prevent spam and congestion
fn get_minimal_tx_value(_args: GetMinimalTxValueArgs) -> GetMinimalTxValueResponse {
    // In this demo implementation, the minimal value is fixed
    // In a production environment, this would scale based on _args.zero_confirmed_tx_queue_length
    pool::MIN_BTC_VALUE // Assumes a constant MIN_BTC_VALUE exists
}
```

**Explanation:**

* `get_pool_list`: A `#[query]` method (read-only, fast) that iterates through the stored pools (assuming a helper like `get_pools()`) and returns a list of basic pool information (`PoolBasic`).
* `get_pool_info`: A `#[query]` method that takes a `pool_address`, looks up the corresponding `Pool` (assuming a helper like `get_pool()`), and returns detailed `PoolInfo` if found. It extracts data like `nonce`, asset reserves, and `utxos` from the latest `PoolState`.
* `get_minimal_tx_value`: A `#[query]` method. In a real exchange, this value helps manage transaction flow and prevent dust spam, often scaling with the length of the pending transaction queue (`zero_confirmed_tx_queue_length`). This simplified demo returns a fixed constant value.

*** 7. Implementing the Deposit Functionality (Overview) ***

Now, let's outline how to implement the user deposit functionality (e.g., depositing BTC into a Pool). We'll use the **pre/invoke pattern**, common in designs like REE involving user signatures and external blockchain interactions:

1.  **Pre-computation:**
    * The frontend (or caller) invokes a "pre" method on the Exchange canister (e.g., `pre_deposit`).
    * This method doesn't change state but calculates the necessary parameters to build the Bitcoin transaction (PSBT - Partially Signed Bitcoin Transaction) based on the request (e.g., deposit amount) and the current `Pool` state. This includes the target `Pool` address, amount, required fees, current `nonce`, etc.
    * The canister returns these parameters to the frontend.

2.  **Transaction Construction & Signing:**
    * The frontend uses the parameters received from the "pre" method to construct a PSBT.
    * The frontend prompts the user to sign the PSBT inputs belonging to them using their Bitcoin wallet or signing tool.

3.  **Invocation:**
    * The frontend (or an Orchestrator Canister) sends the signed PSBT to an "invoke" method on the Exchange canister (e.g., `execute_tx`).
    * This method validates the PSBT (signatures, amounts, etc.) and checks requirements (like `get_minimal_tx_value`).
    * **Crucially:** It calls an Orchestrator service (part of the REE framework or similar) to submit the valid PSBT to the Bitcoin network.
    * It may create a temporary `PoolState` to track the pending transaction.
    * It waits for Bitcoin network confirmation (handled by the Orchestrator, which notifies the Exchange via methods like `new_block`).
    * Once confirmed, the `Pool`'s base state is updated using `finalize`.

**Next Steps:**

The next phase involves implementing the specific logic for the `pre_deposit` (or similar pre-computation method) and `execute_tx` methods. It also requires handling callbacks from the Orchestrator, such as `new_block` (for transaction confirmation) and `rollback_tx` (for handling blockchain reorganizations), to correctly manage `PoolState` updates.

---




### State Management 
[To be added]

---

### Next Steps and Resources
Congratulations on deploying your first Exchange on REE! Continue your journey with additional resources, examples, tools, and support channels.

#### Additional Resources

* ***Core Development & Learning   ***
- [IC Developer Docs](https://internetcomputer.org/docs/home)**: Official documentation for the Internet Computer Protocol, covering development concepts and guides relevant to REE canisters.
- [REE Type Definitions](https://github.com/octopus-network/ree-types)**: This repository contains the essential data type definitions for the REE (Runes Exchange Environment).

* ***Tools & Explorers   ***
- [Testnet Runescan](https://testnet.runescan.net/)**: REE transaction explorer for the testnet.
- [Mainnet Runescan](https://runescan.net/)**: REE transaction explorer for the mainnet.
- [Testnet Orchestrator Dashboard](https://dashboard.internetcomputer.org/canister/hvyp5-5yaaa-aaaao-qjxha-cai)**: Interface to view the status and details of the testnet Orchestrator canister.

* ***Examples & Code Repositories   ***

* RichSwap AMM DEX:
- [RichSwap Application](https://richswap.io): An AMM-based decentralized exchange allowing trustless swaps of Bitcoin and Runes assets.
- [RichSwap Canister Code](https://github.com/octopus-network/richswap-canister): Source code for the RichSwap exchange canister.
* REE Lending Demo:
- [Lending Demo Application](https://ree-lending-demo.vercel.app/): A demonstration application showcasing lending functionalities built on REE.
- [Lending Demo Code](https://github.com/octopus-network/ree-lending-demo): Source code for the REE lending demo.

* ***Get Technical Support   ***
- [REE Dev Support Channel (English)](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/3944635384)
- [REE Dev Support Channel (Chinese)](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/2543618207)



* ***Appendix   ***

** Common Terminology **

[To be added]

** Frequently Asked Questions **

[To be added]






Last updated on April 6, 2025