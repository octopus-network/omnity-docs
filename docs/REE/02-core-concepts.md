---
sidebar_position: 2
---

# Core Concepts

## PSBT (Partially Signed Bitcoin Transaction)

PSBT is a standardized Bitcoin transaction format. Its key feature is allowing multiple participants to independently sign different inputs of a transaction before it's combined and broadcasted. This is fundamental for multi-party coordination on Bitcoin.

## DPS (Decentralized PSBT Signing)

DPS is REE's mechanism for handling transaction signing. It leverages the PSBT standard but decentralizes the signing process itself onto the ICP (Internet Computer Protocol) blockchain. This approach ensures signatures are managed transparently and trustlessly, without a central coordinator.

## Coin

Within the REE environment, a **Coin** represents a unit of value based on Bitcoin's UTXO model. REE primarily recognizes native Bitcoin (BTC) and assets created using the Runes protocol as Coins.

## Pool

A **Pool** functions as a managed container within an Exchange protocol. Controlled by its associated Exchange via ICP smart contracts, each Pool holds specific **Coin** assets (e.g., BTC or a particular Rune) along with the necessary state information and transaction history related to those assets.

## Exchange

An **Exchange** is a specific Bitcoin DeFi (BTCFi) protocol built as a smart contract running on the REE platform. Its main role is to define the logic for asset interactions, primarily enabling the exchange of **Coins** between end-users and the **Pools** managed by the Exchange. Exchanges are responsible for validating transactions according to their predefined rules, managing the liquidity within their Pools, and participating in the DPS process to get transactions settled on the Bitcoin blockchain.

*(Note: The relationship between an Exchange and its Pools is often referred to as the 'Exchange-Pool Model', which is central to how REE applications manage UTXO-based assets.)*

## Orchestrator

The **Orchestrator** is a critical component within REE that oversees the entire lifecycle of a transaction. It coordinates the necessary steps, including managing signature collection through DPS, validating UTXOs involved in the transaction, and handling final confirmations or initiating rollbacks if issues arise. The Orchestrator ensures that transactions are processed atomically and maintain consistency across the system.
