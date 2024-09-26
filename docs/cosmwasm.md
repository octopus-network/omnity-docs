---
sidebar_position: 8
---

# CosmWasm[WIP]

|  | Canister ID |
| --- | --- |
| OMNITY_EXECUTION_OSMOSIS | ystyg-kaaaa-aaaar-qaieq-cai |

## Update
### redeem
```md title="redeem(tx_hash: TxHash) -> std::result::Result<TicketId, String>"
```
***Sources*** : 
[`TxHash`](https://github.com/octopus-network/omnity-interoperability/)
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/)


## Query
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation on the osmosis chain:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the osmosis chain.
* Unknown represents the operation is not completed.
```
***Sources*** : 
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/)
