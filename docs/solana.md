---
sidebar_position: 5
---

# Solana[WIP]

|  | Canister ID |
| --- | --- |
| OMNITY_EXECUTION_SOLANA | lvinw-hiaaa-aaaar-qahoa-cai |

## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
```
***Sources*** : 
[`GenerateTicketReq`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketOk`](https://github.com/octopus-network/omnity-interoperability/)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/)

### signer
```md title="signer() -> Result<String, String>"
```

### sign
```md title="sign(msg: String) -> Result<String, String>"
```

### get_fee_account
```md title="get_fee_account() -> String "
```

### get_latest_blockhash
```md title="get_latest_blockhash() -> Result<String, CallError>"
```
***Sources*** : 
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)

### get_transaction
```md title="get_transaction(signature: String, forward: Option<String>) -> Result<String, CallError>"
```
***Sources*** : 
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)

### get_signature_status
```md title="get_signature_status(signatures: Vec<String>) -> Result<Vec<TransactionStatus>, CallError> "
```
***Sources*** : 
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)


## Query
### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with the solana route.
```
***Sources*** : 
[`Chain`](https://github.com/octopus-network/omnity-interoperability/)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of tokens available on the solana route.
```
***Sources*** : 
[`TokenResp`](https://github.com/octopus-network/omnity-interoperability/)

### query_mint_account
```md title="query_mint_account(token_id: TokenId) -> Option<AccountInfo>"
```
***Sources*** : 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/)
[`AccountInfo`](https://github.com/octopus-network/omnity-interoperability/)

### query_mint_address
```md title="query_mint_address(token_id: TokenId) -> Option<String>"
```
***Sources*** : 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/)

### query_aossicated_account
```md title="query_aossicated_account(owner: Owner,token_mint: MintAccount) -> Option<AccountInfo>"
```
***Sources*** : 
[`Owner`](https://github.com/octopus-network/omnity-interoperability/)
[`MintAccount`](https://github.com/octopus-network/omnity-interoperability/)
[`AccountInfo`](https://github.com/octopus-network/omnity-interoperability/)

### query_aossicated_account_address
```md title="query_aossicated_account_address(owner: Owner, token_mint: MintAccount) -> Option<String>"
```
***Sources*** : 
[`Owner`](https://github.com/octopus-network/omnity-interoperability/)
[`MintAccount`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_status
```md title="mint_token_status(ticket_id: String) -> Result<TxStatus, CallError>"
Returns the status of the wrapped token minting operation on the solana route.
```
***Sources*** : 
[`TxStatus`](https://github.com/octopus-network/omnity-interoperability/)
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_tx_hash
```md title="mint_token_tx_hash(ticket_id: String) -> Result<Option<String>, CallError>"
Returns the transaction hash of the wrapped token minting operation on the solana route.
```
***Sources*** : 
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)

### mint_token_req
```md title="mint_token_req(ticket_id: String) -> Result<MintTokenRequest, CallError>"
```
***Sources*** : 
[`MintTokenRequest`](https://github.com/octopus-network/omnity-interoperability/)
[`CallError`](https://github.com/octopus-network/omnity-interoperability/)

### get_ticket_from_queue
```md title="get_ticket_from_queue(ticket_id: String) -> Option<(u64, Ticket)>"
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/)

### get_tickets_from_queue
```md title="get_tickets_from_queue() -> Vec<(u64, Ticket)>"
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/)

### get_redeem_fee
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u128>"
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/)

### get_tickets_failed_to_hub
```md title="get_tickets_failed_to_hub() -> Vec<Ticket>"
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/)
