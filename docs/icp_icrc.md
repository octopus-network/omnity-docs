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
Generate an cross-chain transaction from icp network on Omnity.
```
***Sources*** : 
[`GenerateTicketReq`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketOk`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/)

```md title="Rust Input Example:"
let args = GenerateTicketReq {
		target_chain_id: "Bitcoin".to_string(),
		receiver: "bc1qh8u0gpw2ze6qdeltnknxmyk8wpqnpmtr8ph9nc".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
	}
```

#### Workflow: 
***1***. On the icp side, the corresponding wrapped icrc runes token will be burned by calling the ledger.approve for the sender, and from the bitcoin side, the ord indexer will verify the sender account to see if there is original runes tokens, if so, will transfer from the generated bitcoin account to the receiver account.

***2***. Put the GenerateTicketReq as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

## Query
### get_account_identifier
```md title="get_account_identifier(principal: Principal) -> AccountIdentifier "
Generate an account to which the icrc tokens will be sent for locking.
```
***Sources*** : 
[`Principal`](https://github.com/octopus-network/omnity-interoperability/)
[`AccountIdentifier`](https://github.com/octopus-network/omnity-interoperability/)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with this icp settlement canister.
```
***Sources*** : 
[`Chain`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<Token>"
Retrieve a list of tokens available on this icp settlement canister.
```
***Sources*** : 
[`Token`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the wrapped token minting operation on the icp:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the icp.
* Unknown represents the operation is not completed.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/)