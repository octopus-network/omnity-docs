# Implement The Game Functions

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>Workflow</h3>
     <ul style={{listStyleType: 'disc', paddingLeft: '20px', margin: '0'}}>
      <li><strong>init</strong>: Initialize a pool with no gamers and no UTXOs.</li>
      <li><strong>get_exchange_state</strong>: Fetch the current pool state to verify the data.</li>
      <li><strong>get_chain_key_btc_address</strong>: Get the pool’s BTC address for sending the registration fee.</li>
      <li><strong>get_game_and_gamer_infos</strong>: Fetch the current game and gamer status to determine the next move.</li>
      <li><strong>get_register_info</strong>: Retrieve the registration fee required for a new gamer to join.</li>
      <li><strong>end_game</strong>: End the game.</li>
      <li><strong>withdraw</strong>: Withdraw the total amount of Runes tokens (cookies).</li>
    </ul>
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
fn get_exchange_state() -> ExchangeState {
    read_state(|s| s.clone())
}
#[query]
fn get_chain_key_btc_address() -> String {
    read_state(|es| es.address.clone())
}
#[query]
pub fn get_game_and_gamer_infos(gamer: Address) -> GameAndGamer {
    read_state(|es| {
        let game = es.game.clone();
        let gamer_info = es.game.gamer.as_ref().and_then(|g| g.get(&gamer)).cloned();
        GameAndGamer {
            game_duration: game.game_duration,
            game_start_time: game.game_start_time,
            gamer_register_fee: game.gamer_register_fee,
            claim_cooling_down: game.claim_cooling_down,
            cookie_amount_per_claim: game.cookie_amount_per_claim,
            max_cookies: game.max_cookies,
            claimed_cookies: game.claimed_cookies,
            gamer: gamer_info,
        }
    })
}
#[query]
pub fn get_register_info() -> RegisterInfo {
    read_state(|es| {
        let untweaked_key = es.key.clone();
        let address = es.address.clone();
        let utxo = es.states.last().and_then(|s| s.utxo.clone());
        let register_fee = es.game.gamer_register_fee;
        let nonce = es.states.last().map_or(0, |s| s.nonce);
        RegisterInfo {
            untweaked_key,
            address,
            utxo,
            register_fee,
            nonce,
        }
    })
}
#[query]
pub fn get_pool_list() -> GetPoolListResponse {
    let address = read_state(|s| s.address.clone());
    vec![PoolBasic {
        name: "REE_COOKIE".to_string(),
        address,
    }]
}
#[update]
async fn end_game() {
    mutate_state(|s| {
        s.game.is_end = true;
        s.game_status = s.game_status.end();
    });
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
      </TabItem>
  </div>
</div>