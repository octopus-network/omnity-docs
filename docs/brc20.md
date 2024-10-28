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

```md title="Rust Input Example:"
let args = GenerateTicketArgs {
		    txid: "271a75f2e4206106f47f81ab7cc8e6a9426f5aabb6eb59f3e2cfbea9ea8c0c60".to_string(),
            amount: 203,
            target_chain_id: "Bitfinity".to_string(),
            token_id: "Bitcoinbrc20-brc20-YCBS".to_string(),
		    receiver: "0x61359C8034534d4B586AC7E09Bb87Bb8Cb2F1561".to_string(),
	    };
let commit_request = BuildCommitRequest {
    session_key: String,
    tick: String,
    amount: String,
    sender: String,
    target_chain: String,
    receiver: String,
    fees: Option<Fees>,
    deposit_addr: String,
    deposit_public: String,
}
let reveal_transfer_request = BuildRevealTransferRequest {
    session_key: String,
   commit_tx_id: String,
}
```

#### Workflow: 
***1***. 

***2***. Put the txid as one of the parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

### get_deposit_addr
```md title="get_deposit_addr() -> (String, String)"
```

### brc20_state
```md title="brc20_state() -> StateProfile"

```
***Sources*** : [`StateProfile`](https://github.com/octopus-network/omnity-interoperability/)

### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the brc20 tokens withdrawal operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Sources*** : [`StateProfile`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of brc20 tokens available on Omnity.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/)
