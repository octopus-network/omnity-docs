---
sidebar_position: 1
---

# Overview

***Omnity API hosts a library of fundamental apis for app developers to plug and play into their codebases.***

See the **[architecture](https://docs.google.com/document/d/1Nrt4oNj7r59TrOp3dbFR7eTtG5Eml6JWT5RCWwrJQIs/edit?pli=1)** / **[codebase](https://github.com/octopus-network/omnity-interoperability)** for more details. It includes:

- **[Hub](https://github.com/octopus-network/omnity-interoperability/tree/main/hub)** A canister (smart contract) on [icp](https://internetcomputer.org/) that handles chain and token registration and ticket (transaction) execution, and it also lists settlement chains and execution chains.
- **[Bitcoin Runes](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/bitcoin_runes)** A settlement chain canister that manages the logic on the bitcoin network, it is where runes assets are listed and it calls the bitcoin canister to check the status of any bitcoin address.
- **[Bitcoin Brc20](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/bitcoin_brc20)** A settlement chain canister that manages the logic on the bitcoin network, it is where brc20 assets are listed and it calls the bitcoin canister to check the status of any bitcoin address.
- **[sICP](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/icp)** A settlement chain canister that manages on icp network.
- **[eICP](https://github.com/octopus-network/omnity-interoperability/tree/main/route/icp)** A execution chain canister that manages the logic on icp network.
- **[EVM](https://github.com/octopus-network/omnity-interoperability/tree/main/route/evm)** The evm route includes layer 2 evm-compatible instances and ethereum as execution chains.
- **[Cosmwasm](https://github.com/octopus-network/cosmwasm-route)** CosmWasm Route is the component of the system that interfaces with the execution chains supporting CosmWasm.
- **[Solana](https://github.com/octopus-network/omnity-interoperability)** A execution chain canister that manages the logic on solana network.
- **[Ton](https://github.com/octopus-network/omnity-interoperability)** A execution chain canister that manages the logic on ton network.

## Use Cases

- For those interested in bridging brc20 tokens, please go to **[BRC20](https://docs.omnity.network/docs/brc20)**.
- For those interested in bridging icp icrc tokens, please go to **[ICP ICRC](https://docs.omnity.network/docs/icp_icrc)**.
- If you are interested in what is used on [Omnity Explorer](https://explorer.omnity.network/), please go to **[Omnity Explorer](https://docs.omnity.network/docs/explorer)**.
- If you are interested in using our [on-chain oracle](https://github.com/octopus-network/ord-canister), a canister for indexing runes utxos on bitcoin, please go to **[Runes Indexer](https://docs.omnity.network/docs/runes_indexer)**.
- For those interested in locking bitcoin natively on layer 1 and mint the wrapped bitcoin on the target chains, please go to **[CosmWasm](https://docs.omnity.network/docs/cosmwasm)** | **[Ton](https://docs.omnity.network/docs/ton)**.
- If you are interested in integrating with [Omnity's cross-chain services](https://bridge.omnity.network/runes) or adding runes listed on [Omnity Runescan](https://www.runescan.net/runes) for your convenience, please go to **[Runes On ICP](https://docs.omnity.network/docs/runes)** | **[Solana](https://docs.omnity.network/docs/solana)**.
- If you are developing a defi project on one of the evm-compatible layer 2 networks listed on Omnity or on ethereum, and using a runes token as the project token, please go to **[Port Contract On EVM](https://docs.omnity.network/docs/evm)** to utilize the runes feature in generate_ticket.


## Code Examples
The APIs can be accessed using ***Rust | TypeScript***.

Please refer the following basic code examples to utilize all the apis in ***Rust***.
```code title="Rust (call via canister)"
use candid::Principal;
use ic_cdk::update;

#[update]
pub async fn cross_chain_function() -> Result<(), ErrorType> {
    let cycles = 1_000_000_000;

    let bitcoin_canister_id = Principal::from_text(BTC_CANISTER_ID.to_string()).unwrap();

    let ret: (Result<(), ErrorType>,) = ic_cdk::api::call::call_with_payment128(
        bitcoin_canister_id,
        "API_METHOD",
        (args,),
        cycles,
    )
    .await
    .map_err(|err| ErrorType)?;
    ret.0
}
```

```code title="Rust (call via http)"
use candid::{Decode, Encode};
use ic_agent::{agent::http_transport::ReqwestTransport, export::Principal, identity::Secp256k1Identity, Agent};
use std::error::Error;
use candid::CandidType;
use thiserror::Error;
use serde::Deserialize;

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn Error>> {
	let network = "https://ic0.app".to_string();

	let agent_identity = Secp256k1Identity::from_pem(
		"-----BEGIN EC PRIVATE KEY-----
		YOURPRIVATEKEY
		-----END EC PRIVATE KEY-----".as_bytes(),
	)?;

	let agent = Agent::builder()
		.with_transport(ReqwestTransport::create(network).unwrap())
		.with_identity(agent_identity)
		.build()
		.map_err(|e| format!("{:?}", e))?;

	let canister_id = Principal::from_text(DAPP_CANISTER_ID.to_string())?;

	let arg: Vec<u8> = Encode!(&api_input)?;
	let ret = agent
		.query(&canister_id, "API_METHOD")
		.with_arg(arg)
		.call()
		.await?;

	let result = Decode!(&ret, API_RETURN)??;
	Ok(())
}
```

Please refer the following basic code examples to utilize all the apis in ***Typescript***.
```code title="omnityHub.ts"
import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import {
  idlFactory as OmnityHubInterfaceFactory,
  _SERVICE as OmnityHubService,
} from "./OmnityHub.did";

export const OMNITY_HUB_CANISTER_ID = "7wupf-wiaaa-aaaar-qaeya-cai";

const createActor = <T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
  ) => {
    const agent = new HttpAgent({
      host: "https://icp0.io/",
    });
    return Actor.createActor<T>(interfaceFactory, {
      canisterId,
      agent,
    });
  };

export const OmnityHub = createActor<OmnityHubService>(
    OMNITY_HUB_CANISTER_ID,
    OmnityHubInterfaceFactory,
);
```

```code title="App.tsx"
import { useEffect, useState } from "react";
import { OmnityHub } from "./omnitHub";

function App() {
  const [totalTx, setTotalTx] = useState<number>();

  useEffect(() => {
    function getOmnityAnalysis() {
      OmnityHub.get_total_tx().then((res:any) => {
        if ("Ok" in res) {
          const total = Number(res.Ok.toString());
          setTotalTx((prev) => {
            if (Number.isInteger(prev) && prev !== total) {
              // new tx
            }
            return total;
          });
        }
      });
    }
    const tick = setInterval(getOmnityAnalysis, 5000);
    return () => {
      clearInterval(tick);
    };
  }, []);

  return (
     <div >Total Txs : {totalTx}</div>
  );
}

export default App;
```

Can't find what you need? let us know on **[OpenChat](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/209373796018851818071085429101874032721/)**.