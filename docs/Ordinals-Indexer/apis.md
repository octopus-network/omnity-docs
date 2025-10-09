---
sidebar_position: 1
---

# APIs
The **[Ordinals Indexer](https://github.com/octopus-network/ordinals-indexer)** has indexed all Bitcoin blocks since genesis, utilizing nearly 200 GB of on-chain storage on the Internet Computer (IC) — yet another testament to IC’s remarkable on-chain computation and storage capabilities.

|  | Canister Id |
| --- | --- |
| ORDINALS INDEXER | t5v7z-6iaaa-aaaai-atihq-cai |
| ORDINALS INDEXER TESTNET| krhn4-hiaaa-aaaao-qkb3a-cai |

## Query
### get_inscriptions_for_output
Enter an outpoint to get a list of inscription IDs.
```md 
get_inscriptions_for_output : (text) -> (Result) query

type Result = variant { Ok : opt vec text; Err : text };
```
Parameters:
* outpoint: String

Returns:
* list of inscription IDs

### get_latest_block
Get the latest block
```md 
get_latest_block : () -> (nat32, text) query;
```

Returns:
* height
* hash

Last updated on October 9, 2025