---
sidebar_position: 3
---

# Runes Indexer
**Query Only**

**[The ord canister](https://github.com/octopus-network/ord-canister)** periodically fetch bitcoin blocks from btc-rpc-proxy since 840000 using http-outcall and resolve all transactions to runes utxos. The main purpose of this canister is providing an online decentralized runes indexer for querying all etched runes assets given a utxo. See how it is used in [Omnity](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/oracle_canister/src/oracle.rs#L26).

|  | Canister Id |
| --- | --- |
| ORD_CANISTER | o25oi-jaaaa-aaaal-ajj6a-cai |

### get_runes_by_utxo
```md title="get_runes_by_utxo(txid: String, vout: u32) -> Result<Vec<RuneBalance>, OrdError>"
Retrieve a list of RuneBalance contains information about the balance of the runes associated with a particular utxo from the vout and txid.
```
```jsx title="Rust Usage Example:"
use rune_indexer_interface::*;
let indexer = Principal::from_text("o25oi-jaaaa-aaaal-ajj6a-cai").unwrap();
let (result,): (Result<Vec<RuneBalance>, OrdError>,) = ic_cdk::call(indexer, "get_runes_by_utxo", ("ee8345590d85047c66a0e131153e5202b9bda3990bd07decd9df0a9bb2589348", 0)).await.unwrap();
```
***Sources*** : 
[`RuneBalance`](https://github.com/octopus-network/ord-canister/blob/master/src/index/entry.rs#L15)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/src/lib.rs#L40)

### get_height
```md title="get_height() -> Result<(u32, String), OrdError>"
Retrieve the current block height of the indexer and it is 4 blocks less than the latest height on the bitcoin chain.
```
***Sources*** : [`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/src/lib.rs#L40)
