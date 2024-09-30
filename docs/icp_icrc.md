---
sidebar_position: 7
---

# ICP ICRC

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_ICP | nlgkm-4qaaa-aaaar-qah2q-cai | sICP |

## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
```
***Sources*** : 
[`GenerateTicketReq`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketOk`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/)

## Query
### get_account_identifier
```md title="get_account_identifier(principal: Principal) -> AccountIdentifier "
```
***Sources*** : 
[`Principal`](https://github.com/octopus-network/omnity-interoperability/)
[`AccountIdentifier`](https://github.com/octopus-network/omnity-interoperability/)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
```
***Sources*** : 
[`Chain`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<Token>"
```
***Sources*** : 
[`Token`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/)