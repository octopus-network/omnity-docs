---
sidebar_position: 4
---

# Runes On ICP
**ICP -> BTC**:
For any icrc token (like $BOXY), it is possible to operate 100% premine on bitcoin with a suitable runes ticker and bridge total supply to icp via Omnity, then connect it up with the icrc token on the icp side.

It be achieved by using [generate_ticket2](http://localhost:3000/docs/Omnity-Hub/runes#generate_ticket_v2) on eICP based on where you want to utilize the runes tokens:

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_EXECUTION_ICP | 7ywcn-nyaaa-aaaar-qaeza-cai | eICP|

* For minting runes from icp, please use generate_ticket from eICP with TxAction::Mint.
* For withdrawing runes from icp to btc, please use generate_ticket from eICP with TxAction::Redeem.
* For burning runes from icp (the runes tokens will be burnt on the layer 1 chain as well), please use generate_ticket from eICP with TxAction::Burn.

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



## ICP ICRC

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_ICP | nlgkm-4qaaa-aaaar-qah2q-cai | sICP |

**Update:**
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

**Query:**
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



## Runes Indexer
**[Runes Indexer](https://github.com/octopus-network/runes-indexer)** is a canister deployed on the ic that continuously fetches bitcoin blocks from a bitcoin rpc endpoint using https outcalls. The blocks are verified using ic's bitcoin integration. Once verified, the indexer parses and indexes runes information within each block. See how it is used in [Omnity](https://github.com/octopus-network/omnity-interoperability/tree/main/proxy/runes_indexer_proxy).

[This guide](https://github.com/octopus-network/runes-indexer/blob/master/development-guide.md) assists developers in setting up their local development environment and running tests for Runes Indexer (in dfx 0.24.3, https outcalls can make requests to non-https endpoints).

|  | Canister Id |
| --- | --- |
| RUNES INDEXER | kzrva-ziaaa-aaaar-qamyq-cai |
| RUNES INDEXER TESTNET| f2dwm-caaaa-aaaao-qjxlq-cai |
| Etching Canister| t4zai-saaaa-aaaan-qzz7q-cai |
| Etching Canister test| e2rzq-6iaaa-aaaan-qz2ca-cai |

**Update:**
### etching
Initiate etching.
```md
etching : (EtchingArgs) -> (Result);

type EtchingArgs = record {
  terms : opt OrdinalsTerms;
  turbo : bool;
  premine : opt nat;
  logo : opt LogoParams;
  rune_name : text;
  divisibility : opt nat8;
  premine_receiver : text;
  symbol : opt text;
};

type OrdinalsTerms = record {
  cap : nat;
  height : record { opt nat64; opt nat64 };
  offset : record { opt nat64; opt nat64 };
  amount : nat;
};

type LogoParams = record { content_type : text; content_base64 : text };

type Result = variant { Ok : text; Err : text };
```

See the process in the example below(for more details about the parameters, please refer to the description [here](https://docs.omnity.network/docs/Omnity-Hub/runes#etching)):
```md
1. Approve fee
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai  icrc2_approve '(record { amount = 1000000; spender = record{owner = principal "f2dwm-caaaa-aaaao-qjxlq-cai";} })' --ic
"ryjl3-tyaaa-aaaaa-aaaba-cai" is the ICP ledger, and "f2dwm-caaaa-aaaao-qjxlq-cai" is the testnet4 runes-indexer canister_id. You need to approve the runes-indexer to spend 0.001 ICP from your account. These are all fixed parameters.

2. Perform etching and actual fee deduction: note that the logo should be provided as a base64-encoded string
dfx canister call runes-indexer-testnet etching '(record {terms=opt record {cap=10000; height=record {null; null}; offset=record {null; null}; amount=100}; turbo=true; premine=opt 10000; logo=null; rune_name="MAKE•RICH•GREAT•AGAIN"; divisibility=opt 2; premine_receiver="tb1q837dfu2xmthlx6a6c59dvw6v4t0erg6c4mn4e2"; symbol=opt "$"})' --ic
```

**Query:**
### get_etching
Retrieves the rune_id that was etched in a specific transaction.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```md 
get_etching : (text) -> (opt GetEtchingResult) query;

type GetEtchingResult = record { confirmations : nat32; rune_id : text };
```
Parameters:
txid: String - transaction id

Returns:
* confirmations: u32 - number of confirmations
* rune_id: String - the etched rune identifier

```md title="Example:"
❯ dfx canister call runes-indexer get_etching '("d66de939cb3ddb4d94f0949612e06e7a84d4d0be381d0220e2903aad68135969")' --ic
# Returns:
(opt record {
  confirmations = 39_825 : nat32;
  rune_id = "840000:846"
})
```

### get_latest_block
Returns the latest indexed block height and hash.
```md 
get_latest_block : () -> (nat32, text) query;
```
Returns:

* u32: the block height
* String: the block hash

```md title="Example:"
❯ dfx canister call runes-indexer get_latest_block --ic
# Returns:
(
  879_823 : nat32,
  "00000000000000000001aa3e25bf07fee9bacb44e78506b158f6928fd41331d2",
)
```

### get_rune
Retrieves detailed information about a rune using its spaced name.
It includes the number of block confirmations in the return. It is up to the application to decide whether to use the returned data based on the number of confirmations.
```md
get_rune : (text) -> (opt RuneEntry) query;

type RuneEntry = record {
  confirmations : nat32;
  mints : nat;
  terms : opt Terms;
  etching : text;
  turbo : bool;
  premine : nat;
  divisibility : nat8;
  spaced_rune : text;
  number : nat64;
  timestamp : nat64;
  block : nat64;
  burned : nat;
  rune_id : text;
  symbol : opt text;
};

type Terms = record {
  cap : opt nat;
  height : record { opt nat64; opt nat64 };
  offset : record { opt nat64; opt nat64 };
  amount : opt nat;
};
```
Parameters:
* str_spaced_rune: String - spaced rune name

Returns:
* confirmations: nat32 - number of confirmations
* rune_id: text - unique rune identifier

```md title="Example:"
❯ dfx canister call runes-indexer get_rune '("HOPE•YOU•GET•RICH")' --ic
# Returns:
(
  opt record {
    confirmations = 39_825 : nat32;
    mints = 81_000 : nat;
    terms = opt record {
      cap = opt (81_000 : nat);
      height = record { opt (840_001 : nat64); opt (844_609 : nat64) };
      offset = record { null; null };
      amount = opt (10_000_000 : nat);
    };
    etching = "d66de939cb3ddb4d94f0949612e06e7a84d4d0be381d0220e2903aad68135969";
    turbo = true;
    premine = 0 : nat;
    divisibility = 2 : nat8;
    spaced_rune = "HOPE•YOU•GET•RICH";
    number = 431 : nat64;
    timestamp = 1_713_571_767 : nat64;
    block = 840_000 : nat64;
    burned = 48_537_380 : nat;
    rune_id = "840000:846";
    symbol = opt "🧧";
  },
)
```


### get_rune_by_id
Similar to get_rune, but uses the rune_id as identifier instead of the spaced name.
```md
get_rune_by_id : (text) -> (opt RuneEntry) query;

type RuneEntry = record {
  confirmations : nat32;
  mints : nat;
  terms : opt Terms;
  etching : text;
  turbo : bool;
  premine : nat;
  divisibility : nat8;
  spaced_rune : text;
  number : nat64;
  timestamp : nat64;
  block : nat64;
  burned : nat;
  rune_id : text;
  symbol : opt text;
};

type Terms = record {
  cap : opt nat;
  height : record { opt nat64; opt nat64 };
  offset : record { opt nat64; opt nat64 };
  amount : opt nat;
};
```
Parameters:
* str_rune_id: Rune ID (e.g., "840000:846")


Returns:
* Same as get_rune

```md title="Example:"
❯ dfx canister call runes-indexer get_rune_by_id '("840000:846")' --ic
```


### get_rune_balances_for_outputs
Retrieves rune balances for a list of transaction outputs.

```md
get_rune_balances_for_outputs : (vec text) -> (Result_1) query;

type Result_1 = variant { Ok : vec opt vec RuneBalance; Err : Error };

type RuneBalance = record {
  confirmations : nat32;
  divisibility : nat8;
  amount : nat;
  rune_id : text;
  symbol : opt text;
};
```

```md title="Example:"
Parameters: outpoint: Vec<String> (array of outpoints in format "txid:vout")
❯ dfx canister call runes-indexer get_rune_balances_for_outputs '(vec {
  "8f6ebbc114872da3ba105ce702e4793bacc1cf199940f217b38c0bd8d9bfda3a:0";
  "f43158badf8866da0b859de4bffe73c2a910996310927c72431cf486e25dd3ab:1"
})' --ic
# Returns:
(
  variant {
    Ok = vec {
      opt vec {
        record {
          confirmations = 112 : nat32;
          divisibility = 2 : nat8;
          amount = 19_000_000 : nat;
          rune_id = "840000:846";
          symbol = opt "🧧";
        };
      };
      opt vec {
        record {
          confirmations = 61 : nat32;
          divisibility = 2 : nat8;
          amount = 2_092_100 : nat;
          rune_id = "840000:846";
          symbol = opt "🧧";
        };
      };
    }
  },
)
```

Last updated on July 21, 2025