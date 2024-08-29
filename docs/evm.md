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
- [AILayer](https://ailayer.xyz/) CHAIN_ID=pk76v-yyaaa-aaaar-qahxa-cai


## Update
### generate_ticket(hash: String) -> Result<(), String> 
- **WORKFLOW:**
burn_hash(call the burnToken in Solidity) -> your dapp -> generate_ticket(burn_hash)

- Go [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status after.

Rust:
```bash
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

# EVM_ROUTE_CANISTER_ID is refering a smart contract on IC that implement your logic for the evm-compatible chain.
let canister_id = Principal::from_text(EVM_ROUTE_CANISTER_ID.to_string())?;

# Interact with the Solidity contract using Typescript with viem, a TypeScript Interface for Ethereum.
let burn_hash = FRONTEND_onBurn_FUNCTION;
let mint_hash = FRONTEND_onMint_FUNCTION;

let ret = agent
	.update(&canister_id, "generate_ticket")
	.with_arg(burn_hash)
	.call_and_wait()
	.await?;
}
```
Typescript:
```bash
import {createPublicClient, createWalletClient,custom, getContract,http} from "viem";

 async onBurn(params: OnBurnParams): Promise<string> {
 	# Define your OnBurnParams.
    const { burnAddr, token, amount, targetChainId } = params;

    const publicClient = createPublicClient({
      chain: EvmChain,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: EvmChain,
      transport: custom(window.ethereum),
    });

    const portContractAddr = EvmChain.contract_address;

    if (!portContractAddr) {
      throw new Error("Missing port contract address");
    }

    # call the burnToken function from the EVM port contract.
    const portContract = getContract({
      address: portContractAddr as EvmAddress,
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenId",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burnToken",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });

    const [fee] = await this.actor.get_fee(targetChainId);
    const tx_hash = await portContract.write.burnToken(
      [token.token_id, amount],
      {
        account: burnAddr as EvmAddress,
        chain: EvmChain,
        value: fee,
      },
    );
    return tx_hash;
  }

# call the mintRunes function from the EVM port contract.
  async onMint({
    token,
    targetAddr,
    sourceAddr,
    targetChainId,
  }: OnBridgeParams): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: EvmChain,
        transport: http(),
      });
      const walletClient = createWalletClient({
        chain: EvmChain,
        transport: custom(window.ethereum),
      });

      const portContractAddr = this.chain.contract_address;

      if (!portContractAddr) {
        throw new Error("Missing port contract address");
      }

      // call port contract
      const portContract = getContract({
        address: portContractAddr as EvmAddress,
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "tokenId",
                type: "string",
              },
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "mintRunes",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        client: {
          public: publicClient,
          wallet: walletClient,
        },
      });

      const [fee] = await this.actor.get_fee(targetChainId);

      const tx_hash = await portContract.write.mintRunes(
        [token.token_id, targetAddr as EvmAddress],
        {
          account: sourceAddr as EvmAddress,
          chain: EvmChain,
          value: fee,
        },
      );
      return tx_hash;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("User rejected the request")) {
          throw new Error("User rejected the transaction");
        }
      }
      throw error;
    }
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
