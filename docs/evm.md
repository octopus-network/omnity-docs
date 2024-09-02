---
sidebar_position: 3
---

# EVM
## Supported Chains:
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
***Usage***: This api is provided to generate an cross-chain transaction between the Bitcoin layer2 evm-compatible instances mentioned above and the Bitcoin network on Omnity. See the code example(burnToken) below.

***Workflow***: 

***1***. Call the corresponding Solidity function from the UI and get the calculated function_hash:

- [omnity-port-solidity](https://github.com/octopus-network/omnity-port-solidity/blob/main/contracts/OmnityPort.sol) is the solidity implementation of Omnity Port on EVM compatible blockchains, a contract module which provides a basic access control mechanism on the Rune tokens. It provides the following apis:

```jsx title="Solidity"
# To Burn Runes: 
burnToken(tokenId, amount)

# To Mint Runes: 
mintRunes(tokenId, receiver)

# To Transfer Runes:
transportToken(dstChainId, tokenId, receiver, amount, memo)

# To Redeem Runes:
redeemToken(tokenId, receiver, amount)
```


***2***. Put the function_hash as a parameter into generate_ticket from your dapp(Either in ***Rust*** or ***Typescript***):

- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/service.rs#L240) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

```jsx title="TypeScript"
# Interact With The Solidity Contract Using Typescript With viem, a TypeScript Interface For Ethereum.
import {createPublicClient, createWalletClient, custom, getContract, http} from "viem";
import { Actor, HttpAgent, ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

const agent = new HttpAgent({host: "https://icp0.io/"});
const actor = Actor.createActor<T>(IDL.InterfaceFactory, {canisterId, agent});

# Define Your OnBurnParams.
const { burnAddr, token, amount, targetChainId } = params;

const publicClient = createPublicClient({chain: EvmChain, transport: http()});
const walletClient = createWalletClient({chain: EvmChain, transport: custom(window.ethereum)});
const portContractAddr = EvmChain.contract_address;

# Call The burnToken Function From The Evm Port Contract.
const portContract = getContract({
    address: portContractAddr,
    abi: [{inputs: [{internalType: "string", name: "tokenId",type: "string"},{internalType: "uint256", name: "amount", type: "uint256"}], name: "burnToken", outputs: [], stateMutability: "payable", type: "function"}],
    client: {public: publicClient, wallet: walletClient}});

# Get The Target Chain Transaction Fee.
const [fee] = await actor.get_fee(targetChainId);

# The Calculated function_hash
const tx_hash = await portContract.write.burnToken(
      [token.token_id, amount],
      {account: burnAddr as EvmAddress,
        chain: EvmChain,
        value: fee},);

const result = await actor.generate_ticket(tx_hash);
```

```jsx title="Rust"
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

# The Evm_route_chain_id Is Refering a Smart Contract On Ic That Implement Your Logic For The Evm-compatible Chain. And Omnity Has Implemented The Listed Supported Chains.
let canister_id = Principal::from_text(EVM_ROUTE_CHAIN_ID.to_string())?;

# Interact With The Solidity Contract Using Rust With Web3 Client, The Rust Implementation Of Web3.js Library.
let burn_hash = SOLIDITY_onBurn_FUNCTION;

let result = agent
	.update(&canister_id, "generate_ticket")
	.with_arg(burn_hash)
	.call_and_wait()
	.await?;
}
```


***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.




## Query

