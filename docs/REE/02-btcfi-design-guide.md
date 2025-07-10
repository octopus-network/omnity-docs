---
sidebar_position: 2
---

# REE-Based BTCFi Design Guide
This document outlines the key considerations and steps for designing a robust and secure Bitcoin-backed Decentralized Finance (BTCFi) system, built explicitly on the Runes Exchange Environment (REE). Please note that this guide focuses on the exchange canister design; front-end or alternative client designs are out of scope.

REE can be used to run both Bitcoin L1 DApps and L2 DApps. For L2 DApps, the role of REE is fixed: it serves as the embedded bridge of the DApp, enabling autonomous custody of Bitcoin assets and facilitating BTC and Runes deposit and withdrawal. For an implementation example, see the [Cookie Game Demo](https://github.com/octopus-network/ree-l2-dapp-demo). This article mainly focuses on building Bitcoin L1 DApps based on REE.

## Prerequest
Designing a well-functioning, secure, and maintainable Bitcoin DApp on REE requires three areas of background knowledge:

* It's necessary to understand Bitcoin's principles and mechanisms, especially the data structure of transactions, signatures, network fees, block inclusion, and block reorgs. Although REE encapsulates most of the PSBT operations for DApps, understanding the principles and applications of PSBT remains necessary. Recommended reading: [《learn me a bitcoin》](https://learnmeabitcoin.com/technical/)and [《Mastering Bitcoin》](https://github.com/bitcoinbook/bitcoinbook/blob/develop/BOOK.md).

* Designers should understand the [Runes meta-protocol](https://docs.ordinals.com/runes.html), as it is integral to the functionality of REE.

* REE DApp designers must be thoroughly familiar with the Internet Computer. REE has encapsulated all the Bitcoin network events required by applications and provides best practices for transaction processing and state management, making the development of basic Bitcoin DApps no longer a difficult task. The more designers understand IC, the more they can fully leverage this most powerful on-chain computing platform ever, enabling applications to have the most comprehensive functionalities and optimal user experience. Refer to the [IC documentation](https://internetcomputer.org/docs/home).

* Last but not least, REE DApp designers should be familiar with the REE architecture, including how the Orchestrator interacts with a DApp client and the exchange (DApp) canister. The best way to know it is to read through the [REE White Paper](https://docs.google.com/document/d/1d1_51f8YYRhxft_RpGssCKqS95ZE5Ylv1LDleIqVZJE/edit?tab=t.0#heading=h.9hfttub7lmzc).

## Core Principles
Designing a BTCFi system on Omnity REE requires adherence to several core principles that extend general DeFi and Bitcoin principles:

* **BTC as the Currency**: BTC is naturally the primary transaction currency for BTCFi, although in special circumstances, token-to-token exchanges may be beneficial. However, in the vast majority of cases, BTC should be used as the currency. Using BTC as the currency helps quantify the economic value of transactions and simultaneously quantifies risk. It also solves the double coincidence problem, avoids liquidity fragmentation, and enhances composability opportunities among decentralized applications (DApps).

* **Decentralization**: Minimize reliance on central authorities, especially in the custodianship and management of Bitcoin assets.

* **Transparency**: All transactions and operations involving Bitcoin assets should be verifiable on both the Bitcoin and REE block explorer, Runescan.

* **Composability**: Design components that can be easily integrated with other REE-based BTCFi protocols and potentially other Bitcoin applications.

* **Security**: Implement rigorous security measures to protect user assets, with a specific focus on REE's specific security considerations.

* **User Experience (UX)**: Ensure the system is intuitive and easy to use, especially when interacting with complex financial primitives.

## Key Components
A typical BTCFi on the REE platform comprises several key components:

|Component|Description|
| --- | --- |
|Exchange Canister|An exchange canister in the REE-based BTCFi system is an ICP smart contract that holds Bitcoin assets using its Chain Keys and serves the demands of traders.|
|Front-end|A front-end is a Web UI for traders to interact with the exchange canister.|
|REE Orchestrator|The REE Orchestrator is an open and free-to-use middleware smart contract on IC that orders REE transactions and coordinates their execution process.|
|REE Indexer|The REE Indexer is an open and shared indexer that serves REE transaction history and information for all exchange canisters and their pools.|
|Runescan Explorer|The Runescan is an open and shared block explorer that shows REE transaction history and information for all exchange canisters and their pools.|
|App Indexer(Optional)|A REE-based BTCFi DApp may need an additional indexer to retrieve and store its on-chain states.|
|Alt Clients(Optional)|A REE-based BTCFi DApp may have an unlimited number of alternative clients, including bots, aggregators, and others.|
|Utility Token(Optional)|A REE-based BTCFi protocol may have a utility token to incentivize its community and capture the value of the protocol.|
|DAO(Optional)|A REE-based BTCFi protocol may have a DAO for decentralized governance.|


## A Step-to-Step Guide
### Identify Actions
BTCFi applications can be seen as a series of transitions between users and smart contracts that fulfill users’ financial needs. Typically, a BTCFi application supports one or more types of transactions. For example, the core actions of a lending application are deposit transactions from lenders and borrowing transactions from borrowers. The core actions of a swap application are token swaps, liquidity additions, and withdrawals.

Below, we'll use a token swap as an example to explain how to identify and define actions. This example will be used throughout the guide, but it will only cover the backbone of a token swap application. RichSwap provides production-grade complete [code](https://github.com/octopus-network/richswap-canister).

Following the principle of "prioritizing BTC as the currency," swaps can be categorized into two types: BTC for Token and Token for BTC. Therefore, a swap application's main actions are four: BTC for Token, Token for BTC, adding liquidity, and withdrawing liquidity. Other auxiliary actions won't be detailed here. I recommend that designers illustrate the inputs and outputs for each action based on the example diagram below.
![action](/img/action.png)

### Define Pool
A pool is a container used by a REE DApp smart contract (termed as an exchange canister) to hold Bitcoin assets and serve the demands of traders. From a technical point of view, a pool is a Chain Key that is controlled by the exchange canister for signing Bitcoin transactions.

Even though a pool can contain many UTXOs, in most cases, we prefer to limit each pool to owning only one UTXO at any given time. Every transaction executed on a pool uses the current UTXO as input and provides an output back to the pool, meaning transaction execution updates the UTXO. Consequently, transactions executed on the same pool sequentially form parent-child transactions. The REE Orchestrator determines the order of these transactions based on the sequence in which requests are received, and even Bitcoin miners cannot alter this.

Considering one UTXO can own unlimited amounts of Bitcoin and Runes, one pool can serve the needs of any DApps. However, having multiple pools generally offers advantages:

Since the mempool accepts a maximum of 25 unconfirmed parent-child transactions, a pool can be seen as a channel for transaction execution and settlement. Each such channel has a maximum settlement bandwidth of 25 transactions per block. Dividing into more pools enables achieving a greater settlement bandwidth, thereby providing horizontal scalability.
As the saying goes, "Don't put all your eggs in one basket." Multiple pools provide risk isolation, preventing localized errors from affecting the entire system. This helps reduce losses in the event of an incident and buys time for security mechanisms to take effect.

Defining the pool is the most critical step in REE DApp design, as it determines the exchange canister's architecture and the pool's state management logic. The design principle is: identify the shared state among transactions—that is, groups of states that multiple transactions need to update. Place these shared states into the same pool, and divide non-shared states into multiple pools.

The most crucial shared state for a swap application is the token price, which is the exchange rate between the token and BTC. Transactions involving the same token—whether it's a token for BTC swap or a BTC for token swap—will affect its price. However, swap transactions between different tokens will not impact each other's prices. Therefore, the pools in a swap application should be defined by token type, meaning one token, one pool.

### Design Transaction Structures
As stated in the white paper, the REE transaction processing involves the trader and the BTCFi smart contract jointly signing a PSBT (Partially Signed Bitcoin Transaction). This process is divided into two steps:

First, the trader queries the pool state via the DApp client (web frontend or mobile app). Typically, the exchange canister will provide a public query method for each action.

Then, based on the query results (most importantly, the pool UTXO), the DApp client constructs the PSBT and calls the wallet to sign the trader's inputs.

Finally, the DApp client submits the PSBT and other parameters to the REE Orchestrator, which then calls the exchange canister to sign the pool inputs.

Therefore, clearly defining the Bitcoin transaction structure for each type is crucial. We can expand the simple diagram obtained in the first step, "Identify Actions," into one that closely resembles the actual Bitcoin transaction structure. Here, we continuously expand the swap DApp design:
<img src="/img/swap1.png" alt="swap1" style={{width: '850px', height: 'auto'}} />
<img src="/img/swap2.png" alt="swap2" style={{width: '850px', height: 'auto'}} />
<img src="/img/swap3.png" alt="swap3" style={{width: '850px', height: 'auto'}} />
<img src="/img/swap4.png" alt="swap4" style={{width: '850px', height: 'auto'}} />


### Identify Pool State
The REE white paper proposes the Exchange-Pool model as the standard for managing exchange execution state. So, what states belong to the pool state, and what belongs to the exchange's global state?

Generally, any state that is modified by transaction execution is considered pool state. This includes the UTXO, the types and balances of pool assets, the ownership of pool assets by liquidity providers, and the debt and credit relationships between traders and the pool.

In contrast, the exchange state typically consists of transaction rule parameters. To prevent changes to trading rules during active transaction execution, updating the exchange state should be done with extreme caution. Ideally, the exchange service should be halted, existing in-flight transactions allowed to finalize, and then the exchange state updated via a canister upgrade.

As to the swap application, utxo, Runes, and BTC balances, exchange rate, LP shares, K value are easily identified as parts of the pool state.

### Design Intentions
Intention, as the name suggests, describes the purpose of a transaction initiated by a trader. From Bitcoin's perspective, the transaction's intent is already defined by the inputs and outputs within the PSBT (Partially Signed Bitcoin Transaction); however, this intent isn't immediately apparent to the Orchestrator, exchange canisters, or anyone inspecting the transaction. Therefore, we've introduced the Intention data structure to facilitate the interpretation, validation, and execution of transactions.

REE supports EVM-like synchronous composability (even though the actual transaction execution is asynchronous). A trader can complete a purchase on DEX A and a sale on DEX B within a single transaction (cross-market arbitrage). They could also borrow, then sell, and finally repay the loan (flash loan).

Every time a transaction calls an exchange, it requires an intention. Multiple intentions within a single transaction form an intention set.

All data items within an Intention are self-explanatory so I won't go through them one by one here. It's important to note that the Orchestrator is responsible for verifying the consistency between the Intention Set and the PSBT. Inconsistent requests will be rejected. Therefore, if an exchange voluntarily trusts the Orchestrator, it can directly execute transactions based on the intention, without needing to consult the PSBT again.

To avoid the hassle of multiple signatures on the client side, the intention set does not require a signature, meaning it could be tampered with. However, by verifying the consistency between the signed PSBT and the intended set, the risk of man-in-the-middle attacks can be effectively mitigated.

It is worthy to emphasize that action_params are arbitrary parameters passed by the client to the exchange canister, and the Orchestrator does not check them. Therefore, action_params should only be used for remarks and should never serve as the basis for a transaction.

### Put It All Together
At this point, the skeleton of an exchange canister is apparent. It will include quote methods that correspond one-to-one with each action, along with the five public methods required by the REE environment:

* execute_tx: Tx execution on an exchange canister means checking the intention against the current pool state, in other words, the head of the pool state chain. If the intention meets the trading term, duplicate the head of the pool state chain, update the new head state, and then sign the PSBT with the pool’s Chain Key.
* new_block: Transactions came along with a new block, which means they have been included in the Bitcoin block. The exchange canister needs to associate these transactions with the block and wait for finalization or reorg. 
* rollback_tx: When the Bitcoin mempool rejects an unconfirmed transaction, the exchange canister needs to restore the pool to its state before the transaction execution by cutting the head of the pool state chain, starting from the transaction.
* get_pool_list, used by the REE indexer and other clients to inspect the exchange state.
* get_pool_info, used by the REE indexer and other clients to inspect the pool state.

Omnity has presented multiple open-source [examples](https://github.com/octopus-network) for REE DApp designers and developers to reference.


## Design Considerations
### Block Reorg
For an exchange canister, a block reorg means receiving a new block at the same height as the current one (a depth-1 reorg), or a new block one height lower than the current one (a depth-2 reorg).

Statistics show that reorganizations deeper than two have never occurred on the Bitcoin network in the past decade. Therefore, transactions with more than three confirmations are generally considered finalized. For high-value transactions, a higher finality threshold can be chosen, such as 4 to 6 confirmations. The exchange canister can decide its finality threshold.

### Tx Reject
The mempool can reject a transaction in a few situations:

1. The transaction is invalid (e.g., it uses an already spent transaction output), resulting in the broadcast failure.
2. The transaction fee doesn't meet the mempool's minimum fee requirements.
3. The transaction is replaced in the mempool by a higher-fee transaction that uses the same inputs (i.e., the trader double-spends).
4. The transaction is cleared because it has been in the mempool for too long or has a fee that is too low.

Typically, case 1 is caused by defects, and case 3 is intentional on the trader's part. Cases 2 and 4 are sporadic.

### Randomness
Randomness is a crucial element in many DeFi and GameFi DApps, and REE BTCFi applications can leverage randomness from both the Bitcoin blockchain and the Internet Computer (ICP). However, it is essential to exercise caution when incorporating randomness, especially given the potential for REE transactions to fail in the mempool before being included in a block.

For this reason, the appropriate place to integrate randomness into a REE BTCFi application is within the `new_block` method, rather than the `execute_tx` method. This ensures that the randomness is only utilized after a transaction has been successfully included in a Bitcoin block, or even after a few confirmations, mitigating risks associated with mempool failures.

### Latency
RichSwap's typical transaction processing latency is 5-7 seconds, providing a transaction experience comparable to that of Ethereum. However, achieving this level of latency wasn't easy; it's the result of optimizations in both the processing flow and deployment.

Firstly, the Orchestrator, exchange canister, and Runes Indexer are all deployed on the Fiduciary subnet. This ensures that Chain Key signatures, the Orchestrator's calls to the execute_tx method on the exchange canister, and the Orchestrator's queries to the Runes Indexer for Runes balances are all completed within the same subnet.

Additionally, RichSwap utilizes UTXO client proof technology to avoid cross-subnet calls from the Orchestrator to the Bitcoin Canister. If you don't use this advanced technique, typical transaction processing latency will increase by 3 seconds, resulting in a latency of 7-10 seconds.

Exchange canisters ideally avoid performing very time-consuming operations within the execute_tx method, such as cross-subnet calls to other canisters or HTTP outcalls. You can generally prevent these situations by deploying auxiliary canisters on the Fiduciary subnet and by using scheduled tasks to fetch web data.

Deploying all of an exchange's canisters on the Fiduciary subnet will significantly increase running costs, specifically, about three times that of a regular subnet. However, given the overall economics of the IC platform, this is usually not an issue.

### Throughput
REE transaction execution speed is measured in seconds, but settlement on the Bitcoin network is measured in minutes. The bottleneck for the entire system's throughput is always the settlement phase.

As mentioned earlier, each of an exchange's pools acts as an independent settlement channel, with a settlement bandwidth of 25 transactions per block. Therefore, creating more pools is the fundamental way to achieve higher throughput.

However, this method isn't without limitations, as it fragments liquidity across multiple pools. This either makes it difficult for users, who can only access a portion of the liquidity at a time, or it increases the complexity of transaction logic and state management, as a single transaction might need to update the state of multiple pools.

### Transparency
Omnity has established [Runescan.net](https://www.runescan.net/) as the open and shared explorer for all REE DApp. The exchange canister just needs to implement get_pool_list and get_pool_info for its internal state, visible to the public. 

In the PoolInfo return value, there's an extensible field called attributes. The exchange canister can place any data it wishes to display to users within this field, formatted as JSON key/value pairs.

## Security Best Practices
### Common Practices
Security is paramount in BTCFi. REE DApps should implement the following Web3-generic best practices:

* **Code Audits**: Conduct regular independent security audits of all smart contracts, utilizing auditors with expertise in both Omnity REE and Bitcoin bridging mechanisms.
* **Bug Bounty Programs**: Incentivize ethical hackers to identify and report vulnerabilities in both smart contracts and bridging infrastructure.
* **Time Locks**: Implement time locks for sensitive protocol changes, giving users time to react to potential malicious updates.
* **Decentralized Governance**: Empower the community, including wrapped Bitcoin holders, to make decisions, reducing centralized control and single points of failure.
* **Incident Response Plan**: Develop a comprehensive plan for responding to security incidents, including rollback strategies and communication protocols.

### Reentrancy
Since the DAO hack, reentrancy has consistently been one of the most dangerous issues in smart contract development.

Among an exchange canister's three update interfaces, new_block and reject_tx are typically called synchronously and execute sequentially, thus not involving reentrancy. However, if an exchange canister uses await within these two methods, reentrancy must then be considered. The execute_tx method, at a minimum, requires an await call for Chain Key signatures, meaning it must explicitly handle reentrancy.

Our recommendation is to reject reentrant calls for the same pool. This is because two calls so close in time would have the same nonce, causing the second call to fail inevitably. However, transaction execution calls on different pools should allow reentrancy. This is because the states of individual pools are separate, eliminating any issues of competing access. Ominty's provided open-source exchange [examples](https://github.com/octopus-network) are implemented this way; please refer to them.

### Anti-Dust Attack
Since clients need to pay a fee for each transaction, the risk of dust attacks on REE DApps is relatively low. However, two negative impacts are still possible. First, an attacker could use dust transactions to block settlement channels, considering that each REE DApp pool has a settlement bandwidth of 25 transactions per block. Such a blocking attack wouldn't be brutal. Second, processing a single transaction requires the exchange canister to perform at least one Chain Key signature, which incurs a cost of 26.2B cycles, about 4 cents at the current $ICP price. If the exchange can't generate enough revenue to offset this cycle's consumption, it constitutes a griefing attack.

REE DApps can protect against dust attacks by setting a minimum economic value for transactions. RichSwap, for instance, has implemented such a mechanism, requiring a minimum transaction value of 10k sats. This ensures that the revenue generated from processing a transaction always exceeds its cost.

More advanced strategies could dynamically adjust this minimum transaction value based on the length of the unconfirmed transaction queue. In other words, when the settlement queue is congested, only high-value transactions are allowed to enter.

### Guardian Daemon
Every developer should clearly understand that BTCFi smart contracts operate in a perilous environment, and their risk of being attacked is directly proportional to their Total Value Locked (TVL). No quality control method can 100% eliminate defects. Therefore, for high-value BTCFi applications, building external defense systems is essential. These systems are like the reactive armor and active protection systems on a tank, supplementing its main armor. Guardian daemons, flow control, and escape hatches all fall under the category of external defense systems.

Guardian daemons, as the name suggests, are off-chain resident programs. They monitor the transaction execution of exchange canisters, which can be achieved by connecting to a Bitcoin full node and the REE Orchestrator. After detecting specific types of transactions, they check whether the exchange canister's state transitions are as expected.

Typically, guardian daemons are only interested in actions that have pool asset outputs or affect the ownership shares of pool assets. Specifically, they verify whether the transaction withdrew excessive assets or whether it disproportionately increased the initiator's share of assets.

I recommend that the implementations of guardian daemons and exchange canisters remain independent of each other. They should be developed by different people using different programming languages to avoid harmful correlations. When a guardian daemon detects an anomalous state transition, it should be able to call a privileged interface to halt the BTCFi service, thereby mitigating further losses.

### Flow Control
Flow control limits the maximum asset outflow for a single transaction. This cap should be reasonable and have minimal impact on regular user activity. With transaction monitoring and emergency braking, combined with asset flow control, we can minimize asset losses following an attack.

### Escape Hatch
Escape Hatch is an advanced active defense mechanism. Its premise is that a robust guardian daemon can quickly identify an attack transaction.

In that condition, first, the BTCFi service is halted. Then, through a privileged interface, the exchange canister is instructed to sign an escape transaction. This transaction uses the attacked pool's UTXO as input and transfers the assets to a pre-configured safe house address held by the canister.

The escape transaction's fee rate and total fee must be higher than those of the attack transaction, allowing it to replace the attack transaction in the mempool. Given that REE caps the fee rate for regular transactions (at no more than three times the base fee), achieving this replacement is not difficult.

A few points need attention:

* The escape transaction should be broadcast directly to the mempool, bypassing the Bitcoin Subnet.
* The exchange canister can only sign escape transactions that transfer pool assets to the safe house address.
* The safe house address should be a static variable with no modification methods provided.
* Only the guardian daemon can trigger the escape hatch.

The escape hatch offers a remarkable ability to recover losses during an attack, but it's not 100% reliable. The key is reaction speed: the shorter the time interval between an attack transaction entering the mempool and an escape transaction entering the mempool, the better. A shorter interval means a higher probability of recovering lost assets.

At the same time, the presence of an escape hatch shouldn't lead to neglecting emergency braking and flow control.

### PSBT Validation
The PSBT contains the complete terms of a transaction. Therefore, an exchange canister can verify the transaction's legality through the PSBT.

The REE Orchestrator checks for consistency between the PSBT and the Intention parameters. This is a shortcut, allowing the exchange canister to obtain the Intention directly without parsing the PSBT. However, it should not be regarded as a guarantee of security. REE is FOSS (Free and Open Source Software) and doesn't provide any QoS (Quality of Service) guarantees. The exchange canister remains fully responsible for the transactions it signs.

Here, It is recommend that any high-value BTCFi application implement full PSBT validation independently.

### Stay in the Group
To fully leverage the power of an open eco in combating open and unpredictable security threats, REE DApp designers and developers must stay actively engaged with the REE development community. This involves:

* **Knowledge Sharing**: Participate in forums, discussions, and workshops to share insights on security best practices, emerging threats, and effective mitigation strategies. Learning from the collective experience of the group is invaluable in identifying and addressing vulnerabilities.
* **Collaborative Learning**: Actively review and contribute to open-source REE projects and security-focused initiatives. This fosters a collaborative environment where new attack vectors can be identified and robust defense mechanisms developed together.
* **Early Threat Detection**: Stay informed about the latest security research, exploits, and vulnerabilities within the broader blockchain and DeFi ecosystems. The group can serve as an early warning system, allowing for proactive adjustments to DApp designs and security protocols.
* **Standardization and Best Practices**: Work collectively to establish and refine security standards and best practices for REE-based BTCFi applications. This includes contributing to guidelines for secure coding, auditing, and incident response.

By maintaining continuous engagement and fostering a culture of shared knowledge and collaborative problem-solving, the REE development community can significantly enhance the overall security posture of BTCFi applications built on the platform.



Last updated on July 10, 2025