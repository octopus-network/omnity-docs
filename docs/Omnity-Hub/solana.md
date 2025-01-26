---
sidebar_position: 5
---

# Solana

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_EXECUTION_SOLANA | lvinw-hiaaa-aaaar-qahoa-cai | eSolana|

## Update
### generate_ticket
```md title="generate_ticket(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
Generate an cross-chain transaction from the solana route. 
```


#### Workflow: 
***1***. Call the corresponding solana function with the [Solana SDK](https://www.npmjs.com/package/@solana/web3.js) and get the calculated function_hash(see [the code example](https://github.com/octopus-network/omnity-js/blob/main/packages/widget/src/wallet-kits/sol-wallet-kit/SOLWalletKitProvider.tsx)):
- **[solana HOPE•YOU•GET•RICH](https://explorer.solana.com/address/5HmvdqEM3e7bYKTUix8dJSZaMhx9GNkQV2vivsiC3Tdx)** is the token account address.

***2***. Put the function_hash as a parameter into generate_ticket from your dapp.

***3***. Go to **[Omnity Explorer](https://explorer.omnity.network/)** to track the generated ticket status.

## Query
### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with the solana route.
```

### get_fee_account
```md title="get_fee_account() -> String "
Get the account to which the transaction fee is sent.
```

### get_redeem_fee
```md title="get_redeem_fee(chain_id: ChainId) -> Option<u128>"
Retrieve the fee associated with redeeming the token based on chain_id.
```

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of tokens available on the solana route.
```

### query_mint_address
```md title="query_mint_address(token_id: TokenId) -> Option<String>"
Retrieve the token mint account based on token_id.
```

### mint_token_status
```md title="mint_token_status(ticket_id: String) -> Result<TxStatus, CallError>"
Returns the status of the wrapped token minting operation on the solana route.
```

### mint_token_tx_hash
```md title="mint_token_tx_hash(ticket_id: String) -> Result<Option<String>, CallError>"
Returns the transaction hash of the wrapped token minting operation on the solana route.
```

Last updated on January 25, 2025