---
sidebar_position: 2
---

# Hub
OMNITY_HUB_CANISTER_ID = 7wupf-wiaaa-aaaar-qaeya-cai

## Query
### get_total_tx
```md title="get_total_tx() -> Result<u64, OmnityError>"
Get the number of total transactions on Omnity. 
```
***Sources*** : [`OmnityError`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718) 

### query_tx_hash
```md title="query_tx_hash(ticket_id: TicketId) -> Result<TxHash, Error>"
Query the transaction hash of the ticket_id.
```
***Sources*** : 
[`TicketId`](https://github.com) 
[`TxHash`](https://github.com) 
[`Error`](https://github.com) 

### get_self_service_fee
```md title="get_self_service_fee() -> SelfServiceFee"
Obtain the fees for adding both a chain and a token.
```
***Sources*** : [`SelfServiceFee`](https://github.com) 

### get_chains
```md title="get_chains(chain_type: Option<ChainType>, chain_state: Option<ChainState>, offset: usize, limit: usize) -> Result<Vec<Chain>, Error>"
Specify filters to narrow down the list of chains based on the chain_type and chain_state and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainType`](https://github.com) 
[`ChainState`](https://github.com)
[`Chain`](https://github.com)
[`Error`](https://github.com)

### get_chain
```md title="get_chain(chain_id: String) -> Result<Chain, Error>"
Retrieve the metadata of a chain_id.
```
***Sources*** : 
[`Chain`](https://github.com)
[`Error`](https://github.com)

### get_tokens
```md title="get_tokens(chain_id: Option<ChainId>, token_id: Option<TokenId>, offset: usize, limit: usize) -> Result<Vec<TokenResp>, Error>"
Specify filters to narrow down the list of tokens metadata based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenResp`](https://github.com)
[`Error`](https://github.com)

### get_fees
```md title="get_fees(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<(ChainId, TokenId, u128)>, Error>"
Specify filters to narrow down the list of fees based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenResp`](https://github.com)
[`Error`](https://github.com)

### get_chain_tokens
```md title="get_chain_tokens(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<TokenOnChain>, Error>"
Specify filters to narrow down the list of token amount on a chain based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenOnChain`](https://github.com)
[`Error`](https://github.com)

### get_tx
```md title="get_tx(ticket_id: TicketId) -> Result<Ticket, Error>"
Retrieve the metadata for the trasaction using the TicketId.
```
***Sources*** : 
[`TicketId`](https://github.com)
[`Error`](https://github.com)

### get_txs_with_chain
```md title="get_txs_with_chain(src_chain: Option<ChainId>, dst_chain: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve a list of transactions based on src_chain, dst_chain, token_id, time_range and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com)
[`TokenId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_txs_with_account
```md title="get_txs_with_account(sender: Option<ChainId>, receiver: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve a list of transactions based on sender, receiver, token_id, time_range and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com)
[`TokenId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_txs
```md title="get_txs(offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve all historical transactions from the beginning.
```
***Sources*** : 
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Retrieve all of chain metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainMeta`](https://github.com)
[`Error`](https://github.com)

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
Get the number of chains on Omnity.
```
***Sources*** : [`Error`](https://github.com)

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Retrieve all of token metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`TokenMeta`](https://github.com)
[`Error`](https://github.com)

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
Get the number of tokens on Omnity.
```
***Sources*** : [`Error`](https://github.com)

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
Get the number of transactions on Omnity.
```
***Sources*** : [`Error`](https://github.com)

### sync_tickets
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
Retrieve all of ticket data and manage pagination by providing an offset and limit.
```
***Sources*** : [`Error`](https://github.com)

### get_pending_ticket_size
```md title="get_pending_ticket_size() -> Result<u64, Error>"
Get the number of all the pending tickets on Omnity.
```
***Sources*** : [`Error`](https://github.com)

### get_pending_tickets
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error>"
Retrieve all of pending ticket data.
```
***Sources*** : 
[`TicketId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)


## Update
### add_runes_token
```md title="add_runes_token(args: AddRunesTokenReq) -> Result<(), SelfServiceError>"
Add the existing runes token on Omnity.
```
***Sources*** : 
[`AddRunesTokenReq`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L23)
[`SelfServiceError`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L37)

### add_dest_chain_for_token
```md title="add_dest_chain_for_token(args: AddDestChainArgs) -> Result<(), SelfServiceError>"
Add the existing token_id available on the dest_chain.
```
***Sources*** : 
[`AddDestChainArgs`](https://github.com/)
[`SelfServiceError`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L37)