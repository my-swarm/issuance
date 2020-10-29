import React, { ReactElement, useState, useEffect } from 'react';
import { useAppState, useContractAddress, useDispatch, useEthers } from '@app';
import { Button, Form, Input, InputNumber, Radio, Space } from 'antd';
import { useTokenHoldersQuery } from '@graphql';
import { Loading } from '../utility';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber, Contract } from 'ethers';
import { bnRatio, formatUnits, getContractAbi, parseAddressesInput, parseUnits, sameAddress } from '@lib';

type FormData = {
  type: 'eth' | 'erc20';
  from: string;
  amount: number;
  tokenAddress?: string;
  addresses: string;
};

export function ManageDividends(): ReactElement {
  const [assetType, setAssetType] = useState('eth');
  const { address: myAddress, signer } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const { src20: src20Address, disperse: disperseAddress } = useContractAddress();
  const { loading, error, data } = useTokenHoldersQuery({
    variables: { token: src20Address },
  });
  const [form] = Form.useForm();
  if (loading || !data) return <Loading />;
  const { holders } = data.token;

  const handleSubmit = async (data: FormData) => {
    const tokenContract =
      data.type === 'erc20' ? new Contract(data.tokenAddress, getContractAbi('erc20'), signer) : null;
    const decimals = tokenContract ? await tokenContract.decimals() : 18;

    data.addresses.split('\n');
    const addresses = parseAddressesInput(data.addresses, (meta) => parseFloat(meta[0]));
    const sum = Object.values(addresses).reduce((sum, x) => sum + x, 0);
    const recipients = Object.keys(addresses);
    const values = Object.values(addresses).map((ratio) => parseUnits((ratio / sum) * data.amount, decimals));

    if (data.type === 'eth') {
      dispatchTransaction({
        method: 'disperse.disperseEth',
        arguments: [recipients, values],
        description: 'Distributing Eth',
      });
    } else {
      dispatchTransaction({
        address: data.tokenAddress,
        method: 'erc20.approve',
        arguments: [disperseAddress, parseUnits(data.amount, decimals)],
        description: 'Approving spending of the token',
        onSuccess: () => {
          dispatchTransaction({
            method: 'disperse.disperseToken',
            arguments: [data.tokenAddress, recipients, values],
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
    for (const holder of validHolders) sum = sum.add(BigNumber.from(holder.balance));
    const addresses = validHolders
      .map((holder) => {
        return `${holder.address},${bnRatio(holder.balance, sum)}`;
      })
      .join('\n');
    console.log(addresses);
    form.setFieldsValue({ addresses });
  };

  const initialValues = {
    type: 'erc20',
    amount: 100,
    tokenAddress: '0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F',
    from: myAddress,
    addresses: 'adf',
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
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="addresses"
          label={
            <Space>
              <span>List of Receivers</span>
              <Button size="small" onClick={handleFillAddressesFromHolders}>
                From token holders
              </Button>
            </Space>
          }
        >
          <Input.TextArea rows={8} />
        </Form.Item>
        <p>
          Enter CSV data with <code>receiver,ration per line</code>
        </p>
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
