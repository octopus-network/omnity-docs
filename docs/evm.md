---
sidebar_position: 3
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
let burn_hash = EVM_ROUTE_PORT_CONTRACT_burnToken_FUNCTION;
let mint_hash = EVM_ROUTE_PORT_CONTRACT_mintRunes_FUNCTION;

let ret = agent
	.update(&canister_id, "generate_ticket")
	.with_arg(burn_hash)
	.call_and_wait()
	.await?;
}
```

## Query
### get_ticket(ticket_id: String) -> Option<(u64, Ticket)>
Rust:
```bash
let arg: Vec<u8> = Encode!(&"TICKETID".to_string)?;
let ret = agent
	.query(&canister_id, "get_ticket")
	.with_arg(arg)
	.call()
	.await?;

let evm_ticket = Decode!(&ret, Result<u64, OmnityTicket>)??;

#[derive(
	CandidType, Deserialize, Serialize, Default, Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
pub struct OmnityTicket {
	pub ticket_id: TicketId,
	pub ticket_type: TicketType,
	pub ticket_time: Timestamp,
	pub src_chain: ChainId,
	pub dst_chain: ChainId,
	pub action: TxAction,
	pub token: TokenId,
	pub amount: String,
	pub sender: Option<Account>,
	pub receiver: Account,
	pub memo: Option<Vec<u8>>,
}
```
