import React, { ReactElement } from 'react';
import { Button, Form, Input } from 'antd';
import { SearchOutlined } from '@lib/icons';
import { Help } from '../utility';

export interface InvestFilterFields {
  search: string;
}

interface Props {
  onSearch: (values: InvestFilterFields) => void;
}

export function InvestFilter({ onSearch }: Props): ReactElement {
  const [form] = Form.useForm();
  return (
    <Form form={form} onFinish={onSearch} layout="inline">
      <Form.Item>
        Search: <Help name="search" />
      </Form.Item>
      <Form.Item name="search">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" icon={<SearchOutlined />} />
      </Form.Item>
    </Form>
  );
}
