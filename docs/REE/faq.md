---
sidebar_position: 4
---

# FAQ [WIP]
***Question 1:*** How are liquidity pools secured?
Smart contracts, not multi-sig control pools on RichSwap. Unlike traditional multi-signature wallets, which are still ultimately controlled by people, RichSwap pools: 

✅ Operate trustlessly via decentralized coordination.
✅ Are governed on-chain.
✅ Cannot be censored, paused, or manipulated.

***Question 2:*** How does RichSwap handle front-running and MEV?
RichSwap leverages SIGHASH_ALL, ensuring that:

✅ Trades cannot be modified after signing.
✅ No MEV manipulation—once you sign a swap, it’s final.
✅ No front-running—miners cannot sandwich your trade.

***Question 3:***Will RichSwap be open-source?
Yes. We plan to open-source RichSwap’s smart contract and frontend code by the end of February, along with launching the REE testnet and a documentation hub. At that point, the conditions for developing BTCFi on REE will be in place.
During the first half of 2025, exchanges launching on REE will require review and approval. After this period, REE will evolve into a fully permissionless application execution environment, just like Ethereum, Solana, and ICP.