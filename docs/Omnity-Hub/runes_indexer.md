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
[`RuneBalance`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L24)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L70)

### query_runes
```md query_runes(outpoints: Vec<String>) -> Result<Vec<Option<Vec<OrdRuneBalance>>>, OrdError>"
The replacement for get_runes_balances (which previously had no valid return if there were fewer than 4 confirmations) now includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```
***Sources*** : 
[`OrdRuneBalance`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L30)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L70)

### get_etching
```md get_etching(txid: String) -> Result<Option<OrdEtching>, OrdError>"
Check whether a transaction involves etching runes.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```
***Sources*** : 
[`OrdEtching`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L39)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L70)

### get_rune_entry_by_rune_id
```md get_rune_entry_by_rune_id(rune_id: String) -> Result<OrdRuneEntry, OrdError>"
Query rune info by rune_id.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```
***Sources*** : 
[`OrdRuneEntry`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L53)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L70)

### get_height
```md title="get_height() -> Result<(u32, String), OrdError>"
Retrieve the current block height of the indexer and it is the latest height on the bitcoin chain and its hash.
```
***Sources*** : [`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/interface/src/lib.rs#L70)