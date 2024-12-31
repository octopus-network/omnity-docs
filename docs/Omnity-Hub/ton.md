---
sidebar_position: 10
---

# Ton

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_EXECUTION_TON | p5ykc-qaaaa-aaaar-qalyq-cai | Ton |

## Update
### generate_ticket
```md title="generate_ticket(params: GenerateTicketArgs) -> Result<Ticket, String>"
Generate an cross-chain transaction from ton network on Omnity.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/)
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/)

```md title="Curl Request Example:"
curl -X POST -H "Content-Type:application/json" --data 
'{
target_chain: "Bitfinity".to_string(),
receiver: "0x61359C8034534d4B586AC7E09Bb87Bb8Cb2F1561".to_string(),
amount: 10000,
user_addr: "UQBHU4zFh3V1RVBnoduXarBdaTGpo-vDcT-jadel-hIpmyti".to_string(),
jetton_master: "EQCW0ddLCQAn011bb8T2Xdoa40v6A_bL3cfjn0bplXdSKnWa".to_string(),
bridge_fee: 500000000,
}' https://brc20-mint.mainnet.octopus.network/jetton_burn
```
* jetton_master: The token contract on Ton. Each token has a jetton_master contract on the Ton.

```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the token(e.g. $sICP-icrc-ckUSDC has 8 decimals so the input 1 will be 1*100_000_000).
let args = GenerateTicketArgs {
		tx_hash: "GOvuG2BbZdgtXHpCjlAuXuOUw3P5YDcH6u32yRgW/bM=".to_string(),
		token_id: "sICP-icrc-ckBTC".to_string(),
		sender: "UQD6DGveyyksJg_fahtJx-8qTe5ySuzN2UmqamResj2NRgEO".to_string()
		amount: 7000,
		target_chain_id: "sICP".to_string()
		receiver: "0xd1f4711f22e600E311f9485080866519ad4FbE3e".to_string(),
	}
```

#### Workflow: 
***1***. The UI will triger the [build_jetton_burn](https://github.com/octopus-network/brc20-mint/blob/main/src/main.rs#L60) function by making a http call using curl as shown in the example above to form the txid.

***2***. Put the txid as one of the parameter(GenerateTicketReq) into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

## Query
### get_ticket
```md title="get_ticket(ticket_id: String) -> Option<(u64, Ticket)>"
Retrieve the ticket information based on the ticket_id from the TON route received.
```
***Sources*** : [`Ticket`](https://github.com/octopus-network/omnity-interoperability/)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with this ton canister.
```
***Sources*** : 
[`Chain`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of tokens available on this ton canister.
```
***Sources*** : 
[`TokenResp`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation on the ton:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the ton.
* Unknown represents the operation is not completed.
```
***Sources*** : [`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/)

### get_fee
```md title="get_fee(chain_id: ChainId) -> (Option<u64>, String)"
Retrieve the transaction fee based on chain_id as the target chain.
```
***Sources*** : [`ChainId`](https://github.com/octopus-network/omnity-interoperability/)