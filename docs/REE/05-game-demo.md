# REE Gaming Demo

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>Prerequisites</h3>
    <p>Welcome to the REE Gaming Demo. </p>
    <p>This workshop assumes you already understand what REE is. If you're interested, you can also try the Bitcoin Layer 1 <a href="https://docs.omnity.network/docs/REE/first-exchange">Lending Demo</a>, while the REE Gaming Demo is a Layer 2 application built on REE. The goal of this workshop is to help developers understand how Layer 2 applications can leverage REE for business logic. </p>
    <p>A simple cookie-clicker game where you earn points and withdraw them as Runes to your Bitcoin wallet. Here’s how it works:</p>
    <p>1. Sign in to ICP via SIWB and deposit BTC into the game.</p>
    <p>2. Click the cookie to earn points—the more you click, the higher your score.</p>
    <p>3. Withdraw your points as Runes directly to your Bitcoin wallet once you’ve collected enough.</p>
    <h5>Key Technical Components:</h5>
    <p>1. <a href="https://github.com/AstroxNetwork/ic-siwb">SIWB</a> (Sign-In with Bitcoin) authentication for ICP login.</p>
    <p>2. Fast BTC deposits (Layer 2 integration) on <a href="https://www.omnity.network/ree">REE</a>.</p>
    <p>3. Game logic (cookie-clicker mechanics & point system)</p>
    <p>4. Runes withdrawal (converting points into Bitcoin Runes)</p>
    <p>Let’s get started!</p>
    <h5>Download + Create a Canister</h5>
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
              <p>Install Rust: https://www.rust-lang.org/tools/install</p>
              <p>Install dfx: https://internetcomputer.org/docs/building-apps/getting-started/install</p>
              <p>dfx new --type rust --frontend react ree-workshop</p>
              </code>
    </pre>
    <p>See the repository structure on the right</p>
  </div>

  <div style={{ flex: 1 }}>
      <TabItem value="source" label="Source" default>
       <Tabs>
          <TabItem value="source" label="Source" default>
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
                <p>./ree-workshop </p>
                <p>.├── src</p>
                <p>.│   ├── ree-workshop-backend # Backend Canister project (Rust)</p>
                <p>.│   └── ree-workshop-frontend # Frontend project (React)</p>
                <p>.├── dfx.json                 # Dfx configuration file</p>
                <p>.└── ...                      # Other configuration files</p>
              </code>
            </pre>
          </TabItem>
          </Tabs>
      </TabItem>
  </div>
</div>