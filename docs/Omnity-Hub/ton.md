---
sidebar_position: 10
---

# Ton

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_EXECUTION_TON | p5ykc-qaaaa-aaaar-qalyq-cai | Ton |

## Update
### generate_ticket
Generate an cross-chain transaction from ton network on Omnity.
```md title="generate_ticket(params: GenerateTicketArgs) -> Result<Ticket, String>"
Parameters:
req: GenerateTicketArgs - struct containing:
        * tx_hash: String - the transaction id from the ton contract
        * token_id: String
        * sender: String
		* amount: u128
		* target_chain_id: String
		* receiver: String

Returns:
Result: a variant containing either:
        Ticket: a ticket information will be returned if the operation succeeds
        String: an error message as a string will be returned if the operation fails
```
```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the token(e.g. $sICP-icrc-ckUSDC has 8 decimals so the input 1 will be 1*100_000_000).
let args = GenerateTicketArgs {
		tx_hash: "GOvuG2BbZdgtXHpCjlAuXuOUw3P5YDcH6u32yRgW/bM=".to_string(),
		token_id: "sICP-icrc-ckBTC".to_string(),
		sender: "UQD6DGveyyksJg_fahtJx-8qTe5ySuzN2UmqamResj2NRgEO".to_string()
		amount: 7000,
		target_chain_id: "sICP".to_string()
		receiver: "0xd1f4711f22e600E311f9485080866519ad4FbE3e".to_string(),
	}
```

#### Workflow: 
***1***. The UI will triger the [build_jetton_burn](https://github.com/octopus-network/brc20-mint/blob/main/src/main.rs#L60) function by making a http call using curl as shown in the example below to form the txid.
```md title="Curl Request Example:"
curl -X POST -H "Content-Type:application/json" --data 
'{
target_chain: "Bitfinity".to_string(),
receiver: "0x61359C8034534d4B586AC7E09Bb87Bb8Cb2F1561".to_string(),
amount: 10000,
user_addr: "UQBHU4zFh3V1RVBnoduXarBdaTGpo-vDcT-jadel-hIpmyti".to_string(),
jetton_master: "EQCW0ddLCQAn011bb8T2Xdoa40v6A_bL3cfjn0bplXdSKnWa".to_string(),
bridge_fee: 500000000,
}' https://brc20-mint.mainnet.octopus.network/jetton_burn
```
* jetton_master: The token contract on Ton. Each token has a jetton_master contract on the Ton.

***2***. Put the txid as one of the parameter into generate_ticket from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

## Query
### get_ticket
Retrieve the ticket information based on the ticket_id received by the TON route.
```md title="get_ticket(ticket_id: String) -> Option<(u64, Ticket)>"
Returns:
Option<(u64, Ticket)>: the ticket's sequence number and its associated information including: 
		ticket_id: TicketId
     	ticket_type: TicketType
    	ticket_time: Timestamp
    	src_chain: ChainId
    	dst_chain: ChainId
    	action: TxAction
    	token: TokenId
    	amount: String
    	sender: Option<Account>
    	receiver: Account
    	memo: Option<Vec<u8>>

e.g.: token="sICP-icrc-ckBTC"; action=variant {Transfer}; dst_chain="Ton"; memo=null; ticket_id="mxzaz-hqaaa-aaaar-qaada-cai_1944195"; sender=opt "c2bzs-5iaaa-aaaar-qakta-cai"; ticket_time=1735065750156503868; ticket_type=variant {Normal}; src_chain="sICP"; amount="61870"; receiver="UQDU2FwlifT7lmGKHvxqNsfdBAfUoF4CXE5RMJInB5hWwiZx"
```

### get_chain_list
Retrieve a list of chains that connect with this ton canister.
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

e.g.:fee_token=opt "BFT"; canister_id="pw3ee-pyaaa-aaaar-qahva-cai"; chain_id="Bitfinity"; counterparties=opt vec {"Bitcoin"; "sICP"; "eICP"; "Bitlayer"; "Bitcoinbrc20"; "Ton"; "osmosis-1"}; chain_state=variant {Active}; chain_type=variant {ExecutionChain}; contract_address=opt "0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468"
```

### get_token_list
Retrieve a list of tokens available on this ton canister.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<Chain>: struct containing:
		token_id: TokenId
		symbol: String
		decimals: u8
		icon: Option<String>
		rune_id: Option<String>
		ton_contract: Option<String>

e.g.: decimals=2; token_id="Bitcoin-runes-HOPE•YOU•GET•RICH"; icon=opt "https://github.com/ordinals/ord/assets/14307069/f1307be5-84fb-4b58-81d0-6521196a2406"; ton_contract=opt "EQBGKSkJ307rZY46kqSwwmHskOwSPEO5urm5EZ_EWFyk3bEO"; rune_id=opt "840000:846"; symbol="RICH.OT"
```

### mint_token_status
Returns the status of the wrapped token minting operation on the ton.
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Parameters:
ticket_id: String - the ticket id

Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the ton
* Unknown represents the operation is not completed
```

### get_fee
Retrieve the transaction fee based on chain_id as the target chain.
```md title="get_fee(chain_id: ChainId) -> (Option<u64>, String)"
Parameters:
chain_id: ChainId(String) - the target chain

Returns:
Result: a tuple containing:
     Option<u64>: the fee amount
     String: the fee collector address
```

Last updated on January 25, 2025