---
sidebar_position: 3
---

# Runes Indexer
**Query Only**

**[Runes Indexer](https://github.com/octopus-network/runes-indexer)** is a canister deployed on the ic that continuously fetches bitcoin blocks through https outcalls from bitcoin rpc. The blocks are verified using ic's bitcoin integration. Once verified, the indexer parses and indexes runes information within each block. See how it is used in [Omnity](https://github.com/octopus-network/omnity-interoperability/tree/main/proxy/runes_proxy).

[This guide](https://github.com/octopus-network/runes-indexer/blob/master/development-guide.md) assists developers in setting up their local development environment and running tests for Runes Indexer.

|  | Canister Id |
| --- | --- |
| CANISTER | kzrva-ziaaa-aaaar-qamyq-cai |

### get_latest_block
```md title="get_latest_block() -> (u32, String)"
Returns the latest indexed block height and hash.
```
***Sources*** : 
[`codes`](https://github.com/octopus-network/runes-indexer/blob/master/canister/src/main.rs#L14)
[`example`](https://github.com/octopus-network/runes-indexer?tab=readme-ov-file#get_latest_block)

### get_etching
```md get_etching(txid: String) -> Option<GetEtchingResult>"
Retrieves the rune_id that was etched in a specific transaction.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```
***Sources*** : 
[`codes`](https://github.com/octopus-network/runes-indexer/blob/master/canister/src/main.rs#L21)
[`example`](https://github.com/octopus-network/runes-indexer?tab=readme-ov-file#get_etching)

### query_rune
```md get_rune(str_spaced_rune: String) -> Option<RuneEntry>"
Retrieves detailed information about a rune using its spaced name.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```
***Sources*** : 
[`codes`](https://github.com/octopus-network/runes-indexer/blob/master/canister/src/main.rs#L33)
[`example`](https://github.com/octopus-network/runes-indexer?tab=readme-ov-file#get_rune)

### get_rune_by_id
```md get_rune_by_id(str_rune_id: String) -> Option<RuneEntry>"
Similar to get_rune, but uses the rune_id as identifier instead of the spaced name.
```
***Sources*** : 
[`codes`](https://github.com/octopus-network/runes-indexer/blob/master/canister/src/main.rs#L63)
[`example`](https://github.com/octopus-network/runes-indexer?tab=readme-ov-file#get_rune_by_id)

### get_rune_balances_for_outputs
```md title="get_rune_balances_for_outputs(outpoints: Vec<String>) -> Result<Vec<Option<Vec<RuneBalance>>>, Error> "
Retrieves rune balances for a list of transaction outputs.
```
***Sources*** : 
[`codes`](https://github.com/octopus-network/runes-indexer/blob/master/canister/src/main.rs#L92)
[`example`](https://github.com/octopus-network/runes-indexer?tab=readme-ov-file#get_rune_balances_for_outputs)