---
sidebar_position: 2
---

# Use[WIP]

RichSwap charges a 0.9% swap fee, which is distributed as follows:
* 0.7% goes to liquidity providers (LPs)
* 0.2% goes to protocol fees (which are donated to the HOPE•YOU•GET•RICH Runes community)




RichSwap currently supports: 

✅ Unisat Wallet
✅ MagicEden Wallet
✅ Xverse Wallet
✅ OKX Wallet

More wallets will be added soon.

set_fee_collector
set_orchestrator
rollback_tx
finalize_tx
sign_psbt
manually_transfer

**Query:**
### get_fee_collector
```md title="get_fee_collector() -> Pubkey"
Returns:
Pubkey:
```

### list_pools
```md title="list_pools() -> Vec<PoolMeta>"
Returns:
Vec<PoolMeta>:
```

### find_pool
```md title="find_pool(pool_key: Pubkey) -> Option<LiquidityPoolWithState>"
Returns:
Option<LiquidityPoolWithState>:
```

### pre_extract_fee
```md title="pre_extract_fee(pool_key: Pubkey) -> Result<ExtractFeeOffer, ExchangeError>"
Returns:
Result<ExtractFeeOffer, ExchangeError>:
```

### get_lp
```md title="get_lp(pool_key: Pubkey, user_addr: String) -> Result<Liquidity, ExchangeError>"
Returns:
Result<Liquidity, ExchangeError>:
```

### pre_withdraw_liquidity
```md title="pre_withdraw_liquidity(pool_key: Pubkey, user_addr: String, btc: CoinBalance) -> Result<WithdrawalOffer, ExchangeError>"
Returns:
Result<WithdrawalOffer, ExchangeError>:
```

### pre_add_liquidity
```md title="pre_add_liquidity(pool_key: Pubkey, side: CoinBalance) -> Result<LiquidityOffer, ExchangeError>"
Returns:
Result<LiquidityOffer, ExchangeError>:
```

### pre_swap
```md title="pre_swap(id: Pubkey, input: CoinBalance) -> Result<SwapOffer, ExchangeError>"
Returns:
Result<SwapOffer, ExchangeError>:
```


**Update:**
### create
```md title="create(rune_id: CoinId) -> Result<Pubkey, ExchangeError>"
Returns:
Result<Pubkey, ExchangeError>:
```