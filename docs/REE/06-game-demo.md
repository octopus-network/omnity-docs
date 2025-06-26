# REE Gaming Demo

<!-- import Ting from '../../src/components/Ting'; -->

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: 1 }}>
    <h3>初始</h3>
    <p>欢迎来到REE Gaming Demo，这个Workshop的前提你己经了解REE是什么，如果有兴趣也可以试下Bitcoin一层应用的Lending Demo, 而REE Gaming Demo是基于REE的二层应用。</p>
    <p>工具： RUST+DFX </p>
    <p>dfx new 但无前端 </p>
    <p>repo结构 </p>
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