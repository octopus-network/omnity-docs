---
sidebar_position: 3
---

# HUB

OMNITY_HUB_CANISTER_ID=7wupf-wiaaa-aaaar-qaeya-cai

## Query

### get_total_tx() -> Result<u64, OmnityError>
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

	let canister_id = Principal::from_text("7wupf-wiaaa-aaaar-qaeya-cai".to_string())?;

	let arg: Vec<u8> = Encode!(&Vec::<u8>::new())?;
	let ret = agent
		.query(&canister_id, "get_total_tx")
		.with_arg(arg)
		.call()
		.await?;

	let token_size = Decode!(&ret, Result<u64, OmnityError>)??;
	println!("{:?}", token_size);

	Ok(())
}


#[derive(CandidType, Deserialize, Debug, Error)]
pub enum OmnityError {
	#[error("The chain(`{0}`) already exists")]
	ChainAlreadyExisting(String),
	#[error("The token(`{0}`) already exists")]
	TokenAlreadyExisting(String),
	#[error("not supported proposal")]
	NotSupportedProposal,
	#[error("proposal error: (`{0}`)")]
	ProposalError(String),
	#[error("generate directive error for : (`{0}`)")]
	GenerateDirectiveError(String),
	#[error("the message is malformed and cannot be decoded error")]
	MalformedMessageBytes,
	#[error("unauthorized")]
	Unauthorized,
	#[error("The `{0}` is deactive")]
	DeactiveChain(String),
	#[error("The ticket id (`{0}`) already exists!")]
	AlreadyExistingTicketId(String),
	#[error("The resubmit ticket id must exist!")]
	ResubmitTicketIdMustExist,
	#[error("The resubmit ticket must same as the old ticket!")]
	ResubmitTicketMustSame,
	#[error("The resumit ticket sent too often")]
	ResubmitTicketSentTooOften,
	#[error("not found chain: (`{0}`)")]
	NotFoundChain(String),
	#[error("not found token: (`{0}`)")]
	NotFoundToken(String),
	#[error("not found account(`{0}`) token(`{1}`) on the chain(`{2}`")]
	NotFoundAccountToken(String, String, String),
	#[error("Not found this token(`{0}`) on chain(`{1}`) ")]
	NotFoundChainToken(String, String),
	#[error("Insufficient token (`{0}`) on chain (`{1}`) !)")]
	NotSufficientTokens(String, String),
	#[error("The ticket amount(`{0}`) parse error: `{1}`")]
	TicketAmountParseError(String, String),
	#[error("ecdsa_public_key failed : (`{0}`)")]
	EcdsaPublicKeyError(String),
	#[error("sign_with_ecdsa failed: (`{0}`)")]
	SighWithEcdsaError(String),
	#[error("custom error: (`{0}`)")]
	CustomError(String),
}
```

## Update
### add_runes_token
Rust:
```bash
dfx canister call omnity_hub get_pending_tickets '(0:nat64,5:nat64)'
```
