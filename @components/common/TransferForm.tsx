import React, { ReactElement, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space, Descriptions } from 'antd';
import { Address, Box, VSpace } from '@components';
import { formatUnits, parseUnits } from '@lib';
import { useDispatch, useEthers } from '@app';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { TokenInfoFragment } from '@graphql';

interface TransferFormProps {
  token: TokenInfoFragment;
  type?: 'normal' | 'forced';
  from?: string;
  currentBalance: BigNumberish;
  onSuccess: () => void;
}

export function TransferForm({
  token,
  type = 'normal',
  from,
  currentBalance,
  onSuccess,
}: TransferFormProps): ReactElement {
  const { dispatchTransaction } = useDispatch();
  const { address } = useEthers();
  const [form] = Form.useForm();

  if (from === undefined) from = address;
  if (typeof currentBalance !== 'number')
    currentBalance = parseFloat(formatUnits(BigNumber.from(currentBalance), token.decimals));

  const handleTransfer = async (values) => {
    const method = type === 'normal' ? 'transfer' : 'transferForced';
    const { to, amount } = values;
    const amountBn = parseUnits(amount, token.decimals);
    const args = method === 'transfer' ? [to, amountBn] : [from, to, amountBn];
    const description =
      method === 'transfer'
        ? `Transfering ${amount} ${token.symbol} to ${to}`
        : `Transfering ${amount} ${token.symbol} from ${from} to ${to}`;
    dispatchTransaction({
      method: `src20.${method}`,
      address: token.address,
      arguments: args,
      description,
      onSuccess: () => {
        form.resetFields();
        onSuccess();
      },
    });
  };

  return (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="From your account">
          <Address>{from}</Address>
        </Descriptions.Item>
        <Descriptions.Item label="Current balance">
          <strong>{currentBalance}</strong> {token.symbol}
        </Descriptions.Item>
      </Descriptions>

      <VSpace />

      <Box>
        <Form
          form={form}
          onFinish={handleTransfer}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item name="to" label="To address">
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount">
            <InputNumber min={0} max={currentBalance} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }} className="mb-0">
            <Button type="primary" htmlType="submit">
              Transfer
            </Button>
          </Form.Item>
        </Form>
      </Box>

      <VSpace />
    </>
  );
}
