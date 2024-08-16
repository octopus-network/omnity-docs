---
sidebar_position: 2
---

# EVM
Supported Chains:
- [Bevm](https://www.bevm.io/) CHAIN_ID=rp433-4qaaa-aaaar-qaf2q-cai
- [Bitlayer](https://www.bitlayer.org/) CHAIN_ID=he2gn-7qaaa-aaaar-qagaq-cai
- [B² Network](https://www.bsquared.network/) CHAIN_ID=gsr6g-kaaaa-aaaar-qagfq-cai
- [X Layer](https://www.okx.com/xlayer) CHAIN_ID=gjucd-qyaaa-aaaar-qagha-cai
- [Merlin](https://merlinchain.io) CHAIN_ID=govex-5aaaa-aaaar-qaghq-cai
- [Bob](https://www.gobob.xyz/) CHAIN_ID=epmqo-ziaaa-aaaar-qagka-cai
- [Rootstock](https://rootstock.io/) CHAIN_ID=if3hq-3iaaa-aaaar-qahga-cai
- [Bitfinity](https://bitfinity.network/) CHAIN_ID=pw3ee-pyaaa-aaaar-qahva-cai


## Update
### generate_ticket(hash: String) -> Result<(), String> 
Rust:
```bash
use candid::{Decode, Encode};
use ic_agent::{
	agent::http_transport::ReqwestTransport, export::Principal, identity::Secp256k1Identity, Agent,
};
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

	let canister_id = Principal::from_text("CHAIN_ID".to_string())?;

    let args = GenerateTicketArgs {
				target_chain_id: "eICP".to_owned(),
				receiver: String::from("cosmos1fwaeqe84kaymymmqv0wyj75hzsdq4gfqm5xvvv"),
				rune_id: RUNE_ID.into(),
				amount: 1000,
				txid: txid.to_string(),
			};

	let ret = agent
		.update(&canister_id, "generate_ticket")
		.with_arg(args)
		.call_and_wait()
		.await?;

	Ok(())
}
```

## Query
### get_ticket
Rust:
```bash

```
### get_chain_list
Rust:
```bash

```
### get_token_list
Rust:
```bash

```
### mint_token_status
Rust:
```bash

```
### get_fee
Rust:
```bash

```
