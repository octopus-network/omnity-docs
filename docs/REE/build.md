---
sidebar_position: 1
---

# APIs
[The Runes Exchange Environment (REE)](https://github.com/octopus-network/ree-orchestrator/tree/main) is a Turing-complete, bridgeless execution layer for BTCFi. The REE Orchestrator is responsible for managing the execution of exchange programs within REE. Please explore [How REE Works Under The Hood](https://www.youtube.com/watch?v=F4ExD4gY1E8) and review its [white paper](https://docs.google.com/document/d/1d1_51f8YYRhxft_RpGssCKqS95ZE5Ylv1LDleIqVZJE/edit?tab=t.0#heading=h.9hfttub7lmzc).

From the backend perspective, REE is composed of four key components:
* **REE Orchestrator**: Commonly referred to as REE, this core canister is responsible for managing the execution of exchange programs within the REE platform.
* **Runes Indexer**: A canister that indexes runes and provides information about new blocks.
* **Mempool Connector**: A daemon that updates the fee rate and monitors rejected transactions from REE on the Mempool, notifies the REE Orchestrator.
* **Exchanges**: Instances of the BTCFi protocol operating on the REE platform, designed to facilitate coin exchange. Each exchange must adhere to [the formal api principles](https://github.com/octopus-network/ree-types/tree/rivers/revise-exchange-interfaces?tab=readme-ov-file#exchange-interfaces) established by REE. Please refer to the [REE Dev Guide](https://docs.omnity.network/docs/REE/tutorial) for further details. There are multiple exchanges, and each exchange consists of several pools. REE manages the state of each exchange on a per-pool basis.

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
See the [instruction example](https://github.com/octopus-network/ree-types/blob/master/ree_instruction_samples/add_liquidity.json).

The core business function of the orchestrator. It processes exchange execution requests. Review [all the checks](https://github.com/octopus-network/ree-orchestrator/blob/main/ChecksForInvoke.md) that are performed when the invoke function is called. 

```md
* Checks for 'Invoke' in REE
The `invoke` function of the REE Orchestrator accepts the following parameters:
- **`psbt_hex`**: The PSBT data in hexadecimal format.
- **`intention_set`**: A set of the intentions that the user wants to apply in REE. It is defined as:
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
    pub intentions: Vec<Intention>,
}



* Checks before Execute Intentions
Checks for the Intention Set
- The input intention set is not empty.
- The input intention set is not too large (must be ≤ `settings.max_instructions_per_invoke`).
For each intention in the intention set:
- The `exchange_id` is valid (must be one of the registered exchanges).
- The exchange corresponding to the `exchange_id` is active (not halted). Refer to [Checks After Each Instruction Execution](#checks-after-each-intention-execution) for details on halted exchange checks.
- The `action` name is valid (following the rules for valid function names in Rust).
- The `input_coins` and `output_coins` are not all empty.
- The `input_coins` do not contain duplicate coin IDs.
- The `output_coins` do not contain duplicate coin IDs.
- The number of unconfirmed (zero-confirmation) transactions in the pool corresponding to `pool_address` must be ≤ `settings.max_unconfirmed_tx_count_in_pool`.
- The outpoints in `pool_utxo_spend` are all included in the inputs of the PSBT.
- The outpoints in `pool_utxo_receive` are all included in the outputs of the PSBT.



* Checks for PSBT
- The `psbt_hex` can be deserialized into a PSBT object defined in the Bitcoin crate.
- The PSBT object is valid:
  - The inputs and outputs of the unsigned transaction in the PSBT are not empty.
  - The number of inputs in the unsigned transaction matches the number of inputs in the PSBT.
  - The number of outputs in the unsigned transaction matches the number of outputs in the PSBT.
- There are no dust outputs (outputs with values less than `settings.min_btc_amount_for_utxo`) in the PSBT.
- There is at most one OP_RETURN output in the PSBT.
- At least one signed address exists in the PSBT.
- At least one input is signed by the `initiator_address`.
For each input in the PSBT:
- The outpoint (formatted as `<txid>:<vout>`) of the input is not used in any other transaction sent from the REE Orchestrator.
- The UTXO used in a input must be p2wpkh or p2tr.
- The signature for the input is valid if the input is signed.



*  Checks for Coin Balances
For each coin ID in the `input_coins` of the intention:
- The total amount of Rune in all inputs of the PSBT must not be less than the balance specified in the `input_coins` of the intention.
Combine the coin IDs in the inputs and outputs to get a set of coin IDs used in the current intention. For each coin ID in the set:
- The total amount of Rune in all inputs of the PSBT must equal the total amount of Rune in all outputs of the PSBT.
For each coin ID in the `output_coins` of the intention:
- If the coin ID is not `btc(0:0)`, the amount of Rune in a specific output of the PSBT must equal the balance specified in the `output_coins` of the intention.
- If the coin ID is `btc(0:0)`, the BTC amount in a specific output of the PSBT must not be less than the balance specified in the `output_coins` of the intention.
The total BTC amount in all inputs must exceed the total BTC amount in all outputs, with the difference being at least the `estimated transaction fee`.
The `estimated transaction fee` is calculated based on:
- The `estimated fee per vbyte`, which is the average fee per vbyte of all unconfirmed transactions in the pool. Fow now, it is the medium fee rate set by `mempool connector`.
- The `estimated transaction size`, derived from the serialized Bitcoin transaction extracted from the PSBT.




*  Checks After Each Intention Execution
- The returned `psbt_hex` can be deserialized into a PSBT object defined in the Bitcoin crate.
- The transaction ID (`txid`) remains unchanged after intention execution.
- If not all inputs of the PSBT were signed before execution, the signed addresses in the returned PSBT must be a superset of the signed addresses in the input PSBT.
If any errors occur during the checks, the corresponding exchange is marked as halted. A halted exchange cannot accept new intention until the issue is resolved.
If all checks pass, the REE Orchestrator accepts the returned PSBT as the new input for the next intention.
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