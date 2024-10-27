---
sidebar_position: 9
---

# BRC20[WIP]

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_BRC20 | 72whx-eiaaa-aaaar-qaiva-cai | Bitcoinbrc20 |

**Update:**
### generate_ticket
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Generate an cross-chain transaction from the bitcoin network on Omnity for brc20 tokens.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/)

### get_deposit_addr
```md title="get_deposit_addr() -> (String, String)"
```

### brc20_state
```md title="brc20_state() -> StateProfile"

```
***Sources*** : [`StateProfile`](https://github.com/octopus-network/omnity-interoperability/)

### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"

```
***Sources*** : [`StateProfile`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of brc20 tokens available on Omnity.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/)
