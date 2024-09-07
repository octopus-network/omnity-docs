---
sidebar_position: 3
---

# Runes Indexer
- OMNITY_HUB_CANISTER_ID = 7wupf-wiaaa-aaaar-qaeya-cai
- OMNITY_SETTLEMENT_BITCOIN_CANISTER_ID = 7rvjr-3qaaa-aaaar-qaeyq-cai
- OMNITY_EXECUTION_ICP_CANISTER_ID = 7ywcn-nyaaa-aaaar-qaeza-cai

## Hub
Update:
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

----------------------------------------------------------------------------
Query:
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
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26) 
[`TxHash`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L28) 
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718) 

### get_self_service_fee
```md title="get_self_service_fee() -> SelfServiceFee"
Obtain the fees for adding both a chain and a token.
```
***Sources*** : [`SelfServiceFee`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/service.rs#L262) 

### get_chains
```md title="get_chains(chain_type: Option<ChainType>, chain_state: Option<ChainState>, offset: usize, limit: usize) -> Result<Vec<Chain>, Error>"
Specify filters to narrow down the list of chains based on the chain_type and chain_state and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainType`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L301) 
[`ChainState`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L308)
[`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L439)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain
```md title="get_chain(chain_id: String) -> Result<Chain, Error>"
Retrieve the metadata of a chain_id.
```
***Sources*** : 
[`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L439)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_tokens
```md title="get_tokens(chain_id: Option<ChainId>, token_id: Option<TokenId>, offset: usize, limit: usize) -> Result<Vec<TokenResp>, Error>"
Specify filters to narrow down the list of tokens metadata based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L200)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_fees
```md title="get_fees(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<(ChainId, TokenId, u128)>, Error>"
Specify filters to narrow down the list of fees based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L200)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_tokens
```md title="get_chain_tokens(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<TokenOnChain>, Error>"
Specify filters to narrow down the list of token amount on a chain based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`TokenOnChain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L550)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_tx
```md title="get_tx(ticket_id: TicketId) -> Result<Ticket, Error>"
Retrieve the metadata for the trasaction using the TicketId.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_txs_with_chain
```md title="get_txs_with_chain(src_chain: Option<ChainId>, dst_chain: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve a list of transactions based on src_chain, dst_chain, token_id, time_range and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_txs_with_account
```md title="get_txs_with_account(sender: Option<ChainId>, receiver: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve a list of transactions based on sender, receiver, token_id, time_range and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23) 
[`TokenId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L25)
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_txs
```md title="get_txs(offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Retrieve all historical transactions from the beginning.
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Retrieve all of chain metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L67)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
Get the number of chains on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Retrieve all of token metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`TokenMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L149)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
Get the number of tokens on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
Get the number of transactions on Omnity.
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
Get the number of all the pending tickets on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_pending_tickets
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error>"
Retrieve all of pending ticket data.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)



## Bitcoin
Update:
### generate_ticket
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Generate an cross-chain transaction from bitcoin network on Omnity.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L24)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L33)

#### Workflow: 
***1***. Call the corresponding bitcoin function from the UI and get the calculated function_hash.

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

----------------------------------------------------------------------------
Query:
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawing operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Sources*** : [`ReleaseTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L217)

### get_btc_address
```md title="get_btc_address(args: GetBtcAddressArgs) -> String"
Generate a bitcoin address by using the target chain and receiver as the derivation path.
```
***Sources*** : [`GetBtcAddressArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/get_btc_address.rs#L14)

### get_main_btc_address
```md title="get_main_btc_address(token: String) -> String"
Retrieve the token locking account for a given token.
```

### generate_ticket_status
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"
Retrieve the status of ticket_id generating operation.
```
***Sources*** : [`GenTicketStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L234)

### get_runes_oracles
```md title="get_runes_oracles() -> Vec<Principal>"
Get the list of runes oracles canister id.
```
***Sources*** : [`Principal`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L25)

### estimate_redeem_fee
```md title="estimate_redeem_fee(arg: EstimateFeeArgs) -> RedeemFee"
Get the estimated fee needed for redeeming chain_id on bitcoin network.
```
***Sources*** : 
[`EstimateFeeArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/queries.rs#L7)
[`RedeemFee`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/queries.rs#L13)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with bitcoin network.
```
***Sources*** : [`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L439)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on bitcoin network.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/lib.rs#L106)

## eICP
Query:
### mint_token_status
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```
***Sources*** : 
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L26)
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/state.rs#L15)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with icp.
```
***Sources*** : [`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L439)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on icp.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/lib.rs#L179)

### get_token_ledger
```md title="get_token_ledger(token_id: String) -> Option<Principal> "
Get the token ledger canister id based on token_id.
```
***Sources*** : [`Principal`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/main.rs#L1)

### get_redeem_fee
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u64>"
Get the fee information needed for redeeming chain_id on icp.
```
***Sources*** : [`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L23)