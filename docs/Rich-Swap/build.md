---
sidebar_position: 1
---

# APIs
[RichSwap](https://github.com/octopus-network/richswap-canister) is the first AMM DEX exchange on [REE](https://docs.omnity.network/docs/REE/build).

For Rich Swap testnet4 please visit **[Rich Swap Testnet](https://richswap-testnet.vercel.app/swap)**.

For Rich Swap support please visit **[The Rich Swap Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/1529837122)** in both English and Chinese.

## Update
#### Workflow(e.g., Swap): 
The core business logic of Rich Swap is encapsulated within the following functions: pre_withdraw_liquidity, pre_add_liquidity, pre_swap, and create. To gain a clearer understanding of their functionality, please refer to the example workflow provided below:

**  1. Invoke pre_swap and Display SwapOffer:**

The client application call the [pre_swap](https://docs.omnity.network/docs/Rich-Swap/build#pre_swap) function based on user input. Once the SwapOffer is generated, it should be displayed on the frontend for the user to review and confirm. For every update request that modifies the pool's state, there is a corresponding pre_x method. In the case of a swap, the pre_swap method is invoked to retrieve the quotation and the pool's utxo as input.

** 2. Construct a PSBT Using the Wallet API:**

After the user confirms the SwapOffer, the frontend will use the wallet api to construct a psbt (Partially Signed Bitcoin Transaction) based on the provided input parameters and the [estimate_min_tx_fee](https://docs.omnity.network/docs/REE/build#estimate_min_tx_fee), following the verification of the address's utxos. Unlike BTC utxoss, which can be fetched with 0 confirmations through the Unisat api, Runes utxos must be retrieved using the [get_zero_confirmed_utxos_of_address](https://docs.omnity.network/docs/REE/build#get_zero_confirmed_utxos_of_address) method from REE. This step involves significant technical complexity. For a comprehensive guide on constructing a psbt, refer to this [example](https://github.com/unisat-wallet/wallet-utils/blob/master/src/tx-helpers/send-runes.ts).

** 3. Invoke REE's invoke Function:** 

Once the PSBT is constructed, it is passed along with the intention(see the [example](https://github.com/octopus-network/ree-types/blob/master/intention_set_samples/add_liquidity.json)) to call [REE's invoke function](https://docs.omnity.network/docs/REE/build#invoke). This function will subsequently trigger the **execution_tx** function of the Rich Swap exchange. The Rich Swap exchange will then perform [the necessary checks](https://github.com/octopus-network/richswap-canister?tab=readme-ov-file#how-it-works) to ensure the transaction is valid.

** 4. Broadcast the Transaction and Handle Results:**

When all transactions processed through the exchange are successful, REE will finalize and broadcast them, returning the result information indicating that the transaction was processed successfully. If the transaction fails, the Mempool Connector will notify REE, and an error will be returned instead.

### pre_withdraw_liquidity
```md
type CoinBalance = record { id : text; value : nat };

type WithdrawalOffer = record {
  nonce : nat64;
  input : Utxo;
  user_outputs : vec CoinBalance;
};

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  InvalidNumeric;
  Overflow;
  InvalidInput;
  PoolAddressNotFound;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  LpNotFound;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_5 = variant { Ok : WithdrawalOffer; Err : ExchangeError };

pre_withdraw_liquidity : (text, text, nat) -> (Result_5) query;
```
* Input: pool_key - Pubkey (pool id)
* Input: user_addr - String
* Input: share - u128

* WithdrawalOffer: for constructing the PSBT as part of the inputs

### pre_add_liquidity
```md
type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  InvalidNumeric;
  Overflow;
  InvalidInput;
  PoolAddressNotFound;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  LpNotFound;
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

type Result_2 = variant { Ok : LiquidityOffer; Err : ExchangeError };

pre_add_liquidity : (text, CoinBalance) -> (Result_2) query;
```
* Input: id - Pubkey (pool id)
* Input: side - CoinBalance (user's input)

* LiquidityOffer: for constructing the PSBT as part of the inputs

### pre_swap
```md
type CoinBalance = record { id : text; value : nat };

type Utxo = record {
  maybe_rune : opt CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type SwapOffer = record { output : CoinBalance; nonce : nat64; input : Utxo };

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  InvalidNumeric;
  Overflow;
  InvalidInput;
  PoolAddressNotFound;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  LpNotFound;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_4 = variant { Ok : SwapOffer; Err : ExchangeError };

pre_swap : (text, CoinBalance) -> (Result_4) query;
```
* Input: id - Pubkey (pool id)
* Input: input - CoinBalance (user's input)

* SwapOffer: for constructing the PSBT as part of the inputs

### create
```md
type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  InvalidNumeric;
  Overflow;
  InvalidInput;
  PoolAddressNotFound;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  LpNotFound;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result = variant { Ok : text; Err : ExchangeError };

create : (text) -> (Result);
```
Pool creation is limited to BTC paired exclusively with a RUNE.
* Input: rune_id - e.g.,:840000:846
* Output: Pubkey - e.g.,: 5c9eaaf2e8821d8810c625f5039ed69db13f3e6fb2ed4f3c9194e212bfc88428

## Query
The functions [get_pool_list](https://docs.omnity.network/docs/Rich-Swap/build#get_pool_list), [get_pool_info](https://docs.omnity.network/docs/Rich-Swap/build#get_pool_info), and [get_minimal_tx_value](https://docs.omnity.network/docs/Rich-Swap/build#get_minimal_tx_value) are required for REE in the standard query api. 

For more details, please refer to the [Exchange Interfaces](https://github.com/octopus-network/ree-types) documentation.

### get_pool_list
```md
type GetPoolListArgs = record { from : opt text; limit : nat32 };

type PoolOverview = record {
  key : text;
  name : text;
  btc_reserved : nat64;
  coin_reserved : vec CoinBalance;
  address : text;
  nonce : nat64;
};

get_pool_list : (GetPoolListArgs) -> (vec PoolInfo) query;
```
Fetch a list of pools with support for optional pagination.
See the returned result in detail from [get_pool_info](https://docs.omnity.network/docs/Rich-Swap/build#get_pool_info).

### get_pool_info
```md
type GetPoolInfoArgs = record { pool_address : text };

type PoolInfo = record {
  key : text;
  name : text;
  btc_reserved : nat64;
  coin_reserved : vec CoinBalance;
  attributes : text;
  address : text;
  nonce : nat64;
  utxos : vec Utxo;
};

get_pool_info : (GetPoolInfoArgs) -> (opt PoolInfo) query;
```
Get the META information of a certain pool.
* key : Retrieve all pool information within the exchange, where the key is the untweaked public key of a Pay-to-Taproot (P2TR) address, ensuring that the spending conditions of the pool's utxos can be verified.
* name: e.g.,:HOPE•YOU•GET•RICH
* btc_reserved : e.g.,:103845689
* coin_reserved : e.g.,:id="840000:846"; value=54286490476
* attributes : e.g.,: "fee_rate":7000,"burn_rate":2000,"tweaked":"5ccc93f7bf8f43941c7511203d595bbf5a83c630ca9bbace10ff9a397c0dbaa4","incomes":472860,"sqrt_k":2355907027
* address e.g.,:bc1ptnxf8aal3apeg8r4zysr6k2mhadg833se2dm4nssl7drjlqdh2jqa4tk3p
* nonce : e.g.,:594
* utxos : e.g.,:vec {record {maybe_rune=opt record {id="840000:846"; value=54286490476}; sats=104318549; txid="62f607dedfb5b77b7f09cff901cc52f846306190377afc6f910d09e5b5f239a4"; vout=0}}}

### get_minimal_tx_value
```md
get_minimal_tx_value : () -> (nat64) query;
```
Retrieve the minimum transaction value allowed by Rich Swap.

### get_lp
```md
type Liquidity = record { user_share : nat; sqrt_k : nat; btc_supply : nat64 };

type ExchangeError = variant {
  InvalidSignPsbtArgs : text;
  InvalidNumeric;
  Overflow;
  InvalidInput;
  PoolAddressNotFound;
  PoolStateExpired : nat64;
  TooSmallFunds;
  InvalidRuneId;
  InvalidPool;
  InvalidPsbt : text;
  PoolAlreadyExists;
  InvalidTxid;
  InvalidLiquidity;
  EmptyPool;
  LpNotFound;
  ChainKeyError;
  FetchRuneIndexerError;
  InvalidState : text;
  InsufficientFunds;
};

type Result_1 = variant { Ok : Liquidity; Err : ExchangeError };

get_lp : (text, text) -> (Result_1) query;
```
Query the user's liquidity share ratio. It specifies the following parameters:
* pool_key: e.g.,: 5c9eaaf2e8821d8810c625f5039ed69db13f3e6fb2ed4f3c9194e212bfc88428
* user_addr

And it returns:
* user_share : it represents the user's share. Although RichSwap does not use an LP token mechanism, this value is effectively equivalent to the amount of LP tokens
* sqrt_k :  btc_withdraw * rune_withdraw
* btc_supply 

Last updated on March 18, 2025