---
sidebar_position: 8
---

# CosmWasm

|  | Canister ID | Chain Id |
| --- | --- | --- |
| COSMWASM_ROUTE | ystyg-kaaaa-aaaar-qaieq-cai | osmosis-1 |
| COSMWASM_PROXY | ncfbq-kyaaa-aaaar-qah3a-cai | none |

#### Workflow: 
**Bitcoin -> Osmosis**:
* Generate a bitcoin address using get_btc_mint_address with an receiver osmosis account id.
* Transfer the btc from the sender to the generated bitcoin address through the wallet api(the get_btc_address from ckbtc_minter is used from this action).
* Call update_balance_after_finalization to create a scheduled task to trigger the update balance for ckBTC, and if successful, it will call generate ticket, after 6 block confirmation, the transaction result will be returned.

**Osmosis -> Bitcoin**:
* [Cosmwasm Port](https://github.com/octopus-network/omnity-port-cosmos) is the cosmwasm contract Omnity cross-chain system connect to for the Osmosis side operation. To interact with the contract, you can use either commandline([osmosisd](https://docs.osmosis.zone/osmosis-core/osmosisd/)) or typescript([cosmos client](https://www.npmjs.com/package/@cosmjs/cosmwasm-stargate)).
* To redeem the btc, we firstly call [get_fee_info](https://github.com/octopus-network/omnity-port-cosmos/blob/main/src/contract.rs#L502) from the contract, and then call [redeem_token](https://github.com/octopus-network/omnity-port-cosmos/blob/main/src/contract.rs#L71) to burn the wrapping btc and get the transaction hash(see [the command line example](https://github.com/octopus-network/omnity-port-cosmos?tab=readme-ov-file#testnet-deploy-cli)). The formatted payload will look like this: 
```code title="Typescript"
redeem_token: {
            token_id: "sICP-icrc-ckBTC",
            receiver: toAddr,
            amount: parsedAmount.toString(),
            target_chain: "sICP",
        }
```
* The transaction hash will be put into redeem function from CosmWasm Route, when the function is called, the ticket will be generated, and the transaction result can be see from **[Omnity Explorer](https://explorer.omnity.network/)**.

#### Light Client:
* The Cosmos light client verification logic is implemented in the CosmWasm Route canister.
* A scheduled task is added to periodically fetch and verify the latest block headers.
* A light client verification logic is added to our original redeem process.

## CosmWasm Proxy
**Update:**
### update_balance_after_finalization
```md title="update_balance_after_finalization(osmosis_account_id: String)"
A scheduled task will be created to trigger the update balance for ckBTC, and if successful, it will call generate ticket.
```

**Query:**
### get_btc_mint_address
```md title="get_btc_mint_address(osmosis_account_id: String) -> Result<String, String>"
Get the ckBTC mint address corresponding to the Osmosis account using this interface.
```

### get_identity_by_osmosis_account_id
```md title="get_identity_by_osmosis_account_id(osmosis_account_id: String) -> Result<Account, String>"
Get the icp account corresponding to the Osmosis account using this interface.
```
***Sources*** : 
[`Account`](https://github.com/octopus-network/omnity-interoperability/blob/main/proxy/cosmwasm/src/service.rs#L9)

## CosmWasm Route
**Update:**
### redeem
```md title="redeem(tx_hash: TxHash) -> std::result::Result<TicketId, String>"
Generate a ticket and send it to Hub.
```
***Sources*** : 
[`TxHash`](https://github.com/octopus-network/omnity-interoperability/)
[`TicketId`](https://github.com/octopus-network/omnity-interoperability/)


**Query:**
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation on the cosmos chain:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the cosmos chain.
* Unknown represents the operation is not completed.
```
***Sources*** : 
[`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/)
