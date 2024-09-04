---
sidebar_position: 3
---

# BITCOIN
OMNITY_SETTLEMENT_BITCOIN_CANISTER_ID=7rvjr-3qaaa-aaaar-qaeyq-cai

## Query
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawing operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Source*** : [`ReleaseTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L217)

## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Generate an cross-chain transaction from the bitcoin network on Omnity.
```
***Source*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L24)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L33)

#### Workflow: 
***1***. Call the corresponding bitcoin function from the UI and get the calculated function_hash.

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.