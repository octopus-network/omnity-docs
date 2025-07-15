# Store Pool Data

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>Store pool data</h3>
    <p>We need a persistent way to store all the created Pool instances, ensuring data survives canister upgrades. The IC provides StableBTreeMap for this purpose.</p>
    <h5>Key points:</h5>
    <ul style={{listStyleType: 'disc', paddingLeft: '20px', margin: '0'}}>
      <li>ExchangeState is declared as a static RefCell containing a StableBTreeMap.</li>
      <li>This map uses the Pool's address (String) as the key and the Pool struct as the value.</li>
      <li>It is initialized using memory obtained from a MEMORY_MANAGER (typically defined using thread_local!), ensuring the data resides in stable memory.</li>
    </ul>
  </div>

   <div style={{ flex: 1 }}>
      <TabItem value="source" label="Source" default>
        <Tabs>
          <TabItem value="memory" label="memory.rs" default>
          <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'scroll',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              <code>
                {`
const STATE_MEMORY_ID: MemoryId = MemoryId::new(0);
const TX_RECORDS_MEMORY_ID: MemoryId = MemoryId::new(1);
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static STATE: RefCell<Cell<Option<ExchangeState>, Memory>> = RefCell::new(Cell::init(MEMORY_MANAGER.with(|m| m.borrow().get(STATE_MEMORY_ID)), None).expect("state memory not initialized"));
    static TX_RECORDS: RefCell<StableBTreeMap<(Txid, bool), TxRecord, Memory>> = RefCell::new(StableBTreeMap::init(MEMORY_MANAGER.with(|m| m.borrow().get(TX_RECORDS_MEMORY_ID)))
    );
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
      </TabItem>
  </div>
</div>