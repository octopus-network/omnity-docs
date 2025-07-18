---
sidebar_position: 3
---

# Runes Indexer

**[Runes Indexer](https://github.com/octopus-network/runes-indexer)** is a canister deployed on the ic that continuously fetches bitcoin blocks from a bitcoin rpc endpoint using https outcalls. The blocks are verified using ic's bitcoin integration. Once verified, the indexer parses and indexes runes information within each block. See how it is used in [Omnity](https://github.com/octopus-network/omnity-interoperability/tree/main/proxy/runes_indexer_proxy).

[This guide](https://github.com/octopus-network/runes-indexer/blob/master/development-guide.md) assists developers in setting up their local development environment and running tests for Runes Indexer (in dfx 0.24.3, https outcalls can make requests to non-https endpoints).

|  | Canister Id |
| --- | --- |
| RUNES INDEXER | kzrva-ziaaa-aaaar-qamyq-cai |
| RUNES INDEXER TESTNET| f2dwm-caaaa-aaaao-qjxlq-cai |
| Etching Canister| t4zai-saaaa-aaaan-qzz7q-cai |
| Etching Canister test| e2rzq-6iaaa-aaaan-qz2ca-cai |

## Update
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

See the process in the example below(for more details about the parameters, please refer to the description [here](https://docs.omnity.network/docs/Omnity-Hub/runes#etching_v2)):
```md
1. Approve fee
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai  icrc2_approve '(record { amount = 1000000; spender = record{owner = principal "f2dwm-caaaa-aaaao-qjxlq-cai";} })' --ic
"ryjl3-tyaaa-aaaaa-aaaba-cai" is the ICP ledger, and "f2dwm-caaaa-aaaao-qjxlq-cai" is the testnet4 runes-indexer canister_id. You need to approve the runes-indexer to spend 0.001 ICP from your account. These are all fixed parameters.

2. Perform etching and actual fee deduction: note that the logo should be provided as a base64-encoded string
dfx canister call runes-indexer-testnet etching '(record {terms=opt record {cap=10000; height=record {null; null}; offset=record {null; null}; amount=100}; turbo=true; premine=opt 10000; logo=null; rune_name="MAKE•RICH•GREAT•AGAIN"; divisibility=opt 2; premine_receiver="tb1q837dfu2xmthlx6a6c59dvw6v4t0erg6c4mn4e2"; symbol=opt "$"})' --ic
```

## Query
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

Last updated on May 26, 2025