---
sidebar_position: 1
---

# Overview

***Omnity API hosts a library of fundamental apis for app developers to plug and play into their codebases.***

See the **[codebase](https://github.com/octopus-network/omnity-interoperability)** for more details. 

This library consists of 4 sessions:

- [Hub](https://omnity-docs.vercel.app/docs/hub) A canister (smart contract) on [icp](https://internetcomputer.org/) for chain and token registration and ticket(transaction) execution, where settlement chains and execution chains are listed.
- [Bitcoin](https://omnity-docs.vercel.app/docs/bitcoin) A settlement chain canister which manage the logic on bitcoin network, is where the assets are listed and call the bitcoin canister to check any bitcoin address status.
- [sICP](https://omnity-docs.vercel.app/docs/eicp) A settlement chain canister which manage the logic on icp network.
- [EVM](https://omnity-docs.vercel.app/docs/evm) The evm route includes layer2 evm-compatible instances as execution chains.
- [eICP](https://omnity-docs.vercel.app/docs/eicp) A execution chain canister which manage the logic on icp network.

The APIs can be accessed using either Rust or TypeScript.
***Please refer the following basic code example to utilize all the apis in Rust on this document.***
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