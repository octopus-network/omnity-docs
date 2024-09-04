---
sidebar_position: 6
---

# EICP
OMNITY_EXECUTION_ICP_CANISTER_ID = 7ywcn-nyaaa-aaaar-qaeza-cai

## Query
### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```
***Source*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/state.rs#L15)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"

```
***Source*** : [`Chain`](https://github.com)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"

```
***Source*** : [`TokenResp`](https://github.com)

### get_token_ledger
```md title="get_token_ledger(token_id: String) -> Option<Principal> "

```
***Source*** : [`Principal`](https://github.com)

### get_fee_account
```md title="get_fee_account(principal: Option<Principal>) -> AccountIdentifier"

```
***Source*** : 
[`Principal`](https://github.com)
[`AccountIdentifier`](https://github.com)

### get_redeem_fee
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u64>"

```
***Source*** : [`ChainId`](https://github.com)


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