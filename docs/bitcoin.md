---
sidebar_position: 3
---

# BITCOIN
OMNITY_CUSTOMS_BITCOIN_CANISTER_ID=7rvjr-3qaaa-aaaar-qaeyq-cai

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

```
***Source*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L24)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L33)