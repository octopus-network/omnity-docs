---
sidebar_position: 9
---

# BRC20

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_BRC20 | 72whx-eiaaa-aaaar-qaiva-cai | Bitcoinbrc20 |

**Update:**
### generate_ticket
Generate an cross-chain transaction from the bitcoin network on Omnity for brc20 tokens.
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Parameters:
req: GenerateTicketArgs - struct containing:
        * txid: String - the transaction id from the bitcoin transaction
        * amount: String
        * target_chain_id: String
        * token_id: String
        * receiver: String

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```
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
***1***. The UI will triger the [commit&reveal&tranfer](https://github.com/octopus-network/brc20-mint/blob/main/src/main.rs#L55) function by making a http call using curl as shown in the example below. Each of these functions will call the [wallet api](https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider#signpsbt) to sign the transaction and return the transaction hash. The three returned strings will be combined into an array, like [StringA, StringB, StringC], to form the txid.
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
* deposit_addr and deposit_public are hardcoded and can be obtained from [get_deposit_addr](https://docs.omnity.network/docs/Omnity-Hub/brc20#get_deposit_addr).

***2***. Put the txid as one of the parameter into generate_ticket from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

--------

**Query:**
### get_deposit_addr
Retrieve the token locking account for the brc20 tokens.
```md title="get_deposit_addr() -> (String, String)"
Returns: 
a tuple containing:
deposit_addr and deposit_public
```

### release_token_status
Returns the status of the brc20 tokens withdrawal operation
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns:
ReleaseTokenStatus: a enum containing:
        * Unknown - the request id is either invalid or too old
        * Pending - the request is in the batch queue
        * Signing - waiting for a signature on a transaction satisfy this request
        * Sending(String) - sending the transaction satisfying this request
        * Submitted(String) - awaiting for confirmations on the transaction satisfying this request
        * Confirmed(String) - confirmed a transaction satisfying this request
```

### get_token_list
Retrieve a list of brc20 tokens available on Omnity.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: a list of struct containing:
    * token_id: TokenId 
    * symbol: String 
    * decimals: u8 
    * icon: Option<String> 

e.g.: decimals=18; token_id="Bitcoinbrc20-brc20-1kBTC"; icon=opt "https://raw.githubusercontent.com/octopus-network/omnity-token-imgs/refs/heads/main/1kBTC.png"; symbol="1kBTC"
```

Last updated on January 25, 2025