import React, { ReactElement, useState, useEffect } from 'react';
import { useAppState, useContractAddress, useDispatch, useEthers, useGraphql } from '@app';
import { Button, Form, Input, InputNumber, Modal, Radio, Space, Table } from 'antd';
import { useDistrubuteQuery, useTokenHoldersQuery, useTokenSupplyQuery } from '@graphql';
import { Address, Loading } from '../utility';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber, Contract } from 'ethers';
import { bnRatio, formatUnits, getContractAbi, parseAddressesInput, parseUnits, sameAddress } from '@lib';
import { BASE_CURRENCIES } from '@const';

type FormData = {
  distributionType: 'fundraiser' | 'custom';
  amountType: 'all' | 'custom';
  from: string;
  amount: number;
  tokenAddress?: string;
  addresses: string;
};

const baseCurrency = BASE_CURRENCIES.USDC;

export function ManageDistribute(): ReactElement {
  const [distributionType, setDistributionType] = useState('fundraiser');
  const [amountType, setAmountType] = useState('fundraiser');
  const { address: myAddress, signer } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const [{ token }] = useAppState();
  const { src20: src20Address } = useContractAddress();
  const [form] = Form.useForm();
  const { reset } = useGraphql();
  const { loading, error, data } = useDistrubuteQuery({ variables: { id: src20Address } });

  if (loading || !data) return <Loading />;
  const { availableSupply, currentFundraiser: fundraiser } = data.token;
  const contributors = fundraiser?.contributors || [];

  const handleSubmit = async (data: FormData) => {
    console.log({ data });
    let amounts: BigNumber[];
    let addresses: string[];
    const amount =
      data.amountType === 'all' ? BigNumber.from(availableSupply) : parseUnits(data.amount, token.decimals);
    if (data.distributionType === 'fundraiser') {
      addresses = contributors.map((c) => c.address);
      const sum = contributors.map((c) => c.amount).reduce((a, b) => a.add(b), BigNumber.from(0));
      amounts = contributors.map((c) => BigNumber.from(c.amount).mul(amount).div(sum));
    } else {
      const parsedInput = parseAddressesInput<BigNumber>(data.addresses, (meta) => parseUnits(meta[0], token.decimals));
      addresses = Object.keys(parsedInput);
      amounts = Object.values(parsedInput);
    }

    const niceAmounts = amounts.map((x) => formatUnits(x, token.decimals));
    const niceAmount = formatUnits(amount, token.decimals);
    console.log({ amount, niceAmount, addresses, amounts, niceAmounts });
    Modal.confirm({
      title: 'Please confirm mate',
      width: 600,
      content: (
        <Table
          size="small"
          dataSource={addresses.map((address, index) => ({ key: index, address, amount: amounts[index] }))}
          pagination={null}
          columns={[
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
              render: (address) => <Address short>{address}</Address>,
            },
            {
              title: amount,
              dataIndex: 'amount',
              key: 'amount',
              render: (value) => Math.round(parseInt(formatUnits(value, token.decimals))) + ' ' + token.symbol,
            },
          ]}
        />
      ),
      onOk: () =>
        dispatchTransaction({
          method: 'src20.bulkTransfer',
          arguments: [addresses, amounts],
          description: `Distributing ${niceAmount} ${token.symbol} to ${addresses.length} accounts`,
          onSuccess: reset,
        }),
    });
  };

  const handleSetFullSupply = async () => {
    form.setFieldsValue({ amount: availableSupply });
  };

  const initialValues: FormData = {
    distributionType: 'fundraiser',
    amountType: 'all',
    amount: 0,
    tokenAddress: null,
    from: myAddress,
    addresses: '',
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
        <Form.Item name="amountType" label="Amount to distribute">
          <Radio.Group onChange={(e) => setAmountType(e.target.value)}>
            <Radio value="all">
              All available supply ({formatUnits(availableSupply, token.decimals)} {token.symbol})
            </Radio>
            <Radio value="custom">Custom amount</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="distributionType" label="Distribute to">
          <Radio.Group onChange={(e) => setDistributionType(e.target.value)}>
            <Radio value="fundraiser">Fundraiser contributors</Radio>
            <Radio value="custom">Custom address list</Radio>
          </Radio.Group>
        </Form.Item>

        {amountType === 'custom' && (
          <Form.Item name="amount" label="Custom amount to distribute">
            <InputNumber min={1} />
          </Form.Item>
        )}

        {distributionType === 'custom' && (
          <>
            <Form.Item name="addresses" label="List of Receivers">
              <Input.TextArea rows={8} />
            </Form.Item>
            <p>
              Enter CSV data with <code>&lt;address&gt;,&lt;amount&gt;</code> per line
            </p>
          </>
        )}

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
