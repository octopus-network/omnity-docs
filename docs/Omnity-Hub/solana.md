---
sidebar_position: 5
---

# Solana

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_EXECUTION_SOLANA | lvinw-hiaaa-aaaar-qahoa-cai | eSolana|

## Update
### generate_ticket
Generate an cross-chain transaction from the solana route.
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
 Parameters:
req: GenerateTicketArgs - struct containing:
        * signature: String - the transaction id from the bitcoin transaction
        * target_chain_id: String
        * sender: String
        * receiver: String
        * token_id: String
        * amount: u64
        * action: TxAction
        * memo: Option<String>

Returns:
Result: a variant containing either:
        GenerateTicketOk: a ticket_id String information will be returned if the operation succeeds
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```

#### Workflow: 
***1***. Call the corresponding solana function with the [Solana SDK](https://www.npmjs.com/package/@solana/web3.js) and get the calculated function_hash(see [the code example](https://github.com/octopus-network/omnity-js/blob/main/packages/widget/src/wallet-kits/sol-wallet-kit/SOLWalletKitProvider.tsx)):
- **[solana HOPE•YOU•GET•RICH](https://explorer.solana.com/address/5HmvdqEM3e7bYKTUix8dJSZaMhx9GNkQV2vivsiC3Tdx)** is the token account address.

***2***. Put the function_hash(signature) as a parameter into generate_ticket from your dapp.

***3***. Go to **[Omnity Explorer](https://explorer.omnity.network/)** to track the generated ticket status.

## Query
### get_chain_list
Retrieve a list of chains that connect with the solana route.
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

### get_fee_account
Get the account to which the transaction fee is sent.
```md title="get_fee_account() -> String "
Returns:
String: the fee account
```

### get_redeem_fee
Retrieve the fee associated with redeeming the token based on chain_id.
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u128>"
Parameters:
chain_id: ChainId - the target chain

Returns:
Option<u128>: the fee amount
```

### get_token_list
Retrieve a list of tokens available on the solana route.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
```

### query_mint_address
Retrieve the token mint account based on token_id.
```md title="query_mint_address(token_id: TokenId) -> Option<String>"
Returns: the token contract address
```

### mint_token_status
Returns the status of the wrapped token minting operation on the solana route.
```md title="mint_token_status(ticket_id: String) -> Result<TxStatus, CallError>"
Returns:
Result: a variant containing either:
        TxStatus: a enum containing: 
                        New,
                        Pending,
                        Finalized,
                        TxFailed { e: String }
        CallError: the operation failed, and the CallError provides details about the failure
```

### mint_token_tx_hash
Returns the transaction hash of the wrapped token minting operation on the solana route.
```md title="mint_token_tx_hash(ticket_id: String) -> Result<Option<String>, CallError>"
Returns:
Result: a variant containing either:
        Option<String>: the operation succeeded and the transaction hash will be returned
        CallError: the operation failed, and the CallError provides details about the failure
```

Last updated on January 25, 2025