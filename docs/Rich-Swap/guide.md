---
sidebar_position: 2
---

# Integration Guide

To interact with RichSwap, [clients](https://docs.omnity.network/docs/REE/core-concepts#exchange-client) must have the capability to access ICP canisters and sign BTC PSBTs.

The [RichSwap canister](https://dashboard.internetcomputer.org/canister/kmwen-yaaaa-aaaar-qam3a-cai#interface) generates different language code to access RichSwap. You could also refer to the [RichSwap API docs](https://docs.omnity.network/docs/Rich-Swap/apis) for more details.

As an REE exchange, the client of RichSwap should follow the "inquiry/invoke" pattern to interact with RichSwap. All inquiry functions in RichSwap are start with "pre_". For example, to complete a swap transaction, the client must first invoke RichSwap's pre-swap interface to obtain a quote.

First, let's query the pools from RichSwap:
``` bash
# fetch the pool list
dfx canister call kmwen-yaaaa-aaaar-qam3a-cai --ic get_pool_list '(record {from=null;limit=100;},)'

```

Now we got the pool list. Let's try to swap 10000 sats to HOPE•YOU•GET•RICH. 
``` bash
# obtain a quote from pool HOPE•YOU•GET•RICH
dfx canister call kmwen-yaaaa-aaaar-qam3a-cai --ic pre_swap '("bc1ptnxf8aal3apeg8r4zysr6k2mhadg833se2dm4nssl7drjlqdh2jqa4tk3p", record {id="0:0"; value=10000;})'
```
In REE, `CoinId` represents a rune token. Specially, BTC is "0:0".

The canister replies:

``` bash
(
  variant {
    Ok = record {
      output = record { id = "840000:846"; value = 3_834_248 : nat };
      nonce = 1_147 : nat64;
      price_impact = 1 : nat32;
      input = record {
        coins = vec {
          record { id = "840000:846"; value = 64_183_732_378 : nat };
        };
        sats = 167_414_165 : nat64;
        txid = "115fd37d0622775daf2783228d2997e38c756bc1d99714d62e2f5c96e9714e42";
        vout = 1 : nat32;
      };
    }
  },
)
```
You could find the response definition on RichSwap dashboard mentioned above. Let's break it down here.

- The `output` is the offer that the pool provides. In the case, the pool tells us that we will get 3834248 "840000:846" which represents HOPE•YOU•GET•RICH.
- The `nonce` will be used later to submit `invoke`.
- The `input` is the UTXO of pool.

Now we have collected enough information, if we agree this offer, we could construct a PSBT and sign it.

The client could select arbitrary UTXOs within its wallet; naturally, we will also include change for ourselves in the output.

Assume we got 1 UTXO > 10000 sats(since the client must pay for the network fee), we could construct such a PSBT:

```bash
input #0: 115fd37d0622775daf2783228d2997e38c756bc1d99714d62e2f5c96e9714e42:1 (pool, unsigned) 167414167 sats
input #1: 9c1f8398f5a92eee44aee58d000a4dc1705f9c25e29683f7730215bc1274cff1:0 (client, signed) 20000 sats
--------------
output #0: (167414165 + 10000) sats to pool's pubbkey
output #1: OP_RETURN: allocate (64183732378 - 3834248) RUNE(840000:846) to output #0; allocate 3834248 RUNE(840000:846) to #output 2
output #2: (20000 - 10000 - network_fee) sats to client's pubkey
```

After we signed this PSBT, we should serialize it and submit to REE. Since the actuall PSBT might be more complicated than this one, REE requires some extra information to validate the whole transaction. Below is the full parameter of REE `invoke` function:

``` rust
type Intention = record {
  input_coins : vec InputCoin;
  output_coins : vec OutputCoin;
  action : text;
  exchange_id : text;
  action_params : text;
  nonce : nat64;
  pool_address : text;
  pool_utxo_spent : vec text;
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
```
The definition seems a little bit complicated, but we only need to fill part of it.

- The `input_coins` is the what we passed in the first step, i.e. "0:0" + 10000 sats.
- The `output_coins` is the result of the second step, i.e. how much rune we can get.
- The `exchange_id` is "RICH_SWAP".
- The `action` is decided by the RichSwap since REE is a general protocol for extending BTC's capacity. Different functions have different action. In this scenario, it is "swap".
- The `action_params` is defined by REE for relaying some extra informations between exchange client and exchagne. In this case, you could leave empty, or if you are integrating RichSwap with your service, you could set it `"channel=YOUR_ORG_NAME"` to share the protocol revenue from Omnity Team.
- The `nonce` should be value just returned from RichSwap pool. In this case, it is 1147.
- The `pool_address` is "bc1ptnxf8aal3apeg8r4zysr6k2mhadg833se2dm4nssl7drjlqdh2jqa4tk3p" in this case.
- The `pool_utxo_spent` and `pool_utxo_received` are both empty since REE will infer them from PSBT.
- The `initiator_address` is the caller address. In this case, it is the owner of input #1.

Note that REE supports multiple transaction, so there is a `intention_set` rather than a single `intention` field. 

Now we could submit the tx to REE and it will automatically broadcast it to BTC network.

``` bash
dfx canister call kqs64-paaaa-aaaar-qamza-cai --ic invoke '...'
```


Last updated on June 27, 2025
