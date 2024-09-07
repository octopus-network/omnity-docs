---
sidebar_position: 1
---

# Overview

***Omnity API hosts a library of fundamental apis for app developers to plug and play into their codebases.***

See the **[codebase](https://github.com/octopus-network/omnity-interoperability)** for more details. It includes:

- [Hub](https://github.com/octopus-network/omnity-interoperability/tree/main/hub) A canister (smart contract) on [icp](https://internetcomputer.org/) for chain and token registration and ticket (transaction) execution, where settlement chains and execution chains are listed.
- [Bitcoin](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/bitcoin) A settlement chain canister which manage the logic on bitcoin network, is where the assets are listed and call the bitcoin canister to check any bitcoin address status.
- [sICP](https://github.com/octopus-network/omnity-interoperability/tree/main/customs/icp) A settlement chain canister which manage the logic on icp network.
- [EVM](https://github.com/octopus-network/omnity-interoperability/tree/main/route/evm) The evm route includes layer2 evm-compatible instances as execution chains.
- [eICP](https://github.com/octopus-network/omnity-interoperability/tree/main/route/icp) A execution chain canister which manage the logic on icp network.

## Use Cases
- If you were developing a defi project on one of the evm-compatible layer2 networks listed on Omnity by using a runes token as the project token, please go to **[Port Contract On EVM L2s](https://omnity-docs.vercel.app/docs/evm)** to utilise the runes feature in generate_ticket.
- If you were interesting in integrating with [Omnity cross-chain services](https://bridge.omnity.network/runes) or adding runes listed on [Omnity Runescan](https://www.runescan.net/runes) for your convenience, please go to **[Runes Indexer](https://omnity-docs.vercel.app/docs/runes)**.
- If you were interesting in what is used on [Omnity Explorer](https://explorer.omnity.network/) in your project, please go to **[Omnity Explorer](https://omnity-docs.vercel.app/docs/explorer)**.

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