---
sidebar_position: 1
---

# APIs
[The Runes Exchange Environment (REE)](https://github.com/octopus-network/ree-orchestrator/tree/main) is a Turing-complete, bridgeless execution layer for BTCFi. The REE Orchestrator is responsible for managing the execution of exchange programs within REE. Please explore [How REE Works Under The Hood](https://www.youtube.com/watch?v=F4ExD4gY1E8) review its [white paper](https://docs.google.com/document/d/1d1_51f8YYRhxft_RpGssCKqS95ZE5Ylv1LDleIqVZJE/edit?tab=t.0#heading=h.9hfttub7lmzc).

From the backend perspective, REE is composed of four key components:
* **REE Orchestrator**: Commonly referred to as REE, this core canister is responsible for managing the execution of exchange programs within the REE platform.
* **Runes Indexer**: A canister that indexes runes and provides information about new blocks.
* **Mempool Connector**: A daemon that updates the fee rate and monitors rejected transactions from REE on the Mempool, notifies the REE Orchestrator.
* **Exchanges**: Instances of the BTCFi protocol operating on the REE platform, designed to facilitate coin exchange. Each exchange must adhere to [the formal api principles](https://github.com/octopus-network/ree-types/tree/rivers/revise-exchange-interfaces?tab=readme-ov-file#exchange-interfaces) established by REE. Please refer to the [REE Dev Guide](https://github.com/octopus-network/ree-orchestrator/tree/main) for further details. There are multiple exchanges, and each exchange consists of several pools. REE manages the state of each exchange on a per-pool basis.

For Ree support please visit **[The REE Dev Support Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/3944635384)** in English and **[The REE Dev Support CN Channel](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/2543618207)** in Chinese.


## Update
### invoke
```md
type CoinBalance = record { id : text; value : nat };

type InputCoin = record { coin : CoinBalance; from : text };

type OutputCoin = record { to : text; coin : CoinBalance };

type Intention = record {
  input_coins : vec InputCoin;
  output_coins : vec OutputCoin;
  action : text;
  exchange_id : text;
  pool_utxo_spend : vec text;
  action_params : text;
  nonce : nat64;
  pool_utxo_receive : vec text;
  pool_address : text;
};

type IntentionSet = record {
  initiator_address : text;
  intentions : vec Intention;
};

type InvokeArgs = record { intention_set : IntentionSet; psbt_hex : text };

type Result_3 = variant { Ok : text; Err : text };

invoke : (InvokeArgs) -> (Result_3);
```
The core business function of the orchestrator. It processes exchange execution requests. Review [all the checks](https://github.com/octopus-network/ree-orchestrator/blob/main/ChecksForInvoke.md) that are performed when the invoke function is called. 

See the [example](https://github.com/octopus-network/ree-types/blob/master/ree_instruction_samples/add_liquidity.json)

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
type TxOutputType = variant { P2WPKH; OpReturn : nat64; P2TR };

type EstimateMinTxFeeArgs = record {
  input_types : vec TxOutputType;
  pool_address : text;
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

Last updated on March 16, 2025