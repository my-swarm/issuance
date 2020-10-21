import React, { ChangeEventHandler, ReactElement, useState } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import ethers from 'ethers';

import { formatUnits } from '@lib';
import { useAppState, useContract, useEthers } from '@app';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const formTailLayout = { wrapperCol: { offset: 6, span: 18 } };

export function ManageTransfer(): ReactElement {
  const { address } = useEthers();
  const [{ token }] = useAppState();
  const [from, setFrom] = useState<string>('');
  const [errorFrom, setErrorFrom] = useState<string>();
  const [balanceFrom, setBalanceFrom] = useState<number>(0);
  const [to, setTo] = useState<string>('');
  const [errorTo, setErrorTo] = useState<string>();
  const [balanceTo, setBalanceTo] = useState<number>(0);
  const src20 = useContract('src20');
  const [form] = Form.useForm();

  const handleSetFrom = (address: string) => {
    setFrom(address);
    updateBalanceFrom(address);
  };

  const handleChangeFrom: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFrom(address);
    updateBalanceFrom(address);
  };

  const updateBalanceFrom = (address: string) => {
    try {
      address = ethers.utils.getAddress(address);
      setErrorFrom(undefined);
      src20.balanceOf(address).then((x) => setBalanceFrom(formatUnits(x, token.decimals)));
    } catch (e) {
      if (true || e.message.match(/invalid address/)) {
        setErrorFrom('Invalid address');
      }
    }
  };

  const handleSetTo = (address: string) => {
    setTo(address);
    updateBalanceTo(address);
  };

  const handleChangeTo: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTo(address);
    updateBalanceTo(address);
  };

  const updateBalanceTo = (address: string) => {
    try {
      address = ethers.utils.getAddress(address);
      setErrorTo(undefined);
      src20.balanceOf(address).then((x) => setBalanceTo(formatUnits(x, token.decimals)));
    } catch (e) {
      if (true || e.message.match(/invalid address/)) {
        setErrorTo('Invalid address');
      }
    }
  };

  const handleTransfer = async () => {
    src20.transferFromForced(from, to, 100);
  };

  let validateFrom = {};
  if (errorFrom) {
    validateFrom = {
      hasFeedback: true,
      validateStatus: 'error',
      help: errorFrom,
    };
  }

  let validateTo = {};
  if (errorTo) {
    validateTo = {
      hasFeedback: true,
      validateStatus: 'error',
      help: errorTo,
    };
  }

  return (
    <>
      <Form form={form} layout="horizontal" {...formLayout}>
        <Form.Item
          label="From address"
          {...validateFrom}
          extra={<a onClick={() => handleSetFrom(address)}>Use my account</a>}
        >
          <Input value={from} onChange={handleChangeFrom} />
        </Form.Item>
        <Form.Item label="From balance">
          <InputNumber disabled value={balanceFrom} /> {token.symbol}
        </Form.Item>

        <Form.Item label="Send to" name="to" {...validateTo}>
          <Input value={to} onChange={handleChangeTo} />
        </Form.Item>
        <Form.Item label="To balance">
          <InputNumber disabled value={balanceTo} /> {token.symbol}
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button type="primary" htmlType="submit">
            Transfer
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
