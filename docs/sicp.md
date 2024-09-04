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

### get_account_identifier
```md title="get_account_identifier(principal: Principal) -> AccountIdentifier"

```
***Source*** : 
[`Principal`](https://github.com)
[`AccountIdentifier`](https://github.com)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"

```
***Source*** : [`Chain`](https://github.com)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"

```
***Source*** : [`TokenResp`](https://github.com)


## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
Generate an cross-chain transaction from the icp on Omnity.
```
***Source*** : 
[`GenerateTicketReq`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L18)
[`GenerateTicketOk`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L29)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L34)

#### Workflow: 
***1***. Call the corresponding function on icp from the UI and get the calculated function_hash.

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/icp/src/service.rs#L43) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.