# REE Gaming Demo

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: 2 }}>
    <h3>初始</h3>
    <p>欢迎来到REE Gaming Demo，这个Workshop的前提你己经了解REE是什么，如果有兴趣也可以试下Bitcoin一层应用的Lending Demo, 而REE Gaming Demo是基于REE的二层应用. 这个Workshop的初衷是想让开发者扩展性地了解二层应用如何利用REE来实现业务. </p>
    <p>REE Gaming Demo是一个简单的点击cookie然后获得点数，再把点数以runes的形式返回到玩家的账户。以下是流程：</p>
    <p>1. 充值BTC到游戏</p>
    <p>2. 点击cookie玩游戏来获得点数，点击越多点数越高</p>
    <p>3. 集够想要的点数可直接以runes方式提现到btc账户</p>
    <p>这是需要实现的技术点：</p>
    <p>1. 利用SIWB在BTC签登陆ICP</p>
    <p>2. 充值BTC</p>
    <p>3. runes提现</p>
    <p>事不宜迟，开始第一步</p>
    <p>下載 + 创建canister</p>
    <p>Install Rust: https://www.rust-lang.org/tools/install </p>
    <p>Install dfx: https://internetcomputer.org/docs/building-apps/getting-started/install</p>
    <p>dfx new --type rust --frontend react ree-workshop</p>
    <p>请看右边repo结构</p>
    <p>./ree-demo-exchange </p>
    <p>.├── src</p>
    <p>.│   ├── ree-demo-exchange-backend # Backend Canister project (Rust)</p>
    <p>.│   └── ree-demo-exchange-frontend # Frontend project (React)</p>
    <p>.├── dfx.json                 # Dfx configuration file</p>
    <p>.└── ...                      # Other configuration files</p>
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