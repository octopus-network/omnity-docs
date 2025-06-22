---
sidebar_position: 1
---

# APIs
[RichSwap](https://github.com/octopus-network/richswap-canister) is the first AMM DEX exchange on [REE](http://localhost:3000/docs/REE/apis).

For Rich Swap testnet4 please visit **[Rich Swap Testnet](https://richswap-testnet.vercel.app/swap)**.

For Rich Swap support please visit **[The Rich Swap Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/1529837122)** in both English and Chinese.

|  | Canister Id |
| --- | --- |
| Rich Swap | kmwen-yaaaa-aaaar-qam3a-cai |
| Rich Swap Testnet | h43eb-lqaaa-aaaao-qjxgq-cai |

## Query
#### Workflow(e.g., Swap): 
The core business logic of Rich Swap is encapsulated within the following functions: pre_withdraw_liquidity, pre_add_liquidity, pre_swap, pre_donate(to ensure fairness and incentivize long-term liquidity provision) and create. To gain a clearer understanding of their functionality, please refer to the example workflow provided below:

**  1. Invoke pre_swap and Display SwapOffer:**

The client application call the [pre_swap](https://docs.omnity.network/docs/Rich-Swap/apis#pre_swap) function based on user input. Once the SwapOffer is generated, it should be displayed on the frontend for the user to review and confirm. For every update request that modifies the pool's state, there is a corresponding pre_x method. In the case of a swap, the pre_swap method is invoked to retrieve the quotation and the pool's utxo as input.

** 2. Construct a PSBT Using the Wallet API:**

After the user confirms the SwapOffer, the frontend will use the wallet api to construct a psbt (Partially Signed Bitcoin Transaction) based on the provided input parameters and the [estimate_min_tx_fee](https://docs.omnity.network/docs/REE/apis#estimate_min_tx_fee), following the verification of the address's utxos. Unlike BTC utxos, which can be fetched with 0 confirmations through the Unisat api, Runes utxos must be retrieved using the [get_zero_confirmed_utxos_of_address](https://docs.omnity.network/docs/REE/apis#get_zero_confirmed_utxos_of_address) method from REE. This step involves significant technical complexity. For a comprehensive guide on constructing a psbt, refer to this [example](https://github.com/unisat-wallet/wallet-utils/blob/master/src/tx-helpers/send-runes.ts).

** 3. Invoke REE's invoke Function:** 

Once the PSBT is constructed, it is passed along with the intention(see the [example](https://github.com/octopus-network/ree-types/blob/master/intention_set_samples/add_liquidity.json) or the code ***[here](https://github.com/octopus-network/richswap-canister/tree/feature/donate/donate-cli)*** for details (this simple CLI tool donates 10,000 sats to a specified pool))  to call [REE's invoke function](https://docs.omnity.network/docs/REE/apis#invoke). This function will subsequently trigger the **execution_tx** function of the Rich Swap exchange. The Rich Swap exchange will then perform [the necessary checks](https://github.com/octopus-network/richswap-canister?tab=readme-ov-file#how-it-works) to ensure the transaction is valid.

** 4. Broadcast the Transaction and Handle Results:**

When all transactions processed through the exchange are successful, REE will finalize and broadcast them, returning the result information indicating that the transaction was processed successfully. If the transaction fails, the Mempool Connector will notify REE, and an error will be returned instead.

### pre_withdraw_liquidity
```md
type CoinBalance = record { id : text; value : nat };

type Utxo = record {
  coins : vec CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type WithdrawalOffer = record {
  nonce : nat64;
  input : Utxo;
  user_outputs : vec CoinBalance;
};

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_11 = variant { Ok : WithdrawalOffer; Err : ExchangeError };

pre_withdraw_liquidity : (text, text, nat) -> (Result_11) query;
```
* Input: pool_addr - String (pool address)
* Input: user_addr - String
* Input: share - u128

* WithdrawalOffer: for constructing the PSBT as part of the inputs

### pre_add_liquidity
```md
type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type CoinBalance = record { id : text; value : nat };

type LiquidityOffer = record {
  output : CoinBalance;
  inputs : opt Utxo;
  nonce : nat64;
};

type Result_7 = variant { Ok : LiquidityOffer; Err : ExchangeError };

pre_add_liquidity : (text, CoinBalance) -> (Result_7) query;
```
* Input: pool_addr - String (pool address)
* Input: side - CoinBalance (user's input)

* LiquidityOffer: for constructing the PSBT as part of the inputs

### pre_swap
```md
type CoinBalance = record { id : text; value : nat };

type Utxo = record {
  coins : vec CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type SwapOffer = record {
  output : CoinBalance;
  nonce : nat64;
  price_impact : nat32;
  input : Utxo;
};

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_10 = variant { Ok : SwapOffer; Err : ExchangeError };

pre_swap : (text, CoinBalance) -> (Result_10) query;
```
* Input: id - String (pool address)
* Input: input - CoinBalance (user's input)

* SwapOffer: for constructing the PSBT as part of the inputs

### pre_donate
```md
type CoinBalance = record { id : text; value : nat };

type Utxo = record {
  coins : vec CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type DonateIntention = record {
  out_rune : CoinBalance;
  out_sats : nat64;
  nonce : nat64;
  input : Utxo;
};

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_8 = variant { Ok : DonateIntention; Err : ExchangeError };

pre_donate : (text, nat64) -> (Result_8) query;
```
* Input: pool - String (pool address)
* Input: input_sats - u64 (in satoshi)

And it returns:
DonateIntention: for constructing the PSBT as part of the inputs
* out_rune - the rune output to pool
* out_sats - the btc output to pool
* nonce - pool transaction indexing
* input - the utxo belongs to pool

#### Donation Workflow:
The donation process follows a similar workflow to [the example above](https://docs.omnity.network/docs/Rich-Swap/apis#workfloweg-swap):
* Invoke [pre-donate](https://docs.omnity.network/docs/Rich-Swap/apis#pre_donate)
* Construct PSBT & DonateIntention 
* Use the PSBT and intention to call [REE’s invoke function](https://docs.omnity.network/docs/REE/apis#invoke) 
* REE executes the transaction via [RichSwap::execute_tx](https://dashboard.internetcomputer.org/canister/kmwen-yaaaa-aaaar-qam3a-cai#execute_tx)

For each DonateIntention, the parameters are determined by business logic. In this case (action = "donate"), the exchange enforces the following rules:
* Exactly 1 `input_coins`, which must be BTC (ID: "0:0")
* No `output_coins`
* `pool_utxo_spent` must reference the UTXO of the just-received DonateIntention
* `pool_utxo_received` must reference this transaction’s UTXO

PSBT Structure
Inputs:
* Input 0: DonateIntention::input
* Input 1: User’s input (BTC to donate)
Outputs:
* Output 0: DonateIntention::out_sats (donation amount)
* Output 1: Encoded `OP_RETURN`(out_rune)
* Output 2: User’s change (if applicable)

```
    IntentionSet {
        tx_fee_in_sats: fee,
        initiator_address: input_address.to_string(),
        intentions: vec![Intention {
            input_coins: vec![InputCoin {
                coin: CoinBalance {
                    id: "0:0".to_string(),
                    value: 10000,
                },
                from: input_address.to_string(),
            }],
            output_coins: Vec::new(),
            action: "donate".to_string(),
            exchange_id: "RICH_SWAP".to_string(),
            pool_utxo_spend: vec![format!("{}:{}", pool_spend.txid, pool_spend.vout)],
            action_params: "".to_string(),
            nonce,
            pool_utxo_receive: vec![format!("{}:0", txid.to_string())],
            pool_address: pool_address.to_string(),
        }],
    };
```

Please see the code ***[here](https://github.com/octopus-network/richswap-canister/tree/feature/donate/donate-cli)*** for details (this simple CLI tool donates 10,000 sats to a specified pool):

To run it:
```md
./target/debug/donate-cli \
  --pool-address tb1puzk3gn4z3rrjjnrhlgk5yvts8ejs0j2umazpcc4anq62wfk00e6ssw9p0n \
  --input-priv-key {your_private_key} \
  --rpc-url $BTC_RPC_URL \
  --network testnet
```

-----

** The functions [get_pool_list](https://docs.omnity.network/docs/Rich-Swap/apis#get_pool_list), [get_pool_info](https://docs.omnity.network/docs/Rich-Swap/apis#get_pool_info), and [get_minimal_tx_value](https://docs.omnity.network/docs/Rich-Swap/apis#get_minimal_tx_value) are required for REE in the standard query api. **

For more details, please refer to the [Exchange Interfaces](https://github.com/octopus-network/ree-types) documentation.

### get_pool_list
```md
type PoolBasic = record { name : text; address : text };

get_pool_list : () -> (vec PoolBasic) query;
```
Retrieved all the pool information in the exchange.

* Output: name - String (pool name)
* Output: address - String (pool address)

For those who need to fetch the pool address via the runes name, please refer to the code example here:

```code title="Typescript"
import { gql } from 'graphql-request'
import { request } from 'graphql-request'

const HOST =
  NETWORK === 'Mainnet'
    ? 'https://ree-hasura-mainnet.omnity.network/v1/graphql'
    : 'https://ree-hasura-testnet.omnity.network/v1/graphql'

export const fetchGraphFromRee = async (query: string, variables: any) => {
  try {
    const data = await request({
      url: HOST,
      document: query,
      variables,
    })
    return data as any
  } catch (error) {
    console.error(error)
    return null
  }
}

const poolDoc = gql`
        {
          pool_info(where: {name: {_eq: "HOPE•YOU•GET•RICH"}})
          {
            address
          }
        }
      `

const poolResult = await fetchGraphFromRee(poolDoc, {})
```



### get_pool_info
```md
type CoinBalance = record { id : text; value : nat };

type Utxo = record {
  coins : vec CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type PoolInfo = record {
  key : text;
  name : text;
  btc_reserved : nat64;
  key_derivation_path : vec blob;
  coin_reserved : vec CoinBalance;
  attributes : text;
  address : text;
  nonce : nat64;
  utxos : vec Utxo;
};

type GetPoolInfoArgs = record { pool_address : text };

get_pool_info : (GetPoolInfoArgs) -> (opt PoolInfo) query;
```
Get the META information of a certain pool.
* key : Retrieve all pool information within the exchange, where the key is the untweaked public key of a Pay-to-Taproot (P2TR) address, ensuring that the spending conditions of the pool's utxos can be verified.
* name: e.g.,:HOPE•YOU•GET•RICH
* btc_reserved : e.g.,:103845689
* key_derivation_path: e.g,: [ [ 0, 0, 0, 0, 0, 12, 209, 64, 0, 0, 3, 78 ] ]
* coin_reserved : e.g.,:id="840000:846"; value=54286490476
* attributes : e.g.,: "fee_rate":7000,"burn_rate":2000,"tweaked":"5ccc93f7bf8f43941c7511203d595bbf5a83c630ca9bbace10ff9a397c0dbaa4","incomes":472860,"sqrt_k":2355907027
* address e.g.,:bc1ptnxf8aal3apeg8r4zysr6k2mhadg833se2dm4nssl7drjlqdh2jqa4tk3p
* nonce : e.g.,:594
* utxos : e.g.,:vec {record {maybe_rune=opt record {id="840000:846"; value=54286490476}; sats=104318549; txid="62f607dedfb5b77b7f09cff901cc52f846306190377afc6f910d09e5b5f239a4"; vout=0}}}

### get_minimal_tx_value
```md
type GetMinimalTxValueArgs = record {
  zero_confirmed_tx_queue_length : nat32;
  pool_address : text;
};

get_minimal_tx_value : (GetMinimalTxValueArgs) -> (nat64) query;
```
Retrieve the minimum transaction value allowed by Rich Swap (Hardcoded as a temporary solution).

### get_lp
```md
type Liquidity = record {
  total_share : nat;
  user_share : nat;
  user_incomes : nat64;
};

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_4 = variant { Ok : Liquidity; Err : ExchangeError };

get_lp : (text, text) -> (Result_4) query;
```
Query the user's liquidity share ratio. It specifies the following parameters:
* pool_addr - String: e.g.,: 5c9eaaf2e8821d8810c625f5039ed69db13f3e6fb2ed4f3c9194e212bfc88428
* user_addr - String

And it returns:
* user_share : it represents the user's share. Although RichSwap does not use an LP token mechanism, this value is effectively equivalent to the amount of LP tokens
* sqrt_k :  btc_withdraw * rune_withdraw
* btc_supply 

## Update
### create
```md
type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  FundsLimitExceeded;
  UtxoMismatch;
  InvalidNumeric;
  Overflow;
  Paused;
  InvalidInput;
  PoolAddressNotFound;
  PriceImpactLimitExceeded;
  RuneIndexerError : text;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  FetchBitcoinCanisterError;
  LpNotFound;
  NoConfirmedUtxos;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_1 = variant { Ok : text; Err : ExchangeError };

create : (text) -> (Result_1);
```
Pool creation is limited to BTC paired exclusively with a RUNE.
* Input: rune_id - e.g.,:840000:846
* Output: Pubkey - e.g.,: 5c9eaaf2e8821d8810c625f5039ed69db13f3e6fb2ed4f3c9194e212bfc88428

Last updated on June 22, 2025