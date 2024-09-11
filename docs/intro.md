---
sidebar_position: 1
---

# Overview

***Omnity API hosts a library of fundamental apis for app developers to plug and play into their codebases.***

See the **[codebase](https://github.com/octopus-network/omnity-interoperability)** for more details. It includes:

- [Hub](https://github.com/octopus-network/omnity-interoperability/tree/main/hub) A canister (smart contract) on [icp](https://internetcomputer.org/) that handles chain and token registration and ticket (transaction) execution, and it also lists settlement chains and execution chains.
- [Bitcoin](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/bitcoin) A settlement chain canister that manages the logic on the bitcoin network, It is where assets are listed and it calls the bitcoin canister to check the status of any bitcoin address.
- [sICP](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/icp) A settlement chain canister which that manages on icp network.
- [eICP](https://github.com/octopus-network/omnity-interoperability/tree/main/route/icp) A execution chain canister that manages the logic on icp network.
- [EVM](https://github.com/octopus-network/omnity-interoperability/tree/main/route/evm) The evm route includes layer 2 evm-compatible instances as execution chains.

## Use Cases
- If you are developing a defi project on one of the evm-compatible layer 2 networks listed on Omnity, and using a runes token as the project token, please go to **[Port Contract On EVM L2s](https://omnity-docs.vercel.app/docs/evm)** to utilize the runes feature in generate_ticket.
- If you are interested in using our [on-chain oracle](https://github.com/octopus-network/ord-canister), a canister for indexing runes utxos on bitcoin, please go to **[Runes Indexer](https://omnity-docs.vercel.app/docs/runes_indexer)**.
- If you are interested in what is used on [Omnity Explorer](https://explorer.omnity.network/), please go to **[Omnity Explorer](https://omnity-docs.vercel.app/docs/explorer)**.
- If you are interested in integrating with [Omnity's cross-chain services](https://bridge.omnity.network/runes) or adding runes listed on [Omnity Runescan](https://www.runescan.net/runes) for your convenience, please go to **[Runes On ICP](https://omnity-docs.vercel.app/docs/runes)**.

## Code Example
The APIs can be accessed using either Rust or TypeScript.
***Please refer the following basic code example to utilize all the apis in Rust.***
```code title="Rust"
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

Can't find what you need? let us know on **[OpenChat](https://oc.app/community/o5uz6-dqaaa-aaaar-bhnia-cai/channel/209373796018851818071085429101874032721/)**.