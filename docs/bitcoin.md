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

### get_btc_address
```md title="get_btc_address(args: GetBtcAddressArgs) -> String"

```
***Source*** : [`GetBtcAddressArgs`](https://github.com)

### get_main_btc_address
```md title="get_main_btc_address(token: String) -> String"

```

### generate_ticket_status
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"

```
***Source*** : [`GenTicketStatus`](https://github.com)

### get_pending_gen_ticket_requests
```md title="get_pending_gen_ticket_requests(args: GetGenTicketReqsArgs) -> Vec<GenTicketRequestV2>"

```
***Source*** : 
[`GetGenTicketReqsArgs`](https://github.com)
[`GenTicketRequestV2`](https://github.com)

### get_runes_oracles
```md title="get_runes_oracles() -> Vec<Principal>"

```
***Source*** : [`Principal`](https://github.com)

### estimate_redeem_fee
```md title="estimate_redeem_fee(arg: EstimateFeeArgs) -> RedeemFee"

```
***Source*** : 
[`EstimateFeeArgs`](https://github.com)
[`RedeemFee`](https://github.com)

### get_customs_info
```md title="get_customs_info() -> CustomsInfo"

```
***Source*** : [`ustomsInfo`](https://github.com)

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