---
sidebar_position: 11
---

# Dogecoin

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_DOGECOIN | nnqqa-aaaaa-aaaar-qamla-cai | Dogecoin |

## Update
### generate_ticket
Generate an cross-chain transaction from the dogecoin network on Omnity.
It does not pass the txid. Instead, the dogecoin custom will query the most recent transactions and filter out the transactions that involve transfers to the deposit address, and then generate tickets.
```md title="generate_ticket(req: GenerateTicketArgs) -> Result<Vec<String>, CustomsError>"
Parameters:
req: GenerateTicketArgs - struct containing:
        * target_chain_id: String
        * token_id: String
        * receiver: String

Returns:
Result: a variant containing either:
        Ok: list of ticket ids
        CustomsError: the operation failed, and the CustomsError provides details about the failure
```
```md title="Rust Input Example:"
let args = GenerateTicketArgs {
            target_chain_id: "osmosis-1".to_string(),
            token_id: "dogecoin-native-DOGE".to_string(),
            receiver: "osmo1uqwp92j0a2xdntfxfjrs4a8gmpvh5elre07l3s".to_string(),
        };
```
#### Workflow(e.g.: Dogecoin -> Osmosis):
1. Obtain the bitcoin deposit address using [get_deposit_address](https://docs.omnity.network/docs/Omnity-Hub/dogecoin#get_deposit_address).
2. Send bitcoin to the deposit address.
3. After the transaction, call [generate_ticket](https://docs.omnity.network/docs/Omnity-Hub/dogecoin#generate_ticket) or [generate_ticket_by_txid](https://docs.omnity.network/docs/Omnity-Hub/dogecoin#generate_ticket_by_txid) (if the transaction id is available).
4. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

### generate_ticket_by_txid
If the transaction id(txid) is known, it will be used as input to generate a ticket.
```md title="generate_ticket_by_txid(req: GenerateTicketWithTxidArgs)-> Result<(), CustomsError>"
Parameters:
req: GenerateTicketWithTxidArgs - struct containing:
        * txid: String
        * target_chain_id: String
        * token_id: String
        * receiver: String

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        CustomsError: the operation failed, and the CustomsError provides details about the failure
```
```md title="Rust Input Example:"
let args = GenerateTicketWithTxidArgs {
            txid: "11ea9d3efa7471f0de807a8e1af389b80386e695ff3f74309310601eefad8579".to_string(),
            target_chain_id: "osmosis-1".to_string(),
            token_id: "dogecoin-native-DOGE".to_string(),
            receiver: "osmo1uqwp92j0a2xdntfxfjrs4a8gmpvh5elre07l3s".to_string(),
        };
```

## Query
### get_fee_payment_address
The dogecoin custom is covering the transaction fees during the redeem. To manage these fees, a dedicated fee payment address is utilized. This api is designed to retrieve information about that address.
```md title="get_fee_payment_address() -> Result<String, CustomsError>"
Returns:
Result: a variant containing either:
        String: the fee payment address
        CustomsError: the operation failed, and the CustomsError provides details about the failure
```

### get_deposit_address
The function accepts target_chain_id and address as input and returns an address on the dogecoin chain. If you deposit dogecoin into this returned address, it is considered a cross-chain transfer to the specified address on the target chain.
```md title="get_deposit_address(target_chain_id: String, receiver: String) -> Result<String, CustomsError>"
Parameters:
target_chain_id: String - the target chain
receiver: String - the receiver address

Returns:
Result: a variant containing either:
        Ok: the operation succeeded, but there is no additional value or data to return
        CustomsError: the operation failed, and the CustomsError provides details about the failure
```
```md title="Rust Input Example:"
let target_chain_id = "osmosis-1".to_string();
let receiver = "osmo1uqwp92j0a2xdntfxfjrs4a8gmpvh5elre07l3s".to_string();
```

### get_platform_fee
Retrieve the transaction fee.
```md title="get_platform_fee(target_chain: ChainId) -> (Option<u128>, Option<String>)"
Parameters:
target_chain_id: String - the target chain

Returns:
a tuple containing:
     Option<u128>: the fee amount
     Option<String>: the fee collector address
```
```md title="Rust Input Example:"
let target_chain_id = "osmosis-1".to_string();
```

### get_finalized_unlock_ticket_results
Retrieve the list of finalized redeem tickets where the target chain is the dogecoin chain.
```md title="get_finalized_unlock_ticket_results() -> Vec<SendTicketResult>"
Returns:
Vec<SendTicketResult>: a list of structs containing:
     txid: Txid - the structure has a single field, which is a public wrapper around a ByteArray with a fixed size of 32 byte(ByteArray<32>)
     success: bool - indicates whether an operation was successful or not
     time_at: u64 - unix timestamp format

e.g.: txid=vec {33; 142; 97; 221; 196; 201; 255; 186; 176; 198; 110; 95; 135; 17; 241; 173; 138; 135; 199; 94; 197; 71; 106; 65; 70; 4; 94; 9; 178; 44; 137; 162}; success=true; time_at=1735704485582704364
```

### get_finalized_lock_ticket_txids
Retrieve the list of finalized transfer tickets where the source chain is the dogecoin chain.
```md title="get_finalized_lock_ticket_txids() -> Vec<String>"
Returns:
Vec<String>: a list of finalized transfer tickets
```

### release_token_status
Returns the status of the dogecoin tokens withdrawal operation
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
```md title="Rust Input Example:"
let ticket_id = "11ea9d3efa7471f0de807a8e1af389b80386e695ff3f74309310601eefad8579".to_string();
```

### get_token_list
Retrieve a list of tokens available on the dogecoin custom.
```md title="get_token_list() -> Vec<TokenResp> "
Returns:
Vec<TokenResp>: a list of struct containing:
    * token_id: TokenId 
    * symbol: String 
    * decimals: u8 
    * icon: Option<String> 

e.g.: decimals=8; token_id="dogecoin-native-DOGE"; icon=opt "https://cryptologos.cc/logos/dogecoin-doge-logo.svg"; symbol="DOGE"
```

Last updated on January 25, 2025