---
sidebar_position: 5
---

# ICP ICRC

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_ICP | nlgkm-4qaaa-aaaar-qah2q-cai | sICP |

## Update
### generate_ticket_v2
Generate an cross-chain icrc transaction from icp network on Omnity.
```md title="generate_ticket_v2(args: GenerateTicketReq) -> Result<GenerateTicketOk, GenerateTicketError>"
Parameters:
req: GenerateTicketReq - struct containing:
		* target_chain_id: String
		* receiver: String
		* token_id: String
		* amount: u128
		* from_subaccount: Option<Subaccount>
        * memo: Option<String>
		
Returns:
Result: a variant containing either:
        GenerateTicketOk: a ticket_id String information will be returned if the operation succeeds
        GenerateTicketError: the operation failed, and the GenerateTicketError provides details about the failure
```

```md title="Rust Input Example:"
# The amount is multiplied by the decimals of the token(e.g. $sICP-icrc-ckUSDC has six decimals so the input will be 1*1_000_000).
let args = GenerateTicketReq {
		target_chain_id: "Bitfinity".to_string(),
		receiver: "0xd1f4711f22e600E311f9485080866519ad4FbE3e".to_string(),
		token_id: "sICP-icrc-ckUSDC".to_string(),
		amount: 1_000_000,
		from_subaccount: None,
	}
```

#### Workflow: 
***1***. Get the icp address from [get_account_identifier](https://docs.omnity.network/docs/Omnity-Hub/icp_icrc#get_account_identifier) by providing the receiver principal address. And this bitcoin deposit address is owned by the icp customs canister. This action is to lock the icrc tokens by transfering them to the deposit address.

***2***. Put the GenerateTicketReq as a parameter into generate_ticket_v2 from your dapp.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.

## Query
### get_account_identifier
Generate an account to which the icrc tokens will be sent for locking.
```md title="get_account_identifier(principal: Principal) -> AccountIdentifier "
Parameters:
principal: Principal(e.g.:uw6ci-4ht6p-gyc3l-j3xjd-xcsrv-jvgdr-5bocd-avufe-puczq-67lkf-zae)

Returns:
AccountIdentifier(e.g.:vec {253; 193; 25; 193; 31; 182; 113; 183; 7; 165; 84; 158; 251; 253; 137; 8; 113; 6; 211; 250; 11; 182; 59; 180; 246; 167; 32; 40; 50; 170; 143; 5})
```

### get_chain_list
Retrieve a list of chains that connect with this icp settlement canister.
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

e.g.: fee_token=opt "BFT"; canister_id="pw3ee-pyaaa-aaaar-qahva-cai"; chain_id="Bitfinity"; counterparties=opt vec {"Bitcoin"; "sICP"; "eICP"; "Bitlayer"; "Bitcoinbrc20"; "Ton"; "osmosis-1"}; chain_state=variant {Active}; chain_type=variant {ExecutionChain}; contract_address=opt "0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468"
```

### get_token_list
Retrieve a list of tokens available on this icp settlement canister.
```md title="get_token_list() -> Vec<Token>"
Returns:
Vec<Token>: struct containing:
        token_id: TokenId
        name: String
        symbol: String
        decimals: u8
        icon: Option<String>
        metadata: HashMap<String, String>

e.g.: decimals=8; token_id="sICP-icrc-BOB"; metadata=vec {record {"ledger_id"; "7pail-xaaaa-aaaas-aabmq-cai"}}; icon=opt "https://raw.githubusercontent.com/octopus-network/omnity-token-imgs/refs/heads/main/BOB.png"; name="BOB"; symbol="BOB"
```

### mint_token_status
Returns the status of the wrapped token minting operation on the icp
```md title="mint_token_status(ticket_id: TicketId) -> MintTokenStatus"
Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the icp.
* Unknown represents the operation is not completed.
```

Last updated on January 25, 2025