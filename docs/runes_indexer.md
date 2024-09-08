---
sidebar_position: 3
---

# Runes Indexer
**Query Only**

The Ord canister periodically fetch bitcoin blocks from btc-rpc-proxy since 840000 using HTTP-outcall and resolve all transactions to RUNE UTXOs.

- ORD_CANISTER_ID = o25oi-jaaaa-aaaal-ajj6a-cai

### get_runes_by_utxo
```md title="get_runes_by_utxo(txid: String, vout: u32) -> Result<Vec<RuneBalance>, OrdError>"
Retrieve a list of RuneBalance contains information about the balance of the runes associated with a particular utxo from the vout and txid.
```
***Sources*** : 
[`RuneBalance`](https://github.com/octopus-network/ord-canister/blob/master/src/index/entry.rs#L15)
[`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/src/lib.rs#L40)

### get_height
```md title="get_height() -> Result<(u32, String), OrdError>"
Retrieve the current block height of the indexer and it is 4 blocks less than the latest height on the bitcoin chain.
```
***Sources*** : [`OrdError`](https://github.com/octopus-network/ord-canister/blob/master/src/lib.rs#L40)
