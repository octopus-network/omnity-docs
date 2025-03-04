---
sidebar_position: 11
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
Get the length of the list that contains the total amount of each token on every chain.
```md title="get_token_position_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total amount of each token on every chain
        Error: an error message as a string will be returned if the operation fails
```

### get_chain_tokens
Specify filters to narrow down the list of token amount on a chain based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```md title="get_chain_tokens(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<TokenOnChain>, Error>"
Parameters:
chain_id: Option<ChainId>
token_id: Option<TokenId>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<TokenOnChain>: a struct containing: 
					* chain_id: ChainId
					* token_id: TokenId
					* amount: u128
        Error: an error message as a string will be returned if the operation fails
```

### get_chain_size
Get the total number of chains on Omnity.
```md title="get_chain_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of chains
        Error: an error message as a string will be returned if the operation fails
```

### get_chain_metas
Retrieve all chain metadata and manage pagination by providing an offset and limit.
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Parameters:
offset: usize - this is used for pagination. It tells the api where to start fetching tickets from. for example, if you already fetched 100 tickets, setting offset to 100 would return the next 100 tickets
limit: usize - this specifies the maximum number of tickets to fetch in a single call. It's like setting the page size for your results (e.g., get 50 tickets at a time).

Returns:
Result: a variant containing either:
        Vec<ChainMeta>: a struct containing: 
					* chain_id: ChainId
					* canister_id: String
					* chain_type: ChainType
					* chain_state: ChainState
					* contract_address: Option<String>
					* counterparties: Option<Vec<ChainId>>
					* fee_token: Option<TokenId>
        Error: an error message as a string will be returned if the operation fails
```

### get_token_size
Get the total number of tokens on Omnity.
```md title="get_token_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of tokens
        Error: an error message as a string will be returned if the operation fails
```

### get_token_metas
Retrieve all token metadata and manage pagination by providing an offset and limit.
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Parameters:
offset: usize - this is used for pagination. It tells the api where to start fetching tickets from. for example, if you already fetched 100 tickets, setting offset to 100 would return the next 100 tickets
limit: usize - this specifies the maximum number of tickets to fetch in a single call. It's like setting the page size for your results (e.g., get 50 tickets at a time).

Returns:
Result: a variant containing either:
        Vec<TokenMeta>: a struct containing: 
					* token_id: TokenId
					* name: String
					* symbol: String
					* issue_chain: ChainId
					* decimals: u8
					* icon: Option<String>
					* metadata: HashMap<String, String>
					* dst_chains: Vec<ChainId>
        Error: an error message as a string will be returned if the operation fails
```

### sync_ticket_size
Get the total number of transactions on Omnity.
```md title="sync_ticket_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of tickets excluding the pending ones
        Error: an error message as a string will be returned if the operation fails
```

### sync_tickets
Retrieve all ticket data and manage pagination by providing an offset and limit.
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
Parameters:
offset: usize - this is used for pagination. It tells the api where to start fetching tickets from. for example, if you already fetched 100 tickets, setting offset to 100 would return the next 100 tickets
limit: usize - this specifies the maximum number of tickets to fetch in a single call. It's like setting the page size for your results (e.g., get 50 tickets at a time).

Returns:
Result: a variant containing either:
        Vec<(u64, Ticket)>: a list of tuple containing: 
			* u64 - the ticket's sequence number
			* Ticket - the detailed information associated with the ticket:
				* ticket_id: TicketId,
				* ticket_type: TicketType
				* ticket_time: Timestamp
				* src_chain: ChainId
				* dst_chain: ChainId
				* action: TxAction
				* token: TokenId
				* amount: String
				* sender: Option<Account>
				* receiver: Account
				* memo: Option<Vec<u8>>
        Error: an error message as a string will be returned if the operation fails
```

## Bitcoin
### release_token_status
Returns the status of the runes tokens withdrawal operation
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

## sICP
### mint_token_status
Returns the status of the wrapped token minting operation on the icp
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the icp.
* Unknown represents the operation is not completed.
```

## eICP
### get_token_ledger
Get the token ledger canister id based on token_id.
```md title="get_token_ledger(token_id: String) -> Option<Principal> "
Returns:
Option<Principal>: the token canister id
```

### mint_token_status
Returns the status of the wrapped token minting operation
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns:
MintTokenStatus: a enum containing:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```

## EVM
### mint_token_status
Returns the status of the wrapped token minting operation on the layer 2 chain
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Parameters:
ticket_id: String - the ticket id

Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the layer 2 chain.
* Unknown represents the operation is not completed.
```

### get_token_list
Retrieve a list of tokens available on the layer 2 chain.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
        evm_contract: Option<String>
```

Last updated on January 25, 2025