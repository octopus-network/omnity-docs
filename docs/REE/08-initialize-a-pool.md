# Initialize A Pool

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: 1 }}>
    <h3>初始pool</h3>
    <p>test_key_1可以在主网上用/只是费用不同，低1/3， 和test_key_1没有额外备份</p>
  </div>

  <div style={{ flex: 1 }}>
    <Tabs>
      <TabItem value="source" label="Source" default>
        <Tabs>
          <TabItem value="toml" label="Cargo.toml" default>
           代码1
          </TabItem>
          <TabItem value="lib" label="lib.rs">
            代码2
          </TabItem>
        </Tabs>
      </TabItem>
      <TabItem value="solution" label="Solution">
        <Tabs>
          <TabItem value="state" label="state.rs" default>
            代码3
          </TabItem>
          <TabItem value="lib" label="lib.rs">
            代码4
          </TabItem>
        </Tabs>
      </TabItem>
    </Tabs>
  </div>
</div>