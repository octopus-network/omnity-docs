# Define Pool State

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>Define Pool</h3>
    <p>A Pool serves as the smallest management unit of the Exchange, representing the application's business logic. For this game's specific business definitions, please refer to the code comments.</p>
    <h3>Manage Pool State</h3>
    <p>Pool State represents the transaction state for each operation and can be used to record and rollback states. See the pool state workflow: </p>
    <img src="/img/roll_back.png" alt="roll_back" style={{width: '850px', height: 'auto'}} />
  </div>

  <div style={{ flex: 1 }}>
      <TabItem value="source" label="Source" default>
        <Tabs>
          <TabItem value="state" label="state.rs" default>
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
pub struct ExchangeState {
    pub states: Vec<PoolState>,
    pub key: Pubkey,
    pub address: String,
    pub ii_canister: Principal,
    pub orchestrator: Principal,
    pub address_principal_map: Option<BTreeMap<Principal, Address>>,
    pub game: Game,
    pub game_status: GameStatus,
}
pub struct Game {
    pub game_duration: Seconds,
    pub game_start_time: SecondTimestamp,
    pub gamer_register_fee: Satoshi,
    pub claim_cooling_down: Seconds,
    pub cookie_amount_per_claim: u128,
    pub max_cookies: u128,
    pub claimed_cookies: u128,
    pub gamer: Option<BTreeMap<Address, Gamer>>,
}
pub struct Gamer {
    pub address: String,
    pub cookies: u128,
    pub last_click_time: SecondTimestamp,
    pub is_withdrawn: bool,
}
pub enum GameStatus {
    Init,
    Play,
    AddLiquidity,
    End,
}
pub struct PoolState {
    pub id: Option<Txid>,
    pub nonce: u64,
    pub utxo: Option<Utxo>,
    pub user_action: UserAction,
}
pub enum UserAction {
    Init,
    Register(Address),
    Withdraw(Address),
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
      </TabItem>
  </div>
</div>