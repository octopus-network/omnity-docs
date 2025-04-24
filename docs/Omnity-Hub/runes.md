---
sidebar_position: 4
---

# Runes On ICP
**ICP -> BTC**:
For any icrc token (like $BOXY), it is possible to operate 100% premine on bitcoin with a suitable runes ticker and bridge total supply to icp via Omnity, then connect it up with the icrc token on the icp side.

**BTC -> ICP**:
For any existing runes tokens on bitcoin, it is possible to bridge them to icp by having Omnity create the corresponding icrc tokens on the icp side.

Both of the goals can be achieved by using generate_ticket on each side based on where you want to utilize the runes tokens:

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_HUB | 7wupf-wiaaa-aaaar-qaeya-cai | none |
| OMNITY_SETTLEMENT_BITCOIN | 7rvjr-3qaaa-aaaar-qaeyq-cai | Bitcoin|
| OMNITY_EXECUTION_ICP | 7ywcn-nyaaa-aaaar-qaeza-cai | eICP|

* For btc to icp, please use generate_ticket from Bitcoin as an transfer operation.
* For minting runes from icp, please use generate_ticket from eICP with TxAction::Mint.
* For etching runes from icp, please use etching from Bitcoin.
* For withdrawing runes from icp to btc, please use generate_ticket from eICP with TxAction::Redeem.
* For burning runes from icp (the runes tokens will be burnt on the layer 1 chain as well), please use generate_ticket from eICP with TxAction::Burn.

## Hub
**Update:**
### add_runes_token
Add new runes tokens to Omnity
```md title="add_runes_token(args: AddRunesTokenReq) -> Result<(), SelfServiceError>"
Parameters:
args: AddRunesTokenReq - a struct containing:
			* rune_id: String
			* symbol: String
			* icon: String
			* dest_chain: ChainId - A String

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        SelfServiceError: the operation failed, and the SelfServiceError provides details about the failure
        
```
```md title="To Pay Fee"
# Please note that a 10 ICP token addition fee is required, and the payment must be sent to AccountIdentifier::new(omnity_hub_canister_id, &your_principal_subaccount), see how to convert your principal to your_principal_subaccount: 
pub fn principal_to_subaccount(principal_id: &Principal) -> Subaccount {
		let mut subaccount = [0; std::mem::size_of::<Subaccount>()];
		let principal_id = principal_id.as_slice();
		subaccount[0] = principal_id.len().try_into().unwrap();
		subaccount[1..1 + principal_id.len()].copy_from_slice(principal_id);

		Subaccount(subaccount)
}
```

### link_chains
Connecting two chains
```md title="link_chains(args: LinkChainReq) -> Result<(), SelfServiceError>"
Parameters:
args: LinkChainReq - a struct containing:
			* chain1: ChainId - A String
			* chain2: ChainId - A String

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        SelfServiceError: the operation failed, and the SelfServiceError provides details about the failure
        
```

### add_dest_chain_for_token
Connects the token to the chain
```md title="add_dest_chain_for_token(args: AddDestChainArgs) -> Result<(), SelfServiceError>"
Parameters:
args: AddDestChainArgs - a struct containing:
			* token_id: String
			* dest_chain: ChainId - A String

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        SelfServiceError: the operation failed, and the SelfServiceError provides details about the failure
        
```

----------------------------------------------------------------------------
**Query:**
### get_total_tx
Get the total number of transactions on Omnity. 
```md title="get_total_tx() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of transactions
        Error: an error message as a string will be returned if the operation fails
``` 

### query_tx_hash
Query the transaction hash for the ticket_id.
```md title="query_tx_hash(ticket_id: TicketId) -> Result<TxHash, Error>"
Returns:
Result: a variant containing either:
        TxHash: the transaction hash
        Error: an error message as a string will be returned if the operation fails
```

### get_self_service_fee
Obtain the fees for adding both a chain and a token.
```md title="get_self_service_fee() -> SelfServiceFee"
Returns:
Result: a variant containing either:
        SelfServiceFee: a struct containing:
			* add_token_fee: u64
			* add_chain_fee: u64
        Error: an error message as a string will be returned if the operation fails
```

### get_fee_account
Get the account to which the transaction fee is sent.
```md title="get_fee_account(principal: Option<Principal>) -> AccountIdentifier"
Parameters:
principal: the account to which the transaction fee is sent

Returns:
AccountIdentifier: the fee account
```

### get_chains
Specify filters to narrow down the list of chains based on the chain_type and chain_state and manage pagination by providing an offset and limit.
```md title="get_chains(chain_type: Option<ChainType>, chain_state: Option<ChainState>, offset: usize, limit: usize) -> Result<Vec<Chain>, Error>"
Parameters:
chain_type: Option<ChainType>
chain_state: Option<ChainState>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<Chain>: a struct containing:
			* chain_id: ChainId
			* canister_id: String
			* chain_type: ChainType
			* chain_state: ChainState
			* contract_address: Option<String>
			* counterparties: Option<Vec<ChainId>>
			* fee_token: Option<TokenId>
        Error: an error message as a string will be returned if the operation fails
```

### get_chain
Retrieve the metadata for the chain_id.
```md title="get_chain(chain_id: String) -> Result<Chain, Error>"
Returns:
Result: a variant containing either:
        Chain: a struct containing:
			* chain_id: ChainId,
			* canister_id: String
			* chain_type: ChainType
			* chain_state: ChainState
			* contract_address: Option<String>
			* counterparties: Option<Vec<ChainId>>
			* fee_token: Option<TokenId>
        Error: an error message as a string will be returned if the operation fails
```

### get_tokens
Specify filters to narrow down the list of tokens metadata based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```md title="get_tokens(chain_id: Option<ChainId>, token_id: Option<TokenId>, offset: usize, limit: usize) -> Result<Vec<TokenResp>, Error>"
Parameters:
chain_id: Option<ChainId>
token_id: Option<TokenId>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<TokenResp>: a struct containing:
			* token_id: TokenId
			* name: String
			* symbol: String
			* decimals: u8
			* icon: Option<String>
			* rune_id: Option<String>
        Error: an error message as a string will be returned if the operation fails
```

### get_fees
Specify filters to narrow down the list of fees based on the either ChainId or TokenId and manage pagination by providing an offset and limit.
```md title="get_fees(chain_id: Option<ChainId>,token_id: Option<TokenId>,offset: usize,limit: usize) -> Result<Vec<(ChainId, TokenId, u128)>, Error>"
Parameters:
chain_id: Option<ChainId>
token_id: Option<TokenId>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<(ChainId, TokenId, u128)>: chain id, token id, the fee amount
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

### get_tx
Retrieve the metadata for the transaction using the TicketId.
```md title="get_tx(ticket_id: TicketId) -> Result<Ticket, Error>"
Parameters:
ticket_id: TicketId

Returns:
Result: a variant containing either:
        Vec<Ticket>: a struct containing: 
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

### get_txs_with_chain
Retrieve a list of transactions based on src_chain, dst_chain, token_id, time_range and manage pagination by providing an offset and limit.
```md title="get_txs_with_chain(src_chain: Option<ChainId>, dst_chain: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Parameters:
src_chain: Option<ChainId>
dst_chain: Option<ChainId>
token_id: Option<TokenId>
time_range: Option<(u64, u64)>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<Ticket>: a struct containing: 
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

### get_txs_with_account
Retrieve a list of transactions based on sender, receiver, token_id, time_range and manage pagination by providing an offset and limit.
```md title="get_txs_with_account(sender: Option<ChainId>, receiver: Option<ChainId>, token_id: Option<TokenId>, time_range: Option<(u64, u64)>, offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Parameters:
sender: Option<ChainId>
receiver: Option<ChainId>
token_id: Option<TokenId>
time_range: Option<(u64, u64)>
offset: usize
limit: usize

Returns:
Result: a variant containing either:
        Vec<Ticket>: a struct containing: 
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

### get_txs
Retrieve all historical transactions from the start.
```md title="get_txs(offset: usize, limit: usize) -> Result<Vec<Ticket>, Error>"
Parameters:
offset: usize - this is used for pagination. It tells the api where to start fetching tickets from. for example, if you already fetched 100 tickets, setting offset to 100 would return the next 100 tickets
limit: usize - this specifies the maximum number of tickets to fetch in a single call. It's like setting the page size for your results (e.g., get 50 tickets at a time).

Returns:
Result: a variant containing either:
        Vec<Ticket>: a struct containing: 
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

### get_chain_size
Get the total number of chains on Omnity.
```md title="get_chain_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of chains
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

### get_token_size
Get the total number of tokens on Omnity.
```md title="get_token_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the total number of tokens
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

### get_pending_ticket_size
Get the total number of pending tickets on Omnity.
```md title="get_pending_ticket_size() -> Result<u64, Error>"
Returns:
Result: a variant containing either:
        u64: the number of pending tickets
        Error: an error message as a string will be returned if the operation fails
```

### get_pending_tickets
Retrieve all pending ticket data.
```md title="get_pending_tickets(offset: usize, limit: usize) -> Result<Vec<(TicketId, Ticket)>, Error>"
Parameters:
offset: usize - this is used for pagination. It tells the api where to start fetching tickets from. for example, if you already fetched 100 tickets, setting offset to 100 would return the next 100 tickets
limit: usize - this specifies the maximum number of tickets to fetch in a single call. It's like setting the page size for your results (e.g., get 50 tickets at a time).

Returns:
Result: a variant containing either:
        Vec<(TicketId, Ticket)>: a list of tuple containing: 
			* TicketId - the ticket id
			* Ticket - the detailed information associated with the ticket.
        Error: an error message as a string will be returned if the operation fails
```


## Bitcoin
**Update:**
### generate_ticket
Generate an cross-chain transaction from the bitcoin network on Omnity.
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
Parameters:
req: GenerateTicketArgs - struct containing:
		* target_chain_id: String
		* receiver: String
		* rune_id: String
		* amount: String
        * txid: String - the transaction id from the bitcoin transaction    

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```

```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the runes(e.g. $HOPE•YOU•GET•RICH has two decimals so the input will be 10*100).

let args = GenerateTicketArgs {
		    target_chain_id: "eICP".to_string(),
		    receiver: "hijd3-ferev-ybojm-nailk-pdk3t-l2h3o-h6cdy-mfynr-p3oen-d67mg-5ae".to_string(),
		    rune_id: "840000:846".to_string(),
		    amount: 1000,
		    txid: "6368ec94cfd560d5f3b9656ad142422080dede78d4b8e0afa9228351988778ee".to_string(),
	    };
```

#### Workflow: 
***1***. Get the bitcoin deposit address from get_btc_address by providing the target chain id and the receiver address as a derivative path. And this bitcoin deposit address is owned by the bitcoin customs canister(thanks to [the chain key](https://internetcomputer.org/how-it-works/chain-key-technology) feature). Get the [send](https://github.com/octopus-network/rune-mint/blob/main/src/send.rs#L18) input from the UI provided by the user, and pass it to a [web service](https://github.com/octopus-network/rune-mint) to format the wrapped transaction(the data output), the UI will then bring the formatted transaction to call the [wallet api](https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider#signpsbt) to sign the transaction and return the tx-hash as a txid. This action is to lock the runes tokens by transfering them to the bitcoin deposit address.

***2***. Put the txid as one of the parameter into generate_ticket from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

### etching_v2
Initiate etching.
```md title="etching_v2(args: EtchingArgs) -> Result<String, String>" 
This api requires icp tokens as the etching fee, determined by the result of the estimate_etching_fee_v2 function.
When terms is not null, the server will validate it as follows: both amount and cap must be greater than 0, and either height or offset must not be null.
The return is the tx_hash of the commit transaction.

Parameters:
args: The content for etching runes, represented as a structured parameter:
		* rune_name(String): The name of the rune. Please use the bullet point ( • ) by pressing Option + 8 on a Mac, instead of the interpunct or middle dot ( · ), which is typed using Option + Shift + 9.
		* divisibility(Option<u8>): The precision of the runes, can be empty. It is 0 by default.
		* premine(Option<u128>): The initial quantity of the smallest unit to mint. For example, if the divisibility is 2, then 10000 represents 100.00.
		* logo(Option<LogoParams>): The rune logo image, must match the inputs provided during fee estimation:
			- content_type(String): The format of the image, such as image/png, image/jpeg, etc.
			- content_base64(String): The base64-encoded content of the image, which must not exceed 128 KB..
		* symbol(Option<String>): It's optional. The first character will be taken as the symbol if it is not None.
		* turbo(bool): It indicates whether the rune chooses to participate in protocol changes, regardless of the nature of those changes.
		* terms(Option<OrdinalsTerms>): It's used when etching is mintable, the struct fields are as follows:
			- amount(Option<u128>): The smallest unit quantity that can be minted at one time. For example, if divisibility is 2, then 10000 represents 100.00.
			- cap(Option<u128>): The total number of times the rune can be minted.
			- height(Option<u64>, Option<u64>): A tuple representing the absolute height range for minting.
			- offset(Option<u64>, Option<u64>): A tuple representing the relative height range for minting.
		
```

```md title="Request Example:"
# Assume you have fetched the fee using estimate_etching_fee_v2, with a value of 50_410_029. Next, call the icrc2_approve method of the ICP canister to authorize our canister (7rvjr-3qaaa-aaaar-qaeyq-cai) to spend the transaction fee.
❯ dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai icrc2_approve '(record { spender = record {owner = principal "7rvjr-3qaaa-aaaar-qaeyq-cai"; subaccount = null}; amount =   50_410_029; })' --ic

# Proceed with etching after calling the icrc2_approve method.
❯ dfx canister call 7rvjr-3qaaa-aaaar-qaeyq-cai etching_v2 '(record { rune_name = "BLOCKMINER•FUN"; divisibility = opt 1; premine = opt 21000000; logo = opt record { content_type = "image/svg+xml"; content_base64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjAwIDYwMCI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIHN0eWxlPSJmaWxsOiAjMGQxMDE3OyIvPgogIDxnPgogICAgPHBvbHlnb24gcG9pbnRzPSIxMDcuNjQgMzE0LjMyIDEzNy45OCAzMjkuNzUgMTM4Ljk5IDIyOS42NyAxMDYuOTggMjQ1Ljk1IDEwNy42NCAzMTQuMzIiIHN0eWxlPSJmaWxsOiAjNjViNzQxOyIvPgogICAgPHBvbHlnb24gcG9pbnRzPSI0OTIuMzYgMzE0LjMyIDQ2Mi4wMiAzMjkuNzUgNDYxLjAxIDIyOS42NyA0OTMuMDIgMjQ1Ljk1IDQ5Mi4zNiAzMTQuMzIiIHN0eWxlPSJmaWxsOiAjNjViNzQxOyIvPgogICAgPHBhdGggZD0iTTQ4MS40MSwxODMuMTNoLTMxLjUxYy0uOTktNzEuMjYtNjcuNzEtMTI4Ljc2LTE0OS44OS0xMjguNzZzLTE0OC45MSw1Ny41LTE0OS44OSwxMjguNzZoLTMxLjUxYy02Ljk2LDAtMTIuNjEsNS42NS0xMi42MSwxMi42MXYxNWMwLDYuOTYsNS42NSwxMi42MSwxMi42MSwxMi42MWgzNjIuODFjNi45NiwwLDEyLjYxLTUuNjUsMTIuNjEtMTIuNjF2LTE1YzAtNi45Ni01LjY1LTEyLjYxLTEyLjYxLTEyLjYxWk0xODcuMDgsMTc1Ljg0aC03LjExbC0zLjU1LTYuMTUsMy41NS02LjE1aDcuMTFsMy41NSw2LjE1LTMuNTUsNi4xNVpNNDIwLjAyLDE3NS44NGgtNy4xMWwtMy41NS02LjE1LDMuNTUtNi4xNWg3LjExbDMuNTUsNi4xNS0zLjU1LDYuMTVaIiBzdHlsZT0iZmlsbDogIzY1Yjc0MTsiLz4KICAgIDxyZWN0IHg9IjIyMi44MSIgeT0iNDMuOTQiIHdpZHRoPSIxNTQuMzgiIGhlaWdodD0iMTMyLjQ3IiByeD0iNS4yOSIgcnk9IjUuMjkiIHN0eWxlPSJmaWxsOiAjNTk4OTNmOyIvPgogICAgPHJlY3QgeD0iMjU1LjgyIiB5PSIyMi41IiB3aWR0aD0iODguMzYiIGhlaWdodD0iMTMyLjQ3IiByeD0iNS4yOSIgcnk9IjUuMjkiIHN0eWxlPSJmaWxsOiAjNjViNzQxOyIvPgogICAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMTQ2LjE2IiByPSI2My42MyIgc3R5bGU9ImZpbGw6ICM1OTg5M2Y7IHN0cm9rZTogIzBkMTAxNzsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBzdHJva2Utd2lkdGg6IDJweDsiLz4KICAgIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE0NC41NiIgcj0iNDEuMTciIHN0eWxlPSJmaWxsOiAjNjViNzQxOyIvPgogICAgPHBvbHlnb24gcG9pbnRzPSIzMDAuMzMgNTc3LjUgNDQ3LjM0IDQ0NC4wMyA0NDcuMzQgMjM0LjgyIDE1Mi42NiAyMzQuODIgMTU0Ljg5IDIzNC44MiAxNTIuNjYgNDQ1LjkxIDMwMC4zMyA1NzcuNSIgc3R5bGU9ImZpbGw6IG5vbmU7IHN0cm9rZTogIzY1Yjc0MTsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBzdHJva2Utd2lkdGg6IDlweDsiLz4KICAgIDxwYXRoIGQ9Ik0xNTEuNSwyODguMXYyNi42NGw0NS4xMiw0MS45N3YxMDMuNThsNTUuOTYsNTIuMDZoOTMuNWw1NS43My01MS44NXYtMTAzLjQ5bDQ2LjctNDMuNDV2LTI1LjU3bC0yOTcsLjFaTTM1Mi42MSw0MTMuMzJjLTEwLjc3LDE0LjItMjcuNTksMjkuMDYtNTMuNDYsMjkuMDZzLTQyLjQzLTE0Ljg2LTUzLjYtMjkuMDZ2LTE1LjA4YzEzLDE1Ljc1LDMwLjA4LDI3Ljk1LDUzLjczLDI3Ljk1czQwLjMzLTExLjk4LDUzLjMzLTI3Ljk1djE1LjA4WiIgc3R5bGU9ImZpbGw6ICM2NWI3NDE7Ii8+CiAgICA8cGF0aCBkPSJNMTQ5LjE5LDIyNy42N3Y2Ny44N2gxMDUuN2w0Ni4yOCw2MS40Ni42My0uMjIsNDYuODEtNjIuODFoMTAyLjJ2LTY2LjNIMTQ5LjE5Wk0zOTMuNTgsMjc3LjU1aC0xODcuMTZ2LTM0LjU0aDE4Ny4xNnYzNC41NFoiIHN0eWxlPSJmaWxsOiAjNTk4OTNmOyIvPgogIDwvZz4KPC9zdmc+"; }; symbol = opt "BKM"; terms = null; turbo = true })' --ic
```

#### Workflow: 
*** estimate_etching_fee_v2（Optional） -> etching_v2(The icrc2_approve method should be called beforehand) -> get_etching（Optional）***
* When the api is called, the workflow proceeds as follows: Execute the commit transaction- > Wait for 6 blocks -> Execute the reveal transaction -> Wait for 4 blocks for the transaction -> Create the icp token ledger. So the total time would typically take around 10 blocks. After creating the ledger, if there is a premine, a cross-chain transaction will be initiated. Approximately 1 to 2 hours.
* For icp ledger creation: if you've already etched your runes elsewhere and want to add them to the Omnity system, you can do so either through our [UI](https://bridge.omnity.network/runes/add%20runes) or via our apis. To make the process more convenient, we've integrated the rune-adding functionality directly into the etching api, so you won’t need to repeat the process. We have 3 apis for this function are currently open for use from Hub:
		* add_runes_token – Adds tokens to Omnity.
		* add_dest_chain_for_token – Connects the token to the chain.
		* link_chains - Connecting two chains.
* To check your rune information, please visit [Unisat](https://unisat.io/runes/detail/OMNITY%E2%80%A2ETCHING%E2%80%A2TEST). After 10 blocks, if you don't have any premine runes, you can check [here](https://bridge.omnity.network/runes/mint) to see if your tokens exist in the system. If you do have premine runes, a ticket will be generated at [Omnity Hub Explorer](https://explorer.omnity.network/) after 6 blocks.
* To check the icrc ledger canister id for the bridged runes asset, please visit [this page](https://explorer.omnity.network/tokens), select the token, and click "Chains" in the top right, as shown below.
![token ledger ids](/img/1.png) 

### estimate_etching_fee_v2
Estimate the etching fee.
```md title="estimate_etching_fee_v2(rune_name: String, logo: Option<LogoParams>) -> Result<u128, String>"
The return is either a number or an error message. The number represents the amount of the smallest unit of ICP tokens required for payment. For example, 100000000 indicates 1 ICP.

Parameters:
 * rune_name: The name of the rune the user wants to etch, including the delimiter.
 * logo: The image information of the rune. If no image needs to be uploaded, this can be left empty. This is a structured parameter containing two fields:
			- content_type(String): The format of the image, such as image/png, image/jpeg, etc.
			- content_base64(String): The base64-encoded content of the image.
```

----------------------------------------------------------------------------
**Query:**
### get_etching_by_user
Retrieve all rune etching information associated with the given user_addr.
```md title="get_etching_by_user(user_addr: Principal) -> Vec<SendEtchingInfo>"
Return SendEtchingInfo: see get_etching
```

### get_etching
Query rune etching status.
```md title="get_etching(commit_txid: String) -> Option<SendEtchingInfo>"
Parameters: commit_txid: The return from etching.

Return SendEtchingInfo: 
 * commit_txid: The transaction hash of the commit transaction.
 * reveal_txid: The transaction hash of the reveal transaction.
 * time_at: The creation time.
 * err_info: Contains error information if there are any errors, otherwise it is empty.
 * etching_args: The etching content, consistent with the content submitted when initiating etching.
 * status: The status of the etching, indicating the current phase and state. Possible values include:
			- Initial: Indicates that the etching request has been accepted by Omnity. Our canister will then send it to the bitcoin network.
			- SendCommitSuccess: Indicates that the commit transaction for the etching has been successfully sent. The program will submit the reveal after 6 confirmations.
			- SendCommitFailed: Indicates that the commit transaction for the etching failed, and there will be no further progress.
			- SendRevealSuccess: Indicates that the reveal transaction has been successfully submitted. Subsequently, the corresponding cross-chain token will be added to the cross-chain bridge.
			- SendRevealFailed: Indicates that the reveal transaction failed, and there will be no further progress.
			- TokenAdded: Indicates that a request to add the token to the hub has been sent and successfully processed.
			- Final: Indicates that bitcoin_customs has received the directive to add the token. There will be no further progress unless premine is required for the etching.
```

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

### get_btc_address
Generate a bitcoin address using the target chain and receiver as the derivation path, and use it as the token locking account.
```md title="get_btc_address(args: GetBtcAddressArgs) -> String"
Parameters:
arg: GetBtcAddressArgs - a struct containing:
					target_chain_id: String
					receiver: String - a principal id/Account(in hex format, icrc ledger supports account id)
```
### get_xpub_key
MAINNET_XPUBKEY
```md title="get_xpub_key() -> ECDSAPublicKey"
Returns:
arg: ECDSAPublicKey - a struct containing:
					public_key - Vec<u8>
					chain_code - Vec<u8>
```

### generate_ticket_status
Retrieve the status of ticket_id generation operation.
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"
Returns:
GenTicketStatus - an enum containing:
	Unknown,
    Pending(GenTicketRequestV2)
    Confirmed(GenTicketRequestV2)
    Finalized(GenTicketRequestV2)

GenTicketRequestV2 - a struct containing:   
        * address - String
        * target_chain_id - String
        * receiver - String
        * token_id - TokenId
        * rune_id - RuneId
		* amount - u128
		* txid - Txid
		* new_utxos - Vec<Utxo>
		* received_at - u64
```

### get_runes_oracles
Get the list of runes oracles canister ids.
```md title="get_runes_oracles() -> Vec<Principal>"
Returns:
Vec<Principal>: a list of the runes oracle canister ids
```

### estimate_redeem_fee
Get the estimated fee needed for redeeming chain_id on bitcoin network.
```md title="estimate_redeem_fee(arg: EstimateFeeArgs) -> RedeemFee"
Parameters:
arg: EstimateFeeArgs - a struct containing:
		rune_id: RuneId
		amount: Option<u128>

Returns:
RedeemFee(bitcoin_fee: u64) - the fee amount
```

### get_chain_list
Retrieve a list of chains that connect with the bitcoin network.
```md title="get_chain_list() -> Vec<Chain>"
Returns:
Vec<Chain>: struct containing:
        chain_id: ChainId
        canister_id: String
        chain_type: ChainType
        chain_state: ChainState
        contract_address: Option<String>
        counterparties: Option<Vec<ChainId>>
        fee_token: Option<TokenId>
```


### get_token_list
Retrieve a list of tokens available on the bitcoin network.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
```



## eICP
**Update:**
### generate_ticket_v2
Generate an cross-chain transaction from icp network on Omnity.
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
Parameters:
req: GenerateTicketReq - struct containing:
        * target_chain_id: String
        * receiver: String
        * token_id: String
        * amount: u128
        * from_subaccount: Option<Subaccount>
        * action: TxAction
        
Returns:
Result: a variant containing either:
        GenerateTicketOk: a ticket_id String information will be returned if the operation succeeds
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```

```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the runes(e.g. $HOPE•YOU•GET•RICH has two decimals so the input will be 10*100).

let redeem_args = GenerateTicketReq {
		target_chain_id: "Bitcoin".to_string(),
		receiver: "bc1qu597cmaqx5zugsz805wt5qsw5gnsmjge50tm8y".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
		action: TxAction::Redeem,
	}

let transfer_args = GenerateTicketReq {
		target_chain_id: "bevm".to_string(),
		receiver: "0xd1f4711f22e600E311f9485080866519ad4FbE3e".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
		action: TxAction::Transfer,
	}

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
		receiver: "".to_string(),
		token_id: "Bitcoin-runes-HOPE•YOU•GET•RICH".to_string(),
		amount: 10000,
		from_subaccount: None,
		action: TxAction::Burn,
	}
```

#### Workflow: 
***0***. The route uses the sub-account payment method. To use this api, the redeem fee must first be transferred to the sub-account. To check your sub-account, please use [get_fee_account](https://docs.omnity.network/docs/Omnity-Hub/runes#get_fee_account). To check the amount of the redeem fee, please use [get_redeem_fee](https://docs.omnity.network/docs/Omnity-Hub/runes#get_redeem_fee).
```md title="Request Example:"
# Retrieve a list of token_ids and ledger principals available on icp.
❯ dfx canister call icp_route get_token_list --ic

#  Retrieve the redeem fee information：
❯ dfx canister call icp_route get_redeem_fee '("Bitcoin")' --ic

# Approve icp(ryjl3-tyaaa-aaaaa-aaaba-cai:for redeem fees) & icrc token(e.g,:$Rich(77xez-aaaaa-aaaar-qaezq-cai)) by call the icrc2_approve method of the icp canister to authorize our canister (7ywcn-nyaaa-aaaar-qaeza-cai) to spend the transaction fee. Please ensure the transfer fee is deducted before approving the full balance.
❯ dfx canister call icp_ledger icrc2_approve '(record { spender=record { owner=principal "7ywcn-nyaaa-aaaar-qaeza-cai" } ; amount=60_010_000;   } )' --ic
❯ dfx canister call rich_ledger icrc2_approve '(record { spender=record { owner=principal "7ywcn-nyaaa-aaaar-qaeza-cai" } ; amount=100000;   } )' --ic

# Invoke the generate_ticket_v2 method:
❯  dfx canister call icp_route generate_ticket_v2 '(record { target_chain_id="Bitcoin"; receiver="bc1q55ghpce6jq8q78cfcnmkz8qq5ww3asd28dw"; token_id="Bitcoin-runes-HOPE•YOU•GET•RICH"; amount=100000; from_subaccount=null; action=variant { Redeem}  } )' --ic
```

***1***. The operation will be executed on icp based on the TxAction, for example, for TxAction::Redeem, on the icp side, the corresponding wrapped icrc runes token will be burned by calling the ledger.approve for the sender, and from the bitcoin side, the runes indexer will verify the sender account to see if there is original runes tokens, if so, will transfer from the generated bitcoin account to the receiver account.

***2***. Put the GenerateTicketReq as a parameter into generate_ticket from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

----------------------------------------------------------------------------

**Query:**
### mint_token_status
Returns the status of the wrapped token minting operation
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns:
MintTokenStatus: a enum containing:
* Finalized { block_index: u64 } represents the operation is succeeded with the transaction block index on the icp.
* Unknown represents the operation is not completed.
```

### get_chain_list
Retrieve a list of chains that connect with icp.
```md title="get_chain_list() -> Vec<Chain>"
Returns:
Vec<Chain>: struct containing:
        chain_id: ChainId
        canister_id: String
        chain_type: ChainType
        chain_state: ChainState
        contract_address: Option<String>
        counterparties: Option<Vec<ChainId>>
        fee_token: Option<TokenId>
```

### get_token_list
Retrieve a list of tokens available on icp.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
```

### get_token_ledger
Get the token ledger canister id based on token_id.
```md title="get_token_ledger(token_id: String) -> Option<Principal> "
Returns:
Option<Principal>: the token canister id
```

### get_fee_account
Get the account to which the transaction fee is sent.
```md title="get_fee_account(principal: Option<Principal>) -> AccountIdentifier"
Parameters:
principal: the account to which the transaction fee is sent

Returns:
AccountIdentifier: the fee account
```

### get_redeem_fee
Retrieve the fee information required for redeeming tokens on the icp.
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u64>"
Parameters:
chain_id: ChainId - the target chain

Returns:
Option<u64>: the fee amount
```

Last updated on April 24, 2025
