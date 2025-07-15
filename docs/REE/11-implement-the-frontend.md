# Implement The Frontend

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ display: 'flex', gap: '20px' }}>
  <div style={{ flex: '1 0 50%' }}>
    <h3>Implement game frontend</h3>
    <ul style={{listStyleType: 'disc', paddingLeft: '20px', margin: '0'}}>
      <li>Use <a href="https://www.npmjs.com/package/@omnisat/lasereyess">LaserEyes</a> for wallet</li>
      <li>Use <a href="https://www.npmjs.com/package/ic-siwb-lasereyes-connector">ic-siwb-lasereyes-connector</a> for authentication</li>
      <li>Construct <strong>PSBT</strong>: Constructing the PSBT currently involves some complexity, requiring developers to understand the UTXO calculation model. The specific implementation for this deposit example can be found in the repository</li>
    </ul>
    <h5 style={{ marginTop: '24px' }}>Here's the basic principle behind constructing this PSBT:</h5>
     <ul style={{listStyleType: 'disc', paddingLeft: '20px', margin: '0'}}>
      <li>A Bitcoin transaction essentially destroys a set of input UTXOs and creates a set of output UTXOs</li>
      <li>Inputs: Combine the pool's current BTC UTXO (obtained via pre_deposit) and the user's UTXO(s) used to pay for the deposit (obtained from the user's wallet).</li>
      <li>Outputs: Create new UTXOs:
One UTXO belonging to the pool, with a BTC balance increased by the deposited amount.
One UTXO belonging to the user (change), with a BTC amount equal to the user's input UTXO(s) minus the deposit amount and minus the transaction fee.</li>
      <li>This process effectively transfers the deposited BTC from the user to the pool while accounting for the network transaction fee.</li>
    </ul>
  </div>

  <div style={{ flex: '1 0 50%' }}>
   <Tabs>
          <TabItem value="register" label="register.tsx" default>
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
export function Register({
    paymentAddress,
    paymentAddressUtxos
}: {
    paymentAddress: string;
    paymentAddressUtxos: UnspentOutput[] | undefined;
}) {
    const { signPsbt } = useLaserEyes()
    const [registerTxid, setRegisterTxid] = useState<string | undefined>(undefined)
    let register = async () => {
        if (!paymentAddressUtxos) {
            return
        }
        let register_info: RegisterInfo = await cookieActor.get_register_info()
        const { address: poolAddress, output } = getP2trAressAndScript(register_info.untweaked_key);
        let recommendedFeeRate = await ocActor.get_status()
            .then((res: OrchestratorStatus) => {
                return res.mempool_tx_fee_rate.medium
            }).catch((err) => {
                console.log("get recommendedFeeRate error", err);
                throw err;
            })
        let {
            psbt,
            toSpendUtxos,
            toSignInputs,
            poolSpendUtxos,
            poolReceiveUtxos,
            txid,
            fee,
            inputCoins,
            outputCoins,
        } = await registerTx(
            {
                userBtcUtxos: paymentAddressUtxos!,
                poolBtcUtxo: convertUtxo(register_info.utxo, register_info.untweaked_key),
                paymentAddress,
                poolAddress: poolAddress!,
                feeRate: recommendedFeeRate,
                registerFee: register_info.register_fee,
            }
        )
        const psbtBase64 = psbt.toBase64();
        const res = await signPsbt(psbtBase64);
        let signedPsbtHex = res?.signedPsbtHex;
        if (!signedPsbtHex) {
            throw new Error("failed to sign psbt")
        }
        let register_txid = await ocActor.invoke({
            'intention_set': {
                tx_fee_in_sats: BigInt(fee),
                initiator_address: paymentAddress,
                intentions: [
                    {
                        action: "register",
                        exchange_id: COOKIE_EXCHANGE_ID,
                        input_coins: inputCoins,
                        pool_utxo_spend: [poolSpendUtxos],
                        pool_utxo_receive: [poolReceiveUtxos],
                        output_coins: outputCoins,
                        pool_address: register_info.address,
                        action_params: "",
                        nonce: BigInt(register_info.nonce),
                    },
                ],
            },
            psbt_hex: signedPsbtHex,
        }).then((res) => {
            if ('Err' in res) {
                throw new Error(res.Err);
            }
            return res.Ok;
        }).catch((err) => {
            console.log("invoke error", err);
            throw err;
        })
        setRegisterTxid(JSON.stringify(register_txid))
    }
    return (
        <div>
            <Button onClick={register}>register</Button>
            {/* <label>{JSON.stringify(btcUtxos)}</label> */}
            {/* <label>{psbt?.toHex()}</label> */}
            {/* <label>{JSON.stringify(registerTxid)}</label> */}
        </div>
    )
}
                `}
              </code>
            </pre>
          </TabItem>
        </Tabs>
  </div>
</div>