---
sidebar_position: 7
---

# Solana(Settlement)

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_SOLANA | v76zi-jyaaa-aaaar-qaotq-cai | Solana|

## Update
### generate_ticket
Generate an cross-chain transaction from the solana custom.
```md title="generate_ticket(args: GenerateTicketArgs) -> Result<(), GenerateTicketError>"
 Parameters:
req: GenerateTicketArgs - struct containing:
        * target_chain_id: String
        * receiver: String
        * token_id: String
        * amount: u64
        * signature: String - the transaction id from the bitcoin transaction

Returns:
Result: a variant containing either:
        Ok(()): the operation completed successfully but returned no meaningful value
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```
```md title="Request Example:"
dfx canister call solana_customs generate_ticket '(record {token_id = "Solana-native-SOL"; target_chain_id = "eICP"; receiver = "onpkv-r64im-go7um-v7jnc-i33lg-ubem4-sxbyk-megsv-ww7fz-yzee7-zae"; amount = 8000000; signature = "2a3ruWTcRUAAtRPquWv6Hb6MTqa4sgSbjy7tNUbj86UQrVEVq53BFSHjmHZGCUMJjYQq9g29xFsDZkHRZAzZq88N"})' --ic

```

#### Workflow: 
***1***. Call the transport method in the Solana Port contract to lock a specified amount of SOL in the vault account. Upon successful completion of the transaction, a signature will be returned.

***2***. Put the function_hash(signature) as a parameter into generate_ticket from your dapp.

***3***. Go to **[Omnity Explorer](https://explorer.omnity.network/)** to track the generated ticket status.

## Query
### get_payer_address
Retrieve the fee payment address.
```md title="get_payer_address() -> String"
Returns:
String - the fee payment address
```

### generate_ticket_status
Retrieve the status of ticket_id generation operation.
```md title="generate_ticket_status(ticket_id: String) -> GenTicketStatus"
Returns:
GenTicketStatus - an enum containing:
        * Unknown,
        * Finalized(GenerateTicketArgs)

GenerateTicketArgs - a struct containing:   
        * arget_chain_id: String
        * receiver - String
        * token_id - String
        * amount - u64
        * signature - String
```

### release_token_status
Returns the status of the sol tokens withdrawal operation
```md title="release_token_status(ticket_id: String) -> ReleaseTokenStatus"
Returns:
ReleaseTokenStatus: a enum containing:
        * Unknown - the request id is either invalid or too old
        * Pending - the request is in the batch queue
        * Submitted(String) - awaiting for confirmations on the transaction satisfying this request
        * Confirmed(String) - confirmed a transaction satisfying this request
```
```

### get_chain_list
Retrieve a list of chains that connect with the solana custom.
```md title="get_chain_list() -> Vec<Chain>"
Returns:
Vec<Chain>: struct :
        chain_id: ChainId
        canister_id: String
        chain_type: ChainType
        chain_state: ChainState
        contract_address: Option<String>
        counterparties: Option<Vec<ChainId>>
        fee_token: Option<TokenId>
```

### get_token_list
Retrieve a list of tokens available on the solana custom.
```md title="get_token_list() -> Vec<Token>"
Returns:
Vec<Token>: struct containing:
        token_id: TokenId
        name: String
        symbol: String
        decimals: u8
        icon: Option<String>
        metadata: HashMap<String, String>
```


Last updated on March 04, 2025