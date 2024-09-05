---
sidebar_position: 5
---

# EVM
## Supported Chains:
- [Bevm](https://www.bevm.io/) CANISTER_ID=rp433-4qaaa-aaaar-qaf2q-cai
- [Bitlayer](https://www.bitlayer.org/) CANISTER_ID=he2gn-7qaaa-aaaar-qagaq-cai
- [B² Network](https://www.bsquared.network/) CANISTER_ID=gsr6g-kaaaa-aaaar-qagfq-cai
- [X Layer](https://www.okx.com/xlayer) CANISTER_ID=gjucd-qyaaa-aaaar-qagha-cai
- [Merlin](https://merlinchain.io) CANISTER_ID=govex-5aaaa-aaaar-qaghq-cai
- [Bob](https://www.gobob.xyz/) CANISTER_ID=epmqo-ziaaa-aaaar-qagka-cai
- [Rootstock](https://rootstock.io/) CANISTER_ID=if3hq-3iaaa-aaaar-qahga-cai
- [Bitfinity](https://bitfinity.network/) CANISTER_ID=pw3ee-pyaaa-aaaar-qahva-cai
- [AILayer](https://ailayer.xyz/) CANISTER_ID=pk76v-yyaaa-aaaar-qahxa-cai

## Query
### mint_token_status
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Returns the status of the wrapped token minting operation:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the l2 chain.
* Unknown represents the operation is not completed.
```
***Sources*** : [`MintTokenStatus`](https://github.com/octopus-network/omnity-interoperability/blob/main/types/src/lib.rs#L773)

### get_chain_list
```md title="get_chain_list() -> Vec<Chain>"
Retrieve a list of chains that connect with the layer2 chain.
```
***Sources*** : [`Chain`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L570)

### get_token_list
```md title="get_token_list() -> Vec<TokenResp>"
Retrieve a list of token that is available on the layer2 chain.
```
***Sources*** : [`TokenResp`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L557)

### get_fee
```md title="get_fee(chain_id: ChainId) -> Option<u64>"
Retrieve the fee for a transaction based on chain_id as a target chain.
```
***Sources*** : [`ChainId`](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/types.rs#L24)

## Update
### generate_ticket
```md title="generate_ticket(hash: String) -> Result<(), String>"
Generate an cross-chain transaction from the bitcoin layer2 evm-compatible instances mentioned above on Omnity. 
```

#### Workflow: 

***1***. Call the corresponding Solidity function(E.g. burnToken) from the UI and get the calculated function_hash:
- [omnity-port-solidity](https://github.com/octopus-network/omnity-port-solidity/blob/main/contracts/OmnityPort.sol) is the solidity implementation of Omnity Port on EVM compatible blockchains, a contract module which provides a basic access control mechanism on the Rune tokens. It provides the following apis:

```md title="burnToken(string memory tokenId, uint256 amount)"
Destroys a amount of rune tokenId from the caller.
```
```md title="mintRunes(string memory tokenId, address receiver)"
Creates an event of having a centain amount(depends on different runes) of tokenId and assigns them to receiver.
The cross-chain application will read the event and operate the mint and transfer action in order on bitcoin network. 
```
```md title="transportToken(string memory dstChainId, string memory tokenId, string memory receiver, uint256 amount, string memory memo)"
Creates an event of moving a amount of rune tokenId from the caller’s account to receiver's on dstChainId with memo note.
The cross-chain application will read the event and operate the transfer action on bitcoin network.
```
```md title="redeemToken(string memory tokenId, string memory receiver, uint256 amount)"
Creates an event of burning a amount of wrapped rune tokenId and withdraw the corresponding amount of underlying tokens to receiver.
The cross-chain application will read the event and operate the withdrawal action on bitcoin network.
```

***2***. Put the function_hash as a parameter into generate_ticket from your dapp( either in ***Rust*** or ***Typescript*** ):
- [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability/blob/main/route/evm/src/service.rs#L240) is the rust implementation of Omnity protocol. And you can find the detail of generate_ticket in it.

***3***. Go to [Omnity Explorer](https://explorer.omnity.network/) to track the generated ticket status.
