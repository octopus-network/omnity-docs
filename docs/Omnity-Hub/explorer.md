---
sidebar_position: 4
---

# Omnity Explorer
**Query Only**

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_HUB | 7wupf-wiaaa-aaaar-qaeya-cai | none |
| OMNITY_SETTLEMENT_BITCOIN | 7rvjr-3qaaa-aaaar-qaeyq-cai | Bitcoin|
| OMNITY_SETTLEMENT_ICP | nlgkm-4qaaa-aaaar-qah2q-cai | sICP|
| OMNITY_EXECUTION_ICP | 7ywcn-nyaaa-aaaar-qaeza-cai | eICP|

## Hub
### get_token_position_size
```md title="get_token_position_size() -> Result<u64, Error>"
Get the length of the list that contains the total amount of each token on every chain.
```

### get_chain_tokens
```md title="get_chain_tokens(chain_id: Option<ChainId>, token_id: Option<TokenId>, offset: usize, limit: usize) -> Result<Vec<TokenOnChain>, Error>"
Specify filters to narrow down the list of token amount on a chain based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
Get the total number of chains on Omnity.
```

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Retrieve all chain metadata and manage pagination by providing an offset and limit.
```

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
Get the total number of tokens on Omnity.
```

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Retrieve all of token metadata and manage pagination by providing an offset and limit.
```

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
Get the total number of transactions on Omnity.
```

### sync_tickets
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
Retrieve all of ticket data and manage pagination by providing an offset and limit.
```

### get_pending_ticket_size
```md title="get_pending_ticket_size() -> Result<u64, Error>"
Get the total number of pending tickets on Omnity.
```

### get_pending_tickets
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error>"
Retrieve all pending ticket data.
```

## Bitcoin
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawing operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```

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

### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```

## EVM
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the layer 2 chain.
* Unknown represents the operation is not completed.
```


### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on the layer 2 chain.
```

Last updated on January 25, 2025