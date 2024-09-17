---
sidebar_position: 5
---

# Runes On ICP
**ICP -> BTC**:
For any icrc token (like $BOXY), it is possible to operate 100% premine on bitcoin with a suitable runes ticker and bridge totally supply to icp via Omnity, then connect it up with the icrc token on the icp side.

**BTC -> ICP**:
For any existing runes tokens on bitcoin, it is possible to bridge them to icp by having Omnity create the corresponding icrc tokens on the icp side.

Both of the goals can be achieved by using generate_ticket on each side based on where you want to utilize the runes tokens:

|  | Canister ID |
| --- | --- |
| OMNITY_HUB | 7wupf-wiaaa-aaaar-qaeya-cai |
| OMNITY_SETTLEMENT_BITCOIN | 7rvjr-3qaaa-aaaar-qaeyq-cai |
| OMNITY_EXECUTION_ICP | 7ywcn-nyaaa-aaaar-qaeza-cai |

* For btc to icp, please use generate_ticket from Bitcoin as an transfer operation.
* For minting runes from icp, please use generate_ticket from eICP with TxAction::Mint.
* For withdrawing runes from icp to btc, please use generate_ticket from eICP with TxAction::Redeem.
* For burning runes from icp (the runes tokens will be burnt on the layer 1 chain as well), please use generate_ticket from eICP with TxAction::Burn.

## Hub
**Update:**
### add_runes_token
```md title="add_runes_token(args: AddRunesTokenReq) -> Result<(), SelfServiceError>"
Add new runes tokens token.
```
***Sources*** : 
[`AddRunesTokenReq`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L23)
[`SelfServiceError`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/self_help.rs#L37)

----------------------------------------------------------------------------
**Query:**
### get_total_tx
```md title="get_total_tx() -> Result<u64, OmnityError>"
Get the total number of transactions on Omnity. 
```
***Sources*** : [`OmnityError`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718) 

### query_tx_hash
```md title="query_tx_hash(ticket_id: TicketId) -> Result<TxHash, Error>"
Query the transaction hash for the ticket_id.
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
Retrieve the metadata for the chain_id.
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
Retrieve the metadata for the transaction using the TicketId.
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
Retrieve all historical transactions from the start.
```
***Sources*** : 
[`Ticket`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L190)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_metas
```md title="get_chain_metas(offset: usize, limit: usize) -> Result<Vec<ChainMeta>, Error>"
Retrieve all chain metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`ChainMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L67)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_chain_size
```md title="get_chain_size() -> Result<u64, Error>"
Get the total number of chains on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_metas
```md title="get_token_metas(offset: usize, limit: usize) -> Result<Vec<TokenMeta>, Error>"
Retrieve all token metadata and manage pagination by providing an offset and limit.
```
***Sources*** : 
[`TokenMeta`](https://github.com/octopus-network/omnity-interoperability/blob/main/hub/src/types.rs#L149)
[`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### get_token_size
```md title="get_token_size() -> Result<u64, Error>"
Get the total number of tokens on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### sync_ticket_size
```md title="sync_ticket_size() -> Result<u64, Error>"
Get the total number of transactions on Omnity.
```
***Sources*** : [`Error`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L718)

### sync_tickets
```md title="sync_tickets(offset: usize, limit: usize) -> Result<Vec<(u64, Ticket)>, Error>"
Retrieve all ticket data and manage pagination by providing an offset and limit.
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
**Update:**
### generate_ticket
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Generate an cross-chain transaction from the bitcoin network on Omnity.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L24)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/generate_ticket.rs#L33)

```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the runes(e.g. $HOPE•YOU•GET•RICH has two decimal so the input will be 10*100).

let args = GenerateTicketArgs {
		    target_chain_id: "eICP".to_string(),
		    receiver: "hijd3-ferev-ybojm-nailk-pdk3t-l2h3o-h6cdy-mfynr-p3oen-d67mg-5ae".to_string(),
		    rune_id: "840000:846".to_string(),
		    amount: 1000,
		    txid: "6368ec94cfd560d5f3b9656ad142422080dede78d4b8e0afa9228351988778ee".to_string(),
	    };
```

#### Workflow: 
***1***. Get the bitcoin deposit address from get_btc_address by providing the target chain id and the receiver address as a derive path. And this bitcoin deposit address is owned by the bitcoin customs canister. Get the [send](https://github.com/octopus-network/rune-mint/blob/main/src/send.rs#L18) input from the UI provided by the user, and pass it to a [web service](https://github.com/octopus-network/rune-mint) to format the wrapped transaction, the UI will then bring the formatted transaction to call the [wallet api](https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider#signpsbt) to sign the transaction and return the tx-hash as a txid.

***2***. Put the txid as one of the parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

----------------------------------------------------------------------------
**Query:**
### release_token_status
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns the status of the runes tokens withdrawal operation:
* Confirmed(String) represents the operation is succeeded with the transaction hash on bitcoin network.
```
***Sources*** : [`ReleaseTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L217)

### get_btc_address
```md title="get_btc_address(args: GetBtcAddressArgs) -> String"
Generate a bitcoin address using the target chain and receiver as the derivation path, and use it as the token locking account.
```
***Sources*** : [`GetBtcAddressArgs`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/updates/get_btc_address.rs#L14)

### generate_ticket_status
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"
Retrieve the status of ticket_id generation operation.
```
***Sources*** : [`GenTicketStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/state.rs#L234)

### get_runes_oracles
```md title="get_runes_oracles() -> Vec<Principal>"
Get the list of runes oracles canister ids.
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
Retrieve a list of chains that connect with the bitcoin network.
```
***Sources*** : [`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L439)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of tokens available on the bitcoin network.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/lib.rs#L106)


## eICP
**Update:**
### generate_ticket
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
Generate an cross-chain transaction from icp network on Omnity.
```
***Sources*** : 
[`GenerateTicketReq`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L18)
[`GenerateTicketOk`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L296)
[`GenerateTicketError`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/icp/src/updates/generate_ticket.rs#L34)
[`TxAction`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L334)
[`IcpChainKeyToken`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L346)

```md title="Rust Input Example:"
let mint_args = GenerateTicketReq {
		target_chain_id: "Bitcoin".to_string(),
		receiver: "hijd3-ferev-ybojm-nailk-pdk3t-l2h3o-h6cdy-mfynr-p3oen-d67mg-5ae".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
		action: TxAction::Mint,
	}

let burn_args = GenerateTicketReq {
		target_chain_id: "Bitcoin".to_string(),
		receiver: "bc1qh8u0gpw2ze6qdeltnknxmyk8wpqnpmtr8ph9nc".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
		action: TxAction::Burn,
	}
```

#### Workflow: 
***1***. The operation will be executed on icp based on the TxAction, for example, for TxAction::Redeem, on the icp side, the corresponding wrapped icrc runes token will be burned by calling the ledger.approve for the user, and from the bitcoin side, the ord indexer will verify the user account to see if there is original runes tokens, if so, will transfer from the generated bitcoin account to the receiver account.

***2***. Put the GenerateTicketReq as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/customs/bitcoin/src/main.rs#L195) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

----------------------------------------------------------------------------

**Query:**
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
Retrieve a list of tokens available on icp.
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