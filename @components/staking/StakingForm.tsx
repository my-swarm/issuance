import React, { ReactElement } from 'react';
import { Form, Input, Button } from 'antd';
import { useFeeInfo, useAppState } from '@app';
import { formatUnits } from '@lib';
import { Box } from '../utility';

export interface StakingFormData {
  supply: string;
}

interface Props {
  value?: number;
  onSubmit: (data: StakingFormData) => void;
}

export function StakingForm({ value, onSubmit }: Props): ReactElement {
  const [{ onlineToken: token }] = useAppState();
  const [form] = Form.useForm();
  const { lowSwmBalance } = useFeeInfo(value);

  const maxSupply = parseFloat(formatUnits(token.maxSupply, token.decimals));
  const normalizeSupply = (x) => {
    const supply = parseFloat(x);
    return maxSupply === 0 ? supply || '' : Math.min(maxSupply, supply) || '';
  };

  return (
    <Box>
      <Form form={form} onFinish={onSubmit} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="Maximum supply">
          <strong>{maxSupply === 0 ? 'unlimited' : `${maxSupply} ${token.symbol}`}</strong>
        </Form.Item>
        <Form.Item
          name="supply"
          label="Initial supply"
          normalize={normalizeSupply}
          rules={[{ required: true, message: 'Enter initial supply' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button htmlType="submit" type="primary" size="large" disabled={lowSwmBalance}>
            Mint Tokens
          </Button>
        </Form.Item>
      </Form>
    </Box>
  );
}
