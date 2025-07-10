# Define Pool State

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: 1 }}>
    <h3>定义Pool</h3>
    <p>管理 pool state</p>
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
            pub enum UserAction
          </TabItem>
          <TabItem value="lib" label="lib.rs">
            代码4
          </TabItem>
        </Tabs>
      </TabItem>
    </Tabs>
  </div>
</div>