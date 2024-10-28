---
sidebar_position: 9
---

# BRC20

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

```md title="Curl Request Example:"
curl -X POST -H "Content-Type:application/json" --data 
'{
 "tick": "YCBS",   
 "fee_rate": 21,
 "amount":"11.22", 
 "sender":"bc1qyelgkxpfhfjrg6hg8hlr9t4dzn7n88eajxfy5c", 
  "target_chain": "Bitfinity", 
  "receiver":"0x61359C8034534d4B586AC7E09Bb87Bb8Cb2F1561",
  "deposit_addr":"bc1qgz3fv48f9q480wr2lgc9eq97k36kq0qg2mr0jg",
  "deposit_public":"02eec672e95d002ac6d1e8ba97a2faa9d94c6162e2f20988984106ba6265020453",
}' https://brc20-mint.mainnet.octopus.network/build
```
* fee_rate is the current estimated transaction fee rate by the wallet.
* deposit_addr and deposit_public are hardcoded and can be obtained from brc20_customs.

```md title="Rust Input Example:"
let args = GenerateTicketArgs {
		    txid: "271a75f2e4206106f47f81ab7cc8e6a9426f5aabb6eb59f3e2cfbea9ea8c0c60".to_string(),
            amount: 203,
            target_chain_id: "Bitfinity".to_string(),
            token_id: "Bitcoinbrc20-brc20-YCBS".to_string(),
		    receiver: "0x61359C8034534d4B586AC7E09Bb87Bb8Cb2F1561".to_string(),
	    };
```

#### Workflow: 
***1***. The UI will triger the [commit&reveal&tranfer](https://github.com/octopus-network/brc20-mint/blob/main/src/main.rs#L55) function by making a http call using curl as shown in the example above. Each of these functions will call the [wallet api](https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider#signpsbt) to sign the transaction and return the transaction hash. The three returned strings will be combined into an array, like [StringA, StringB, StringC], to form the txid.

***2***. Put the txid as one of the parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

--------
**Query:**
### get_deposit_addr
```md title="get_deposit_addr() -> (String, String)"
Retrieve the token locking account for the brc20 tokens.
```

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
