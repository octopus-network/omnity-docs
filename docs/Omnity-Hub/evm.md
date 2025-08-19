---
sidebar_position: 2
---

# Runes On EVM
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
| [Core](https://coredao.org/) | vopxt-5qaaa-aaaar-qajnq-cai | 0x1Ad8cec9E5a4A441FE407785E188AbDeb4371468 | Core |
| [Ethereum](https://ethereum.org/en/) | 3zfof-myaaa-aaaar-qaioa-cai | 0xDA290C4D658c767fA06c27bc2AcaD59bDFCCff4A | Ethereum |
| [Base](https://bridge.omnity.network/runes?targetChain=Base) | tbq6s-saaaa-aaaar-qaoha-cai | 0xDA290C4D658c767fA06c27bc2AcaD59bDFCCff4A | Base |

## Update
### generate_ticket
Generate an cross-chain transaction from the layer 2 evm-compatible instances and ethereum. 
```md title="generate_ticket(hash: String) -> Result<(), String>"
Parameters:
hash: String - transaction id

Returns:
String: error information if the query fails
```
#### Workflow: 
***1***. Call the corresponding solidity function(e.g., burnToken) from your own contract in the UI and get the calculated function_hash:
- **[omnity-port-solidity](https://github.com/octopus-network/omnity-port-solidity/blob/main/contracts/OmnityPort.sol)** is the solidity implementation of Omnity Port on evm-compatible blockchains, a contract module which provides a basic access control mechanism on the runes tokens. 
- **[LuckyPot](https://github.com/octopus-network/bitlayer-omnity-demo)** is a solidity implementation that includes a **[demo](https://bitlayer-omnity-demo.vercel.app/)** application interacting with Omnity on the Bitlayer. 

Both provide the following apis:

#### mintRunes
Creates an event involving a certain amount (depending on the type of runes) of tokenId and assigns it to the receiver. 
The cross-chain application will read the event and perform the mint action on the bitcoin network.

```jsx title="Solidity"
mintRunes(string memory tokenId, address receiver)
```
| Parameter | Description | Example |
| --- | --- | --- |
| tokenId | the token id |Bitcoin-runes-UNCOMMON•GOODS|
| receiver | the evm receiver address |0xd1f4711f22e600E311f9485080866519ad4FbE3e|

#### redeemToken
(Transfer runes back to bitcoin network) Creates an event to burn a specified amount of wrapped tokenId runes tokens and withdraw the corresponding amount of underlying tokens to the receiver.
The cross-chain application will read the event and perform the withdrawal action on the bitcoin network.

```jsx title="Solidity"
redeemToken(string memory tokenId, string memory receiver, uint256 amount)
```
| Parameter | Description | Example |
| --- | --- | --- |
| tokenId | the token id |Bitcoin-runes-UNCOMMON•GOODS|
| receiver | the bitcoin receiver address |bc1qu597cmaqx5zugsz805wt5qsw5gnsmjge50tm8y|
| amount | the amount of tokens that will be withdrawn|1|

#### transportToken
(Transfer runes to the evm compatible layer2 network) Creates an event to transfer a specified amount of tokenId runes tokens from the caller’s account to the receiver's account on dstChainId, with an optional memo.
The cross-chain application will read the event and perform the transfer action on the source network.
```jsx title="Solidity"
transportToken(string memory dstChainId, string memory tokenId, string memory receiver, uint256 amount, string memory memo)
```
| Parameter | Description | Example |
| --- | --- | --- |
| dstChainId | the destination chain id | bevm |
| receiver | the evm receiver address |0xd1f4711f22e600E311f9485080866519ad4FbE3e|
| tokenId |the token id|Bitcoin-runes-UNCOMMON•GOODS|
| amount |the amount of tokens that will be transferred|10|
|memo|a short note or message, which could be empty|none|

#### burnToken
To destroy a amount of tokenId runes tokens from the caller.
```jsx title="Solidity"
burnToken(string memory tokenId, uint256 amount)
```
| Parameter | Description | Example |
| --- | --- | --- |
| tokenId |the token id|Bitcoin-runes-UNCOMMON•GOODS|
| amount |the amount of tokens that will be burnt|1|

#### calculateFee
Calculates the transfer fee for the destination chain. This function will be used for each action mentioned above like this [one](https://github.com/octopus-network/bitlayer-omnity-demo/blob/main/contracts/LuckyPot.sol#L81).
```jsx title="Solidity"
calculateFee(string memory target_chain_id) 
```
Find more options for target_chain_id [here](https://docs.omnity.network/docs/references#chain-metadata).

| Parameter | Description | Example |
| --- | --- | --- |
|target_chain_id|the destination chain id| Bitcoin|
|fee|returns the calculated fee as uint128|none|


**2. [omnity-interoperability](https://github.com/octopus-network/omnity-interoperability)** is the rust implementation of Omnity protocol. And you can find the details of generate_ticket( can be called in either ***Rust*** or ***Typescript*** ) in it.

*  For minting runes on the evm compatible layer 2 network, 2 actions are combined: mint and transfer. For the transfer action, 3 confirmations from the generate_ticket invocation on the bitcoin network are required. The bitcoin custom will confirm that the runes are minted via **[the ord canister](https://github.com/octopus-network/ord-canister)**. Afterward, the ticket will be fetched from the target chain, and **mintRunes**  will be called to mint the tokens to the receiver.

* For transfering runes back to bitcoin network, put the function_hash from the **redeemToken** output as a parameter into generate_ticket from your dapp, after a series of verifications for the redemption action (confirmation from 2 out of 3 RPCs) vis httpsoutcall to fetch the port event, the original runes tokens will be released from the generated btc account corresponding to the sender's address to the receiver's account if the target chain is the bitcoin network.

* For transferring runes from the Bitcoin network to an evm compatible layer 2 network, after receiving 3 confirmations on the Bitcoin network, the ticket will be fetched from the target chain, which will use its chain key to sign the transaction to its port contract, and **mintRunes**  will be called to mint the tokens to the receiver.

* For transferring runes between evm compatible layer 2 networks, after receiving confirmation from 2 out of 3 RPCs (a workaround for light client verification), the function_hash from the **transportToken** output should be passed as a parameter into generate_ticket on the source chain. The ticket will then be fetched on the target chain, which will use its chain key to sign the transaction to its port contract.

* For burning runes, similar to the redeem action, instead of being released, the original rune tokens will be burned with **burnToken** from the generated btc account on the bitcoin network.

***3***. Go to **[Omnity Explorer](https://explorer.omnity.network/)** to track the generated ticket status.


## Query
### mint_token_status
Returns the status of the wrapped token minting operation on the layer 2 chain
```md title="mint_token_status(ticket_id: String) -> MintTokenStatus"
Parameters:
ticket_id: String - the ticket id

Returns:
MintTokenStatus: a enum containing:
* Finalized { tx_hash: String } represents the operation is succeeded with the transaction hash on the layer 2 chain.
* Unknown represents the operation is not completed.
```

### get_chain_list
Retrieve a list of chains that connect with the layer 2 chain.
```md title="get_chain_list() -> Vec<Chain>"
Returns:
Vec<Chain>: struct containing:
        chain_id: ChainId
        canister_id: String
        chain_type: ChainType
        chain_state: ChainState
        contract_address: Option<String>
        counterparties: Option<Vec<ChainId>>
        fee_token: Option<TokenId>
```

### get_token_list
Retrieve a list of tokens available on the layer 2 chain.
```md title="get_token_list() -> Vec<TokenResp>"
Returns:
Vec<TokenResp>: struct containing:
        token_id: TokenId
        symbol: String
        decimals: u8
        icon: Option<String>
        rune_id: Option<String>
        evm_contract: Option<String>
```

### get_fee
Retrieve the transaction fee based on chain_id as the target chain.
```md title="get_fee(chain_id: ChainId) -> Option<u64>"
Parameters:
chain_id: ChainId(String) - the target chain

Returns:
Option<u64>: the fee amount
```

Last updated on February 13, 2025