---
sidebar_position: 16
---

# FAQ
***Question 1:*** How long does a transaction take?

Answer : ckBTC will take around 6 confirmation blocks, while others typically take about 3 confirmations.


***Question 2:*** How do fees work?

Answer : 
* Bridging fees are denominated in native tokens. BTC on Bitcoin, Ether on Ethererum, etc. 
* And bridging fee includes gas fee on the target chain.
* The redeem fee from the execution chain to the settlement chain (there is no charge for the settlement chain to the execution chain) is adjusted by the target_chain_factor and fee_token_factor. The fee calculation is: target_chain_factor * fee_token_factor.

***Question 3:***  What happens if the “Insufficient balance” pop-up window appears?

Answer : It means you have some unconfirmed transactions. Please wait for at least 3 confirmations before proceeding with the transaction.


***Question 4:*** What happens if the “Not Enough Cardinal Utxos” pop-up window appears?

Answer : We are using the bitcoin api from mempool, which has a limit of 500 utxos per address. This indicates that the number of runes you previously transferred was large and spread across many utxos. As a result, this transaction will require a significant fee. The message 'not enough cardinal utxos' refers to insufficient btc to cover the fee. Please see the suggested solution [here](https://support.xverse.app/hc/en-us/articles/22556402106893-Understanding-UTXO-Management-in-Bitcoin-Transactions#h_01HJ57PH9E7J939P6NJ2HQNN1E).
