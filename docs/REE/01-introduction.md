---
sidebar_position: 1
---

# REE Introduction

## What Is REE?

REE (Runes Exchange Environment) is a decentralized execution layer for bitcoin defi. It enables open and composable smart contracts to deal with bitcoin assets directly, without relying on bridging, asset wrapping, or non-bitcoin wallets.

Unlike traditional bitcoin layer 2 solutions, REE preserves bitcoin’s security while enhancing programmability through turing-complete smart contracts, all while maintaining native bitcoin transactions and a seamless user experience.

Reading the [white paper](https://docs.google.com/document/d/1d1_51f8YYRhxft_RpGssCKqS95ZE5Ylv1LDleIqVZJE/edit?tab=t.0#heading=h.9hfttub7lmzc) is the best way to fully understand the REE's architecture, working mechanisms, and use cases.

## Key Differences Between REE And Traditional Bitcoin Layer 2

| Feature          | Traditional Bitcoin L2 | REE (Bridgeless)           |
|------------------|------------------------|----------------------------|
| Asset Handling   | Requires bridging/wrapping | Direct native Bitcoin assets |
| Smart Contracts  | Limited Programmability| Fully Turing-complete   |
| Signing Mechanism| Centralized/semi-centralized | Fully decentralized (via ICP)|
| Wallet Compatibility| Often needs new wallets| Works with native Bitcoin wallets |

## Advantages Of REE
![ree architecture](/img/archi.png) 
**REE offers compelling advantages for the Bitcoin DeFi ecosystem.** For end-users, it delivers a seamless experience by supporting standard Bitcoin wallets and enabling faster transactions - all while maintaining Bitcoin's robust security through decentralized validation. For developers, REE provides an open-source (FOSS), highly composable environment that facilitates easy protocol interoperability and shared liquidity. Builders gain additional power through a sophisticated smart contract platform, complete with comprehensive development tools, practical implementation examples, and integrated mechanisms for implementing value capture strategies.

## Core Concepts

### PSBT (Partially Signed Bitcoin Transaction)

PSBT is a standardized bitcoin transaction format. Its key feature is allowing multiple participants to independently sign different inputs of a transaction before it's combined and broadcasted. This is fundamental for multi-party coordination on bitcoin.

### DPS (Decentralized PSBT Signing)

DPS is REE's mechanism for handling transaction signing. It leverages the PSBT standard but decentralizes the signing process itself onto the icp (Internet Computer Protocol) blockchain. This approach ensures signatures are managed transparently and trustlessly, without a central coordinator.

### Coin

Within the REE environment, a **Coin** represents a unit of value based on bitcoin's utxo model. REE primarily recognizes native bitcoin (BTC) and assets created using the runes protocol as Coins.

### Pool

A **Pool** functions as a managed container within an exchange protocol. Controlled by its associated exchange via icp smart contracts, each pool holds specific **Coin** assets (e.g., btc or a particular rune) along with the necessary state information and transaction history related to those assets.

### Exchange Canister

A **Exchange Canister** is a specific bitcoin defi (BTCFi) protocol built as a smart contract running on the REE platform. Its main role is to define the logic for asset interactions, primarily enabling the exchange canister of **Coins** between end-users and the **Pools** managed by the exchange canister. Exchanges are responsible for validating transactions according to their predefined rules, managing the liquidity within their pools, and participating in the DPS process to get transactions settled on the bitcoin blockchain.

*(Note: The relationship between an exchange canister and its pools is often referred to as the 'Exchange-Pool Model', which is central to how REE applications manage utxo-based assets.)*

### Exchange Client

An **Exchange Client** is a component that interacts with an Exchange to provide user-facing functionality or integrate with existing Exchange protocols. There are two main types of Exchange Clients:

**Frontend Client:** Typically a web or mobile application that serves as the user interface for an Exchange. It accepts user operations and initiates calls to the Exchange backend to complete business functions. This type of client is commonly referred to as an **Exchange Frontend**.

**Integration Client:** Usually an off-chain program designed to interact with an existing Exchange to achieve specific objectives. This type of client is commonly used for integrating with an Exchange protocol and is often called an **Exchange Integration**.

Both types of clients communicate with Exchanges through standardized interfaces, enabling users and third-party applications to interact with REE-based DeFi protocols seamlessly.

### Orchestrator

The **Orchestrator** is a critical component within REE that oversees the entire lifecycle of a transaction. It coordinates the necessary steps, including managing signature collection through DPS, validating utxos involved in the transaction, and handling final confirmations or initiating rollbacks if issues arise. The orchestrator ensures that transactions are processed atomically and maintain consistency across the system.






Last updated on June 30, 2025