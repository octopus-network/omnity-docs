---
sidebar_position: 4
---

# SICP
OMNITY_SETTLEMENT_ICP_CANISTER_ID=nlgkm-4qaaa-aaaar-qah2q-cai

## Query
### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the tokens withdrawal operation:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the icp.
* Unknown represents the operation is not completed.
```
***Source*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L773)