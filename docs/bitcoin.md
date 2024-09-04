---
sidebar_position: 3
---

# Bitcoin
OMNITY_SETTLEMENT_BITCOIN_CANISTER_ID=7rvjr-3qaaa-aaaar-qaeyq-cai

## Query
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawing operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Sources*** : [`ReleaseTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L217)

### get_btc_address
```md title="get_btc_address(args: GetBtcAddressArgs) -> String"

```
***Sources*** : [`GetBtcAddressArgs`](https://github.com)

### get_main_btc_address
```md title="get_main_btc_address(token: String) -> String"

```

### generate_ticket_status
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"
Retrieve the status of ticket_id generating operation.
```
***Sources*** : [`GenTicketStatus`](https://github.com)

### get_runes_oracles
```md title="get_runes_oracles() -> Vec<Principal>"
Get the list of runes oracles canister id.
```
***Sources*** : [`Principal`](https://github.com)

### estimate_redeem_fee
```md title="estimate_redeem_fee(arg: EstimateFeeArgs) -> RedeemFee"
Get the estimated fee needed for redeeming chain_id on bitcoin network.
```
***Sources*** : 
[`EstimateFeeArgs`](https://github.com)
[`RedeemFee`](https://github.com)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with bitcoin network.
```
***Sources*** : [`Chain`](https://github.com)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on bitcoin network.
```
***Sources*** : [`TokenResp`](https://github.com)



## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Generate an cross-chain transaction from bitcoin network on Omnity.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L24)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L33)

#### Workflow: 
***1***. Call the corresponding bitcoin function from the UI and get the calculated function_hash.

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.