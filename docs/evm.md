---
sidebar_position: 2
---

# Port Contract On EVM
## Supported Chains:
| Chain | Canister Id | Contract | Chain Id |
| --- | --- | --- | --- |
| [Bevm](https://www.bevm.io/) | rp433-4qaaa-aaaar-qaf2q-cai | 0xDA290C4D658c767fA06c27bc2AcaD59bDFCCff4A | bevm|
| [Bitlayer](https://www.bitlayer.org/) | he2gn-7qaaa-aaaar-qagaq-cai | 0x2AFDA75BFfE47dDE22254937ef1E81E1C32B90d9 | Bitlayer|
| [B² Network](https://www.bsquared.network/) | gsr6g-kaaaa-aaaar-qagfq-cai | 0xF3D7bc94095454D5F8538a808941729c9B3D3B7A | B² Network|
| [X Layer](https://www.okx.com/xlayer) | gjucd-qyaaa-aaaar-qagha-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | X Layer|
| [Merlin](https://merlinchain.io) | govex-5aaaa-aaaar-qaghq-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | Merlin|
| [Bob](https://www.gobob.xyz/) | epmqo-ziaaa-aaaar-qagka-cai | 0x21cf922c8bf60d1d11ADC8aDCFdd4BdAae9e8320 | Bob|
| [Rootstock](https://rootstock.io/) | if3hq-3iaaa-aaaar-qahga-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | RootStock|
| [Bitfinity](https://bitfinity.network/) | pw3ee-pyaaa-aaaar-qahva-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | Bitfinity|
| [AILayer](https://ailayer.xyz/) | pk76v-yyaaa-aaaar-qahxa-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | AILayer|
| [Ethereum](https://ethereum.org/en/) | 3zfof-myaaa-aaaar-qaioa-cai | 0xDA290C4D658c767fA06c27bc2AcaD59bDFCCff4A | Ethereum |

## Update
### generate_ticket
```md title="generate_ticket(hash: String) -> Result<(), String>"
Generate an cross-chain transaction from the layer 2 evm-compatible instances and ethereum. 
```
#### Workflow: 

***1***. Call the corresponding Solidity function(E.g. burnToken) from the UI and get the calculated function_hash:
- **[omnity-port-solidity](https://github.com/octopus-network/omnity-port-solidity/blob/main/contracts/OmnityPort.sol)** is the solidity implementation of Omnity Port on evm-compatible blockchains, a contract module which provides a basic access control mechanism on the runes tokens. It provides the following apis:

To destroy a amount of tokenId runes tokens from the caller:
```jsx title="Solidity"
burnToken(string memory tokenId, uint256 amount)
```

Creates an event involving a certain amount (depending on the type of runes) of tokenId and assigns it to the receiver. 
The cross-chain application will read the event and perform the mint action on the bitcoin network. 
```jsx title="Solidity"
mintRunes(string memory tokenId, address receiver)
```

Creates an event to transfer a specified amount of tokenId runes tokens from the caller’s account to the receiver's account on dstChainId, with an optional memo.
The cross-chain application will read the event and perform the transfer action on the bitcoin network.
```jsx title="Solidity"
transportToken(string memory dstChainId, string memory tokenId, string memory receiver, uint256 amount, string memory memo)
```

Creates an event to burn a specified amount of wrapped tokenId runes tokens and withdraw the corresponding amount of underlying tokens to the receiver.
The cross-chain application will read the event and perform the withdrawal action on the bitcoin network.
```jsx title="Solidity"
redeemToken(string memory tokenId, string memory receiver, uint256 amount)
```

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ), after a series of verifications for the redemption action, the original runes tokens will be released from the generated btc account corresponding to the sender's address to the receiver's account if the target chain is the bitcoin network.
- **[omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/service.rs#L240)** is the rust implementation of Omnity protocol. And you can find the details of generate_ticket in it.

***3***. Go to **[Omnity Explorer](https://explorer.omnity.network/)** to track the generated ticket status.

## Query
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation on the layer 2 chain:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the layer 2 chain.
* Unknown represents the operation is not completed.
```
***Sources*** : [`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L778)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with the layer 2 chain.
```
***Sources*** : [`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L570)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of tokens available on the layer 2 chain.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L557)

### get_fee
```md title="get_fee(chain_id: ChainId) -> Option<u64>"
Retrieve the transaction fee based on chain_id as the target chain.
```
***Sources*** : [`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L24)
