---
sidebar_position: 4
---

# Runes On Bitcoin
**BTC -> ICP**:
For any existing runes tokens on bitcoin, it is possible to bridge them to icp by having Omnity create the corresponding icrc tokens on the icp side.

It be achieved by using [generate_ticket](https://docs.omnity.network/docs/Omnity-Hub/runes_on_bitcoin#generate_ticket) on Bitcoin based on where you want to utilize the runes tokens:

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_HUB | 7wupf-wiaaa-aaaar-qaeya-cai | none |
| OMNITY_SETTLEMENT_BITCOIN | 7rvjr-3qaaa-aaaar-qaeyq-cai | Bitcoin|

* For btc to icp, please use generate_ticket from Bitcoin as an transfer operation.

#### Workflow: 
***1***. Get the bitcoin deposit address from get_btc_address by providing the target chain id and the receiver address as a derivative path. And this bitcoin deposit address is owned by the bitcoin customs canister(thanks to [the chain key](https://internetcomputer.org/how-it-works/chain-key-technology) feature).  Generate a txid (transaction hash) from a PSBT by signing it with [lasereyes](https://www.npmjs.com/package/@omnisat/lasereyes). This action is to lock the runes tokens by transfering them to the bitcoin deposit address.

***2***. Put the txid as one of the parameter into generate_ticket from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

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

----------------------------------------------------------------------------
**Query:**

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




Last updated on July 21, 2025
