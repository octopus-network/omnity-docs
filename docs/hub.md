---
sidebar_position: 2
---

# HUB
OMNITY_HUB_CANISTER_ID = 7wupf-wiaaa-aaaar-qaeya-cai

## Query
### get_total_tx
```md title="get_total_tx() -> Result<u64, OmnityError>"
Get the number of total transactions on Omnity. 
```
***Source*** : [`OmnityError`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718) 

### query_tx_hash
```md title="query_tx_hash(ticket_id: TicketId) -> Result<TxHash, Error>"

```
***Source*** : 
[`TicketId`](https://github.com) 
[`TxHash`](https://github.com) 
[`Error`](https://github.com) 

### get_self_service_fee
```md title="get_self_service_fee() -> SelfServiceFee"

```
***Source*** : [`TicketId`](https://github.com) 

### get_chains
```md title="get_chains(chain_type: Option<ChainType>,chain_state: Option<ChainState>, offset: usize,limit: usize) -> Result<Vec<Chain>, Error>"

```
***Source*** : 
[`ChainType`](https://github.com) 
[`ChainState`](https://github.com)
[`Chain`](https://github.com)
[`Error`](https://github.com)

### get_chain
```md title="get_chain(chain_id: String) -> Result<Chain, Error>"

```
***Source*** : 
[`Chain`](https://github.com)
[`Error`](https://github.com)

### get_tokens
```md title="get_tokens(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<TokenResp>, Error>"

```
***Source*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenResp`](https://github.com)
[`Error`](https://github.com)

### get_fees
```md title="get_fees(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<(ChainId, TokenId, u128)>, Error>"

```
***Source*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenResp`](https://github.com)
[`Error`](https://github.com)

### get_chain_tokens
```md title="get_chain_tokens(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<TokenOnChain>, Error>"

```
***Source*** : 
[`ChainId`](https://github.com) 
[`TokenId`](https://github.com)
[`TokenOnChain`](https://github.com)
[`Error`](https://github.com)

### get_tx
```md title="get_tx(ticket_id: TicketId) -> Result<Ticket, Error>"

```
***Source*** : 
[`TicketId`](https://github.com)
[`Error`](https://github.com)

### get_txs_with_chain
```md title="get_txs_with_chain(src_chain: Option<ChainId>,dst_chain: Option<ChainId>,token_id: Option<TokenId>,time_range: Option<(u64, u64)>,offset: usize,limit: usize) -> Result<Vec<Ticket>, Error>"

```
***Source*** : 
[`ChainId`](https://github.com)
[`TokenId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_txs_with_account
```md title="get_txs_with_account(sender: Option<ChainId>, receiver: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"

```
***Source*** : 
[`ChainId`](https://github.com)
[`TokenId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_txs
```md title="get_txs(offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
```
***Source*** : 
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
```
***Source*** : 
[`ChainMeta`](https://github.com)
[`Error`](https://github.com)

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
```
***Source*** : [`Error`](https://github.com)

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
```
***Source*** : 
[`TokenMeta`](https://github.com)
[`Error`](https://github.com)

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
```
***Source*** : [`Error`](https://github.com)

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
```
***Source*** : [`Error`](https://github.com)

### sync_tickets
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
```
***Source*** : [`Error`](https://github.com)

### sync_tickets
```md title="pending_ticket(ticket: Ticket) -> Result<(), Error>"
```
***Source*** : 
[`Ticket`](https://github.com)
[`Error`](https://github.com)

### get_pending_ticket_size
```md title="get_pending_ticket_size() -> Result<u64, Error> "
```
***Source*** : [`Error`](https://github.com)

### get_pending_tickets
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error> "
```
***Source*** : 
[`TicketId`](https://github.com)
[`Ticket`](https://github.com)
[`Error`](https://github.com)


## Update
### add_runes_token
```md title="add_runes_token(args: AddRunesTokenReq) -> Result<(), SelfServiceError>"
Add the existing runes token on Omnity.
```
***Source*** : 
[`AddRunesTokenReq`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L23)
[`SelfServiceError`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L37)

### get_add_runes_token_requests
```md title="get_add_runes_token_requests() -> Vec<AddRunesTokenReq>"

```
***Source*** : [`AddRunesTokenReq`](https://github.com)
