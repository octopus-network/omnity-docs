---
sidebar_position: 2
---

# REE Dev Guide

### Introduction to REE and Exchange
* ***What is REE? ***

REE (Runes Exchange Environment) is a decentralized, Turing-complete execution layer built specifically for Bitcoin. Unlike traditional Bitcoin Layer-2 solutions, REE enables native Bitcoin transactions without asset bridging or locking, leveraging Bitcoin's security and enhancing programmability through smart contracts.

* ***Key differences between REE and traditional Bitcoin L2 ***

| Feature          | Traditional Bitcoin L2 | REE (Bridgeless)      |
|------------------|------------------------|-----------------------|
| Asset custody    | Bridging required      | No bridging, native UX|
| Smart Contracts  | Limited programmability| Fully Turing-complete |
| Signing          | Centralized or semi-centralized | Decentralized via ICP |

* ***What is an Exchange (BTCFi Protocol)? ***

An Exchange is a BTCFi protocol implemented as a smart contract on the REE platform. Exchanges manage asset pools, validate transaction inputs/outputs, and participate in decentralized PSBT signing and settlement directly on Bitcoin.

For example, [RichSwap](https://richswap.io) is an AMM-based decentralized exchange that allows users to swap Bitcoin and Runes assets trustlessly.



### Core Concepts
* ***PSBT (Partially Signed Bitcoin Transaction)  ***

PSBT is a standardized Bitcoin transaction format that allows multiple participants to sign different parts independently before broadcasting a single aggregated transaction.

* ***DPS (Decentralized PSBT Signing)  ***

REE implements DPS by decentralizing the PSBT signing process onto the ICP blockchain, ensuring transparency and trustless transactions.

* ***Pool and Exchange  ***

A Pool is an Exchange-managed unit holding Bitcoin assets and managing transaction states and histories. Pools are managed through ICP smart contracts.

Exchanges interact with pools, signing transactions, managing liquidity, and executing predefined protocol logic.

* ***Orchestrator   ***

The Orchestrator coordinates transactions, manages signatures, validates UTXOs, and handles confirmations or rollbacks, ensuring atomicity and consistency.



###  Develop Your First Exchange
This section guides you through setting up your environment and creating a simple Exchange (DemoExchange) on REE using Rust and ICP.

* ***Environment Setup   ***

Install the required tools:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
npm install -g dfx
```

* ***Required Exchange Interfaces   ***

Every exchange must implement six core interfaces to interact with the REE Orchestrator:

* Query Interfaces

These interfaces can be implemented as either query or update calls:

1. **get_pool_list**
   - Returns a list of pools maintained by the exchange
   - Parameters: `from` (optional starting point), `limit` (max pools to return)
   - Return Type: List of pools with basic info (key, name, address, balances)
   - Example:
   ```rust
   #[ic_cdk_macros::query]
   fn get_pool_list(args: GetPoolListArgs) -> Vec<PoolOverview> {
       // Return list of pools with pagination support
       // Implementation details...
   }
   ```

2. **get_pool_info**
   - Returns detailed information about a specified pool
   - Parameters: Pool's Bitcoin address
   - Return Type: Detailed pool information including UTXOs and attributes
   - Example:
   ```rust
   #[ic_cdk_macros::query]
   fn get_pool_info(args: GetPoolInfoArgs) -> Option<PoolInfo> {
       // Return detailed information about a specific pool
       // Implementation details...
   }
   ```

3. **get_minimal_tx_value**
   - Returns the minimum transaction value that can be accepted
   - Parameters: Pool address and number of unconfirmed transactions
   - Return Type: Minimum transaction value in satoshis
   - Example:
   ```rust
   #[ic_cdk_macros::query]
   fn get_minimal_tx_value(args: GetMinimalTxValueArgs) -> u64 {
       // Calculate minimum acceptable transaction value
       // Implementation details...
   }
   ```

* Update Interfaces

These interfaces must be implemented as update calls:

4. **execute_tx**
   - Executes a transaction in the exchange
   - Parameters: PSBT hex, transaction ID, intention set, and queue info
   - Return Type: Signed PSBT data or error message
   - Example:
   ```rust
   #[ic_cdk_macros::update]
   fn execute_tx(args: ExecuteTxArgs) -> Result<String, String> {
       // Execute transaction and optionally sign PSBT
       // Implementation details...
   }
   ```

5. **finalize_tx**
   - Finalizes a confirmed transaction and all preceding transactions
   - Parameters: Pool's public key and transaction ID
   - Return Type: Success or error message
   - Example:
   ```rust
   #[ic_cdk_macros::update]
   fn finalize_tx(args: FinalizeTxArgs) -> Result<(), String> {
       // Finalize transaction and update state
       // Implementation details...
   }
   ```

6. **rollback_tx**
   - Rolls back an unconfirmed transaction and all following transactions
   - Parameters: Pool's public key and transaction ID
   - Return Type: Success or error message
   - Example:
   ```rust
   #[ic_cdk_macros::update]
   fn rollback_tx(args: RollbackTxArgs) -> Result<(), String> {
       // Rollback transaction and revert state
       // Implementation details...
   }
   ```

* ***Implementation Notes   ***

- The Orchestrator calls these functions without attaching any cycles
- Query interfaces can be implemented as either query or update calls
- Update interfaces must be implemented as update calls
- All interfaces must exactly match the type definitions from the [`ree_types::exchange_interfaces`](https://github.com/octopus-network/ree-types/blob/master/src/exchange_interfaces.rs) module
- Functions can be implemented as either async or synchronous

* ***Register Exchange with the Orchestrator   ***

To integrate your Exchange, register it with the REE Orchestrator (Testnet Orchestrator canister: [ICP Dashboard](https://dashboard.internetcomputer.org/canister/hvyp5-5yaaa-aaaao-qjxha-cai)).

Example Rust code:
```rust
use ic_cdk::api::call::call;

async fn register_exchange(exchange_id: &str, orchestrator_id: &str) {
    let _: Result<(), _> = call(
        orchestrator_id.parse().unwrap(),
        "registerExchange",
        (exchange_id.to_string(), ic_cdk::api::id().to_string()),
    )
    .await;
}
```

* ***Frontend Integration Example   ***

Here's how to integrate your Exchange canister with a frontend application:
```javascript
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./demo_exchange.did.js";

const agent = new HttpAgent({ host: "http://localhost:8000" });
const demoExchange = Actor.createActor(idlFactory, {
  agent,
  canisterId: "your-canister-id",
});

// Get pool information
const pools = await demoExchange.get_pool_list({ limit: 10 });
const poolInfo = await demoExchange.get_pool_info({ 
    pool_address: pools[0].address 
});

// Get minimum transaction value
const minValue = await demoExchange.get_minimal_tx_value({
    pool_address: pools[0].address,
    zero_confirmed_tx_queue_length: 0
});

// Execute a transaction
const result = await demoExchange.execute_tx({
    psbt_hex: "...",
    txid: "...",
    intention_set: { /* ... */ },
    intention_index: 0,
    zero_confirmed_tx_queue_length: 0
});
```

* ***Simple Transaction Testing   ***
1. Start your local ICP environment:
```bash
dfx start
```

2. Deploy the Exchange to your local environment:
```bash
dfx deploy
```

3. Test transaction flow through your frontend.
Completing these steps ensures your DemoExchange is operational and ready for further development or deployment.


### Next Steps and Resources
You've successfully created your first Exchange on REE! Continue your journey with additional resources and support channels.

* ***Additional Resources   ***
- [ICP Developer Center](https://internetcomputer.org): Learn more about developing smart contracts on ICP.
- [REE GitHub Repository](https://github.com/ree): Access open-source examples, contribute code, and report issues.

* ***Get Technical Support   ***
- [REE Dev Support Channel (English)](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/3944635384)
- [REE Dev Support Channel (Chinese)](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/2543618207)



* ***Appendix   ***

** Common Terminology **

| Term           | Description                                   |
|----------------|-----------------------------------------------|
| PSBT           | Partially Signed Bitcoin Transaction           |
| DPS            | Decentralized PSBT Signing                    |
| Exchange       | Smart contracts handling BTCFi logic on REE   |
| Pool           | Unit for holding and managing Bitcoin assets  |
| Orchestrator   | Coordinates and manages Exchange transactions |
| ICP            | Internet Computer Protocol                    |
| UTXO           | Unspent Transaction Output                    |

** Frequently Asked Questions **

- **How can I verify transaction status?**  
  Use the Orchestrator's status query interface regularly.

- **What should I do if my transaction doesn't broadcast?**  
  Verify PSBT signatures and ensure correctness, then retry submission.

- **How do I ensure state consistency with Bitcoin?**  
  Synchronize state updates regularly through the Orchestrator.







Last updated on March 20, 2025