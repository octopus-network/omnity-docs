---
sidebar_position: 2
---

# Core Concepts

## PSBT (Partially Signed Bitcoin Transaction)

PSBT is a standardized bitcoin transaction format. Its key feature is allowing multiple participants to independently sign different inputs of a transaction before it's combined and broadcasted. This is fundamental for multi-party coordination on bitcoin.

## DPS (Decentralized PSBT Signing)

DPS is REE's mechanism for handling transaction signing. It leverages the PSBT standard but decentralizes the signing process itself onto the icp (Internet Computer Protocol) blockchain. This approach ensures signatures are managed transparently and trustlessly, without a central coordinator.

## Coin

Within the REE environment, a **Coin** represents a unit of value based on bitcoin's utxo model. REE primarily recognizes native bitcoin (BTC) and assets created using the runes protocol as Coins.

## Pool

A **Pool** functions as a managed container within an exchange protocol. Controlled by its associated exchange via icp smart contracts, each pool holds specific **Coin** assets (e.g., btc or a particular rune) along with the necessary state information and transaction history related to those assets.

## Exchange

An **Exchange** is a specific bitcoin defi (BTCFi) protocol built as a smart contract running on the REE platform. Its main role is to define the logic for asset interactions, primarily enabling the exchange of **Coins** between end-users and the **Pools** managed by the exchange. Exchanges are responsible for validating transactions according to their predefined rules, managing the liquidity within their pools, and participating in the DPS process to get transactions settled on the bitcoin blockchain.

*(Note: The relationship between an exchange and its pools is often referred to as the 'Exchange-Pool Model', which is central to how REE applications manage utxo-based assets.)*

## Orchestrator

The **Orchestrator** is a critical component within REE that oversees the entire lifecycle of a transaction. It coordinates the necessary steps, including managing signature collection through DPS, validating utxos involved in the transaction, and handling final confirmations or initiating rollbacks if issues arise. The orchestrator ensures that transactions are processed atomically and maintain consistency across the system.






Last updated on April 9, 2025