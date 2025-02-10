---
sidebar_position: 3
---

# Build[WIP]
Knowledge of REE:
* A transaction cannot involve more than 3 exchanges.
* There are multiple exchanges in REE. The maximum number of liquidity pools per exchange is 100, and each pool can only contain one token pair.

Best practices for Exchange developers:
* There are three REE update methods: removing PSBT, finding transactions, and rolling back transactions. These methods do not modify the exchange states.
* Other methods do not modify the pool state.

## Tutorial
### Prerequisites
### Building Your First Exchange

## APIs
**Query:**
### get_settings
```md title="get_settings() -> OrchestratorSettings"
Returns:
OrchestratorSettings: struct containing:
```
### get_registered_exchanges
```md title="get_registered_exchanges() -> Vec<ExchangeMetadata>"
Returns:
Vec<ExchangeMetadata>: struct containing:
```

### get_exchange_pools
```md title="get_exchange_pools() -> Vec<ExchangePool>"
Returns:
Vec<ExchangePool>: struct containing:
```

### get_mempool_tx_fee_rate
Retrieve the fee rate data from mempool
```md title="get_mempool_tx_fee_rate() -> MempoolTxFeeRateView"
Returns:
MempoolTxFeeRateView: struct containing:
```

### get_recommended_tx_fee_per_vbyte
```md title="get_recommended_tx_fee_per_vbyte(maybe_pool_id: Option<String>) -> u64"
Returns:
u64: 
```

### get_tx_queue_of_pool
```md title="get_tx_queue_of_pool(pool_key: Pubkey) -> Vec<(String, Option<Option<u32>>)>"
Returns:
Vec<(String, Option<Option<u32>>)>: 
```

### get_zero_confirmed_tx_count_of_pool
```md title="get_zero_confirmed_tx_count_of_pool(pool_key: Pubkey) -> u32"
Returns:
u32: 
```

### get_tx_sent
```md title="get_tx_sent(tx_id: String) -> Option<TxDetailView>"
Returns:
Option<TxDetailView>: struct containing:
```
不明
### get_tx_for_outpoint
```md title="get_tx_for_outpoint(outpoint: String) -> Option<TxDetailView>"
Returns:
Option<TxDetailView>: struct containing:
```

### get_zero_confirmed_utxos_of_address
```md title="get_zero_confirmed_utxos_of_address(address: String) -> Vec<String>"
Returns:
Vec<String>:
```

### get_zero_confirmed_txs
```md title="get_zero_confirmed_txs(maybe_pool_key: Option<String>) -> Vec<String>"
Returns:
Vec<String>:
```

### get_received_blocks
```md title="get_received_blocks(max_count: Option<u32>,show_tx_list: Option<bool>) -> Vec<ReceivedBlockView>"
Returns:
Vec<ReceivedBlockView>:
```

### get_rejected_txs
```md title="get_rejected_txs(max_count: Option<u32>) -> Vec<RejectedTxView>"
Returns:
Vec<RejectedTxView>:
```

### get_failed_invoke_log
```md title="get_failed_invoke_logs(maybe_tx_id: Option<String>) -> Vec<(String, InvokeLogView)> "
Returns:
Vec<(String, InvokeLogView)>:
```

### get_invoke_args_of_failed_invoke
```md title="get_invoke_args_of_failed_invoke(tx_id: String) -> Option<InvokeArgs>"
Returns:
Option<InvokeArgs>:
```

### get_sign_psbt_args_of_failed_invoke
```md title="get_sign_psbt_args_of_failed_invoke(tx_id: String, step: usize) -> Option<SignPsbtArgs>"
Returns:
Option<SignPsbtArgs>:
```

### get_last_sent_txs
```md title="get_last_sent_txs(max_count: Option<u32>) -> Vec<(String, String, Option<u32>)> "
Returns:
Vec<(String, String, Option<u32>)>:
```

### get_used_outpoints
```md title="get_used_outpoints() -> Vec<(String, String)> "
Returns:
Vec<(String, String)>:
```

get_latency_logs




**Update:**
set_bitcoin_network
set_ord_canister_id
set_mempool_connector_principal
set_tx_fee_per_vbyte
register_exchange
remove_tx_from_pool
remove_tx_detail
save_included_block_for_tx
clear_last_block
new_block_detected
reject_tx
clear_finalized_txs
rollback_tx_for_pool
unhalt_exchange
clean_failed_invoke_logs
clean_tx_queue_for_pools
pause_invoke
resume_invoke
get_canister_info

### invoke
```md title="invoke(args: InvokeArgs) -> Result<String, InvokeError>"
Returns:
Result<String, InvokeError>:
```