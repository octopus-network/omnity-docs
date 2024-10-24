---
sidebar_position: 10
---

# FAQ
***Question 1:*** How long does a transaction take?

Answer : ckBTC will take around 6 confirmation blocks, while others typically take about 4 confirmations.


***Question 2:*** How much does a cross-chain trasaction cost?

Answer : Settlement chain -> execution chain with no cross-chain fee(more in detail).


***Question 3:***  What happens if the “Insufficient balance” pop-up window appears?

Answer : It means you have some unconfirmed transactions. Please wait for at least 4 confirmations before proceeding with the transaction.


***Question 4:*** What happens if the “Not Enough Cardinal Utxos” pop-up window appears?

Answer : We are using the bitcoin api from mempool, which has a limit of 500 utxos per address. This indicates that the number of runes you previously transferred was large and spread across many utxos. As a result, this transaction will require a significant fee. The message 'not enough cardinal utxos' refers to insufficient btc to cover the fee. Please see the suggested solution [here](https://support.xverse.app/hc/en-us/articles/22556402106893-Understanding-UTXO-Management-in-Bitcoin-Transactions#h_01HJ57PH9E7J939P6NJ2HQNN1E).
