# Initialize A Pool

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>初始Pool</h3>
    <p>值得说明的是相比于key_1，test_key_1可以在主网上用，只是费用不同，低1/3， 没有额外备份， On the mainnet, Chain Key signing can use either test_key_1 or key_1, which differ in security level and cost.You can choose to use test_key_1 for your own test canister to save costs. If the number of signatures is small, the savings will be limited — about $0.02 saved per signature.https://internetcomputer.org/docs/references/t-sigs-how-it-works/#fees-for-the-t-schnorr-test-key</p>
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
#[update]
async fn init(
    game_duration: Seconds,
    game_start_time: SecondTimestamp,
    gamer_register_fee: Satoshi,
    claim_cooling_down: Seconds,
    cookie_amount_per_claim: u128,
    max_cookies: u128,
    orchestrator: Principal,
    ii_canister: Principal,
) -> Result<(), String> {
    let rune_id = CoinId::rune(840000, 846);
    let (untweaked, _tweaked, addr) = request_ree_pool_address(
        "key_1",
        vec![rune_id.to_string().as_bytes().to_vec()],
        Network::Testnet4,
    )
    .await?;
    let init_game = Game {
        game_duration,
        game_start_time,
        gamer_register_fee,
        claim_cooling_down,
        cookie_amount_per_claim,
        max_cookies,
        claimed_cookies: 0,
        gamer: None,
    };
    let init_state = ExchangeState {
        states: vec![],
        key: untweaked,
        address: addr.to_string(), //tocheck
        game: init_game,
        orchestrator,
        ii_canister,
        address_principal_map: None,
        game_status: GameStatus::Init,
    };
    set_state(init_state);
    Ok(())
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
      </TabItem>
  </div>
</div>