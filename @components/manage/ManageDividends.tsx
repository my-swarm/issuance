import React, { ReactElement, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { Button, Form, Input, InputNumber, Radio, Space } from 'antd';

import { useAppState, useContractAddress, useDispatch, useEthers } from '@app';
import { useTokenHoldersQuery } from '@graphql';
import { bnRatio, getContractAbi, parseAddressesInput, parseUnits, sameAddress, tokenBalance } from '@lib';
import { Help, Loading } from '..';

type FormData = {
  type: 'eth' | 'erc20';
  from: string;
  amount: number;
  tokenAddress?: string;
  addresses: string;
};

export function ManageDividends(): ReactElement {
  const [assetType, setAssetType] = useState('eth');
  const [{ onlineToken }] = useAppState();
  const { address: myAddress, signer, block } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const { disperse: disperseAddress } = useContractAddress();
  const { loading, error, data } = useTokenHoldersQuery({
    variables: { token: onlineToken.id },
  });
  const [form] = Form.useForm();
  if (loading || !data) return <Loading />;
  const { token } = data;
  const { holders } = token;

  const handleSubmit = async (data: FormData) => {
    const tokenContract =
      data.type === 'erc20' ? new Contract(data.tokenAddress, getContractAbi('erc20'), signer) : null;
    const decimals = tokenContract ? await tokenContract.decimals() : 18;

    data.addresses.split('\n');
    const addresses = parseAddressesInput(data.addresses, (meta) => parseFloat(meta[0]));
    const sum = Object.values(addresses).reduce((sum, x) => sum + x, 0);
    const recipients = Object.keys(addresses);
    const values = Object.values(addresses).map((ratio) => parseUnits((ratio / sum) * data.amount, decimals));
    const sumUnits = values.reduce((sum = BigNumber.from(0), x) => sum.add(x));

    if (data.type === 'eth') {
      dispatchTransaction({
        method: 'disperse.disperseEther',
        args: [recipients, values],
        description: 'Distributing Eth',
        overrides: {
          value: sumUnits,
        },
      });
    } else {
      dispatchTransaction({
        address: data.tokenAddress,
        method: 'erc20.approve',
        args: [disperseAddress, parseUnits(data.amount, decimals)],
        description: 'Approving spending of the token',
        onSuccess: () => {
          dispatchTransaction({
            method: 'disperse.disperseToken',
            args: [data.tokenAddress, recipients, values],
            description: 'Distributing Token',
          });
        },
      });
    }
  };

  const handleFillAddressesFromHolders = () => {
    const validHolders = holders.filter(
      (holder) => holder.address !== AddressZero && !sameAddress(holder.address, myAddress),
    );
    let sum = BigNumber.from(0);
    for (const holder of validHolders) sum = sum.add(tokenBalance(block, token, holder.balance));
    const addresses = sum.eq(0)
      ? ''
      : validHolders
          .map((holder) => `${holder.address},${bnRatio(tokenBalance(block, token, holder.balance), sum)}`)
          .join('\n');
    form.setFieldsValue({ addresses });
  };

  const initialValues = {
    type: 'eth',
    amount: 0,
    tokenAddress: null,
    from: myAddress,
    addresses: '',
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
        <Form.Item name="type" label="Asset type">
          <Radio.Group onChange={(e) => setAssetType(e.target.value)}>
            <Radio value="eth">Ether</Radio>
            <Radio value="erc20">ERC20 Token</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="tokenAddress" label="Token address" hidden={assetType !== 'erc20'}>
          <Input />
        </Form.Item>
        <Form.Item name="from" label="From address">
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount to distribute"
          rules={[{ required: true, message: 'Amount is required' }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="addresses"
          rules={[{ required: true, message: 'The list is required' }]}
          label={
            <Space>
              <span>List of Receivers</span>
              <Help name="distributeInput" />
              <Button type="link" size="small" onClick={handleFillAddressesFromHolders}>
                Load token holders
              </Button>
            </Space>
          }
        >
          <Input.TextArea rows={8} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Distribute
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
