---
sidebar_position: 6
---

# APIs
[The Runes Exchange Environment (REE)](https://github.com/octopus-network/ree-orchestrator/tree/main) is a Turing-complete, bridgeless execution layer for BTCFi. The REE Orchestrator is responsible for managing the execution of exchange programs within REE. Please explore [How REE Works Under The Hood](https://www.youtube.com/watch?v=F4ExD4gY1E8) and review its [white paper](https://docs.google.com/document/d/1d1_51f8YYRhxft_RpGssCKqS95ZE5Ylv1LDleIqVZJE/edit?tab=t.0#heading=h.9hfttub7lmzc).

From the backend perspective, REE is composed of four key components:
* **REE Orchestrator**: Commonly referred to as REE, this core canister is responsible for managing the execution of exchange programs within the REE platform.
* **Runes Indexer**: A canister that indexes runes and provides information about new blocks.
* **Mempool Connector**: A daemon that updates the fee rate and monitors rejected transactions from REE on the Mempool, notifies the REE Orchestrator.
* **Exchanges**: Instances of the BTCFi protocol operating on the REE platform, designed to facilitate coin exchange. Each exchange must adhere to [the formal api principles](https://github.com/octopus-network/ree-types?tab=readme-ov-file#exchange-interfaces) established by REE. Please refer to the [REE Dev Guide](https://docs.omnity.network/docs/REE/introduction) for further details. There are multiple exchanges, and each exchange consists of several pools. REE manages the state of each exchange on a per-pool basis.

For Ree support please visit **[The REE Dev Support Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/3944635384)** in English and **[The REE Dev Support CN Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/2543618207)** in Chinese.

|  | Canister Id |
| --- | --- |
| Orchestrator | kqs64-paaaa-aaaar-qamza-cai |
| Orchestrator Testnet | hvyp5-5yaaa-aaaao-qjxha-cai |

## Update
### invoke
```md
type CoinBalance = record { id : text; value : nat };

type InputCoin = record { coin : CoinBalance; from : text };

type OutputCoin = record { to : text; coin : CoinBalance };

type Utxo = record {
  coins : vec CoinBalance;
  sats : nat64;
  txid : text;
  vout : nat32;
};

type Intention = record {
  input_coins : vec InputCoin;
  output_coins : vec OutputCoin;
  action : text;
  exchange_id : text;
  pool_utxo_spent : vec text;
  action_params : text;
  nonce : nat64;
  pool_address : text;
  pool_utxo_received : vec Utxo;
};

type IntentionSet = record {
  tx_fee_in_sats : nat64;
  initiator_address : text;
  intentions : vec Intention;
};

type InvokeArgs = record {
  intention_set : IntentionSet;
  initiator_utxo_proof : blob;
  psbt_hex : text;
};


type Result_3 = variant { Ok : text; Err : text };

invoke : (InvokeArgs) -> (Result_3);
```
See the [instruction examples](https://github.com/octopus-network/ree-types/tree/master/intention_set_samples).

The core business function of the orchestrator. It processes exchange execution requests. Review [all the checks](https://github.com/octopus-network/ree-orchestrator/blob/main/ChecksForInvoke.md) that are performed when the invoke function is called. 

```md
# Checks for 'Invoke' in REE

This document summarizes the checks performed by the REE orchestrator when a client performs an `invoke`.

The `invoke` function of the REE Orchestrator accepts the following parameters:

- **`psbt_hex`**: The PSBT data in hexadecimal format.
- **`intention_set`**: The client's transaction intentions to apply in REE. It is defined as:

```rust
pub struct InputCoin {
    // The address of the owner of the coins
    pub from: String,
    pub coin: CoinBalance,
}

pub struct OutputCoin {
    // The address of the receiver of the coins
    pub to: String,
    pub coin: CoinBalance,
}

pub struct Intention {
    pub exchange_id: String,
    pub action: String,
    pub pool_address: String,
    pub nonce: u64,
    pub pool_utxo_spend: Vec<String>,
    pub pool_utxo_receive: Vec<String>,
    pub input_coins: Vec<InputCoin>,
    pub output_coins: Vec<OutputCoin>,
}

pub struct IntentionSet {
    pub initiator_address: String,
    pub tx_fee_in_sats: u64,
    pub intentions: Vec<Intention>,
}


**In general, the REE Orchestrator will ensure that the intention set EXACTLY matches the PSBT.**

Checks for the PSBT

The REE Orchestrator will check the following facts for the input PSBT:

- The input PSBT is a valid PSBT object.
- At least one signed input belongs to the `initiator_address` in the intention set.
- The tx fee of the final Bitcoin transaction is exactly equal to the `tx_fee_in_sats` in the intention set.
- The UTXOs used as inputs in the PSBT can only be P2SH, P2WPKH, or P2TR.
- All UTXOs used as inputs in the PSBT are all valid: **(In Development)**
  - They have at least one confirmation.
  - They are not spent in any other confirmed transaction or any other unconfirmed transaction sent from the REE Orchestrator.
- For rune asset, a correctly formatted `OP_RETURN` output must be included in the PSBT. (The receivers of runes must be specified explicitly.) An empty `OP_RETURN` output or missing `OP_RETURN` output is not allowed.
- The final Bitcoin transaction extracted from the PSBT, after all intentions are executed in corresponding exchanges, is a valid transaction. Including:
  - All inputs are signed correctly, and the final witness script is valid.
  - `total amount of BTC in all inputs` = `total amount of BTC in all outputs` + `tx_fee_in_sats`.
  - For each rune asset in the transaction: `total amount of rune in all inputs` = `total amount of rune in all outputs`.

Checks for the Intention Set

The REE Orchestrator will check the following facts for the intention set:

- The `exchange_id` of each intention is valid (must be one of the registered exchanges).
- The `action` of each intention is valid:
  - The length of the action name must be `> 1` and `<= 64`.
  - The action name must be a valid function name in Rust. (It matches the regex `^[a-zA-Z_][a-zA-Z0-9_]*$`).
- The `utxo_spend` of each intention is valid:
  - If it is specified, it must be a valid outpoint (formatted as `<txid>:<vout>`) used in the PSBT.
- The `utxo_receive` of each intention is valid:
  - If it is specified, it must be a valid outpoint (formatted as `<txid>:<vout>`) of the `unsigned_tx` in the PSBT.
- The `from` address of each `input_coin` must NOT be the `pool_address` of the intention.
- The `to` address of each `output_coin` must exist in the outputs of the PSBT.
- The total amount of all assets of non-pool addresses corresponding to this invoke is correctly set in PSBT:
  - For BTC asset: `the total amount of BTC in all inputs of the PSBT from addresses other than the pool addresses` - `the total amount of BTC in all input_coins` - `tx_fee_in_sats` + `the total amount of BTC in all output_coins` == `the total amount of BTC in all outputs of the PSBT to addresses other than the pool addresses.
  - For rune asset: `the total amount of the given rune in all inputs of the PSBT from addresses other than the pool addresses` - `the total amount of the given rune in all input_coins` + `the total amount of the given rune in all output_coins` == `the total amount of the given rune in all outputs of the PSBT to addresses other than the pool addresses.

 Checks for the Intention Execution

Before executing each intention in the corresponding exchange, the REE Orchestrator will check the following facts:

- If the `input_coins` of the current intention is not empty, for each `input_coin`, the total amount of the given asset in all inputs of the PSBT must not be less than the balance specified in the corresponding `input_coin`, and they are all signed correctly. (The asset can come from the addresses other than the `pool_address` of the current intention.)

After executing each intention in the corresponding exchange, the REE Orchestrator will check the following facts:

- The transaction ID of the final transaction extracted from the returned PSBT must NOT be changed.
```


## Query
### get_zero_confirmed_utxos_of_address
```md
type CoinBalance = record { id : text; value : nat };

type OutpointWithValue = record {
  maybe_rune : opt CoinBalance;
  value : nat64;
  script_pubkey_hex : text;
  outpoint : text;
};

get_zero_confirmed_utxos_of_address : (text) -> (vec OutpointWithValue) query;
```
Retrieve UTXOs with zero confirmed runes for a specific address. The following address input formats are supported:

* Pay to witness public key hash (P2WPKH)

* Pay to taproot (P2TR)

If the address is malformed, the call is rejected.
This endpoint returns the Outpoint of the address. It specifies the following parameters:
* maybe_rune: e.g.,:840000:846
* value
* script_pubkey_hex: e.g.,:00142442018f491970523d89837488eabba965f2c785
* outpoint: txid:vout - e.g.,:9870d98efd36f4bed923205b52c06e9d4d0b1613031984872ade966f2646eba2:0

### estimate_min_tx_fee
```md
type TxOutputType = variant { P2WPKH; OpReturn : nat64; P2SH; P2TR };

type EstimateMinTxFeeArgs = record {
  input_types : vec TxOutputType;
  pool_address : vec text;
  output_types : vec TxOutputType;
};

type Result_1 = variant { Ok : nat64; Err : text };

estimate_min_tx_fee : (EstimateMinTxFeeArgs) -> (Result_1) query;
```
It specifies the following parameters:
* input_types : e.g.,:vec![TxOutputType::P2WPKH, TxOutputType::P2TR],
* pool_address : e.g.,:bc1ptnxf8aal3apeg8r4zysr6k2mhadg833se2dm4nssl7drjlqdh2jqa4tk3p
* output_types : e.g.,:vec![
            TxOutputType::P2TR,
            TxOutputType::P2WPKH,
            TxOutputType::P2WPKH,
            TxOutputType::OpReturn(14),
        ]

Last updated on June 20, 2025
