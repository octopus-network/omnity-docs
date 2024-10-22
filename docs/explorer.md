---
sidebar_position: 4
---

# Omnity Explorer
**Query Only**

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_HUB | 7wupf-wiaaa-aaaar-qaeya-cai | null |
| OMNITY_SETTLEMENT_BITCOIN | 7rvjr-3qaaa-aaaar-qaeyq-cai | Bitcoin|
| OMNITY_SETTLEMENT_ICP | nlgkm-4qaaa-aaaar-qah2q-cai | sICP|
| OMNITY_EXECUTION_ICP | 7ywcn-nyaaa-aaaar-qaeza-cai | eICP|

## Hub
### get_token_position_size
```md title="get_token_position_size() -> Result<u64, Error>"
Get the length of the list that contains the total amount of each token on every chain.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_tokens
```md title="get_chain_tokens(chain_id: Option<ChainId>, token_id: Option<TokenId>, offset: usize, limit: usize) -> Result<Vec<TokenOnChain>, Error>"
Specify filters to narrow down the list of token amount on a chain based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`TokenOnChain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L550)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
Get the total number of chains on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Retrieve all chain metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L67)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
Get the total number of tokens on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Retrieve all of token metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`TokenMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L149)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
Get the total number of transactions on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### sync_tickets
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
Retrieve all of ticket data and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_pending_ticket_size
```md title="get_pending_ticket_size() -> Result<u64, Error>"
Get the total number of pending tickets on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_pending_tickets
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error>"
Retrieve all pending ticket data.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

## Bitcoin
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawing operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Sources*** : [`ReleaseTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L217)

## sICP
### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the tokens withdrawal operation:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the icp.
* Unknown represents the operation is not completed.
```

## eICP
### get_token_ledger
```md title="get_token_ledger(token_id: String) -> Option<Principal> "
Get the token ledger canister id based on the token_id.
```
***Sources*** : [`Principal`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/main.rs#L1)

### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/state.rs#L15)

## EVM
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the layer 2 chain.
* Unknown represents the operation is not completed.
```
***Sources*** : [`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L773)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on the layer 2 chain.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L557)
