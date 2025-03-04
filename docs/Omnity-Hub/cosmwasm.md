---
sidebar_position: 6
---

# CosmWasm

|  | Canister ID | Chain Id |
| --- | --- | --- |
| COSMWASM_ROUTE | ystyg-kaaaa-aaaar-qaieq-cai | osmosis-1 |
| COSMWASM_PROXY | ncfbq-kyaaa-aaaar-qah3a-cai | none |

#### Workflow(e.g.Bitcoin <-> Osmosis): 
**Bitcoin -> Osmosis**:
* Generate a bitcoin address using [get_btc_mint_address](https://docs.omnity.network/docs/Omnity-Hub/cosmwasm#get_btc_mint_address) with an receiver osmosis account id.
* Transfer the btc from the sender to the generated bitcoin address through the wallet api(the get_btc_address from ckbtc_minter is used from this action).
* Call [update_balance_after_finalization](https://docs.omnity.network/docs/Omnity-Hub/cosmwasm#update_balance_after_finalization) to create a scheduled task to trigger the update balance for ckBTC, and if successful, it will call generate_ticket from the icp custom, after 6 block confirmation, the transaction result will be returned.

**Osmosis -> Bitcoin**:
* [Cosmwasm Port](https://github.com/octopus-network/omnity-port-cosmos) is the cosmwasm contract Omnity cross-chain system connect to for the Osmosis side operation. To interact with the contract, you can use either commandline([osmosisd](https://docs.osmosis.zone/osmosis-core/osmosisd/)) or typescript([cosmos client](https://www.npmjs.com/package/@cosmjs/cosmwasm-stargate)).
* To redeem the btc, we firstly call [redeem_allbtc](https://github.com/octopus-network/omnity-port-cosmos/blob/main/src/contract.rs) to burn the wrapping btc and get the transaction hash(see [the command line example](https://github.com/octopus-network/omnity-port-cosmos?tab=readme-ov-file#testnet-deploy-cli)). The formatted payload will look like this: 
```code title="Typescript"
redeem_token: {
            receiver: toAddr,
            amount: parsedAmount.toString(),
            target_chain: "sICP",
        }
```
* The transaction hash will be put into [redeem](https://docs.omnity.network/docs/Omnity-Hub/cosmwasm#redeem) function from CosmWasm Route, when the function is called, the ticket will be generated, and the transaction result can be see from **[Omnity Explorer](https://explorer.omnity.network/)**.

#### Light Client:
* The Cosmos light client verification logic is implemented in the CosmWasm Route canister.
* A scheduled task is added to periodically fetch and verify the latest block headers.
* A light client verification logic is added to our original redeem process.

## CosmWasm Proxy
**Update:**
### update_balance_after_finalization
A scheduled task will be created to trigger the update balance for ckBTC, and if successful, it will call generate ticket.
```md title="update_balance_after_finalization(osmosis_account_id: String, ticket_memo: Option<String>)"
Parameters:
osmosis_account_id: String - the receiver address
ticket_memo: Option<String>
```

**Query:**
### get_btc_mint_address
Get the ckBTC mint address corresponding to the Osmosis account using this interface.
```md title="get_btc_mint_address(osmosis_account_id: String) -> Result<String, String>"
Parameters:
osmosis_account_id: String - the osmosis address

Returns:
Result: a variant containing either:
        String: the ckBTC mint address
        String: an error message as a string will be returned if the operation fails
```

### get_identity_by_osmosis_account_id
Get the icp account corresponding to the Osmosis account using this interface.
```md title="get_identity_by_osmosis_account_id(osmosis_account_id: String) -> Result<Account, String>"
Parameters:
osmosis_account_id: String - the osmosis address

Returns:
Result: a variant containing either:
        String: the address in Account format
        String: an error message as a string will be returned if the operation fails
```

## CosmWasm Route
**Update:**
### redeem
Generate ticket and send it to Hub.
```md title="redeem(tx_hash: TxHash) -> std::result::Result<TicketId, String>"
Parameters:
tx_hash: TxHash - the transaction id from the ton contract

Returns:
Result: a variant containing either:
        TicketId: a ticket information will be returned if the operation succeeds
        String: an error message as a string will be returned if the operation fails
```

### generate_ticket
Generate a ticket and send it to Hub.
```md title="generate_ticket(tx_hash: TxHash) -> std::result::Result<TicketId, String>"
Parameters:
tx_hash: TxHash - the transaction id from the ton contract

Returns:
Result: a variant containing either:
        TicketId: a ticket information will be returned if the operation succeeds
        String: an error message as a string will be returned if the operation fails
```

**Query:**
### mint_token_status
Returns the status of the wrapped token minting operation on the cosmos chain
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the cosmos chain.
* Unknown represents the operation is not completed.
```

### get_chain_list
Retrieve a list of chains that connect with the osmosis route.
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

e.g.: fee_token=null; canister_id="nnqqa-aaaaa-aaaar-qamla-cai"; chain_id="Dogecoin"; counterparties=opt vec {"osmosis-1"}; chain_state=variant {Active}; chain_type=variant {SettlementChain}; contract_address=null
```

### get_token_list
Retrieve a list of tokens available on the osmosis route.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
        token_denom: Option<String>

e.g.: decimals=8; token_id="dogecoin-native-DOGE"; token_denom=opt "factory/osmo10c4y9csfs8q7mtvfg4p9gd8d0acx0hpc2mte9xqzthd7rd3348tsfhaesm/dogecoin-native-DOGE"; icon=opt "https://cryptologos.cc/logos/dogecoin-doge-logo.svg"; rune_id=null; symbol="DOGE"
```
### get_fee
Retrieve the transaction fee based on chain_id as the target chain.
```md title="get_fee(chain_id: ChainId) -> Option<u64>"
Parameters:
chain_id: ChainId(String) - the target chain

Returns:
Option<u64>: the fee amount
```

Last updated on January 25, 2025