import React, { ReactElement, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber } from 'antd';

import { useAppState, useContract, useDispatch, useGraphql } from '@app';
import { Box, StakeTable, TokenInfoStaking } from '..';
import { formatUnits, parseUnits } from '@lib';

interface TokenStakeAndMintProps {
  onCancel: () => void;
}

interface FormData {
  supply: string;
}

export function TokenStakeAndMint({ onCancel }: TokenStakeAndMintProps): ReactElement {
  const [{ onlineToken: token }] = useAppState();
  const { swm, minter } = useContract();
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const { reset } = useGraphql();
  const [form] = Form.useForm();
  const [isStaked, setIsStaked] = useState<boolean>(false);

  const handleStakeAndMint = async (values: FormData) => {
    const stakeAmount = await minter.calcStake(token.nav);
    console.log('handleStakeANdMint', values, stakeAmount);

    checkAllowance('registry', swm.address, stakeAmount, () => {
      dispatchTransaction({
        method: 'minter.stakeAndMint',
        arguments: [token.address, parseUnits(values.supply, token.decimals)],
        description: 'Minting Your Token...',
        onSuccess: () => {
          reset();
          setIsStaked(true);
        },
      });
    });
  };

  const maxSupply = parseFloat(formatUnits(token.maxSupply, token.decimals));
  console.log({ token, maxSupply });

  const normalizeSupply = (x) => {
    const supply = parseFloat(x);
    return maxSupply === 0 ? supply || '' : Math.min(maxSupply, supply) || '';
  };

  return (
    <div>
      <TokenInfoStaking />

      {isStaked ? (
        <>
          <p>Your token has been minted!</p>
          <p>
            <Button onClick={onCancel}>Close</Button>
          </p>
        </>
      ) : (
        <Box>
          <Form
            form={form}
            onFinish={handleStakeAndMint}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item label="Maximum supply">
              <strong>{maxSupply === 0 ? 'unlimited' : `${maxSupply} ${token.symbol}`}</strong>
            </Form.Item>
            <Form.Item
              name="supply"
              label="Initial supply"
              normalize={normalizeSupply}
              rules={[
                { required: true, message: 'Enter initial supply' },
                // { type: 'number' },
                // ...(maxSupply === 0 ? [] : [{ max: maxSupply, message: 'Cannot exceed maximum supply' }]),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Button htmlType="submit" type="primary" size="large">
                Stake &amp; Mint
              </Button>
            </Form.Item>
          </Form>
        </Box>
      )}

      <Divider />

      <h3>How does this work</h3>
      <ul>
        <li>
          When you click the <strong>Stake &amp; Mint</strong> button, we first check (and increase if necessary) your
          SWM spending allowance. You have to sign a transaction for that.
        </li>
        <li>
          After that, the <strong>Mint</strong> function is run and the computed SWM amount is transfered from your
          wallet to the smart contract.
        </li>
      </ul>

      <h3>How is the stake amount computed</h3>
      <p>It&apos;s derived from your asset value using the table below</p>
      <StakeTable />
    </div>
  );
}
