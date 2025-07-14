# Implement REE Exchange Methods

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>实现标准的Exchange方法</h3>
    <p>An Exchange canister interacting with a framework like REE usually needs to implement a standard set of interface methods. The five required methods mentioned are: </p>
    <p>get_pool_list</p>
    <p>get_pool_info</p>
    <p>rollback_tx</p>
    <p>new_block</p>
    <p>execute_tx</p>
  </div>

  <div style={{ flex: 1 }}>
      <TabItem value="source" label="Source" default>
        <Tabs>
          <TabItem value="exchange" label="exchange.rs" default>
          <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              <code>
                {`
#[query]
pub fn get_pool_list() -> GetPoolListResponse {
    let address = read_state(|s| s.address.clone().unwrap());
    vec![PoolBasic {
        name: "REE_WORKSHOP".to_string(),
        address,
    }]
}
#[query]
pub fn get_pool_info(args: GetPoolInfoArgs) -> GetPoolInfoResponse {
    let pool_address = args.pool_address;
    read_state(|es| match es.last_state() {
        Ok(last_state) => pool_address
            .eq(&es.address.clone().unwrap())
            .then_some(PoolInfo {
                key: es.key.clone().unwrap(),
                key_derivation_path: vec![es.key_path.clone().into_bytes()],
                name: es.rune_name.clone(),
                address: es.address.clone().unwrap(),
                nonce: last_state.nonce,
                coin_reserved: es
                    .rune_id
                    .map(|rune_id| {
                        vec![CoinBalance {
                            id: rune_id,
                            value: last_state.utxo.maybe_rune.unwrap().value,
                        }]
                    })
                    .unwrap_or(vec![]),
                btc_reserved: last_state.btc_balance(),
                utxos: vec![last_state.utxo],
                attributes: "".to_string(),
            }),
        Err(_) => {
            return None;
        }
    })
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
      </TabItem>
  </div>
</div>