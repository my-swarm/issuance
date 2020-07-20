import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Popover, Space, Radio } from 'antd';
import { QuestionCircleTwoTone as HelpIcon } from '@ant-design/icons/lib';
import * as help from '@help';
import { FORM } from '@const';
import { Token, TransferRestrictionsTypes } from '../../types';

interface EditFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  formData?: Token;
}

export function TokenForm({ onCancel, onSubmit, formData }: EditFormProps) {
  const rules = {
    name: [
      {
        required: true,
        message: 'Enter the token name',
      },
    ],
    symbol: [
      {
        required: true,
        message: 'Enter the token symbol',
      },
      {
        pattern: /[A-Z0-9]{3,5}/,
        message: `Enter 3-5 uppercase token symbol`,
      },
    ],
    transferRestrictionsType: [
      {
        required: true,
        message: 'Select transfer restriction type',
      },
    ],
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleAdd = (values: Token) => {
    onSubmit(values);
  };

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [formData]);

  return (
    <Form form={form} {...FORM.layout} onFinish={handleAdd} onReset={handleCancel}>
      <h3>Token basics</h3>
      <Form.Item name="name" label="Token name" rules={rules.name}>
        <Input />
      </Form.Item>
      <Form.Item name="symbol" label="Symbol" rules={rules.symbol}>
        <Input />
      </Form.Item>
      <h3>Tranfer restrictions</h3>
      <p>
        Select how do you wanna restrict token transfers{' '}
        <Popover title={help.transferRestrictions.title} content={help.transferRestrictions.content} placement="right">
          <HelpIcon />
        </Popover>
      </p>
      <Form.Item name="transferRestrictionsType" rules={rules.transferRestrictionsType}>
        <Radio.Group>
          <div>
            <Radio value={TransferRestrictionsTypes.None}>No transfer restrictions</Radio>
          </div>
          <div>
            <Radio value={TransferRestrictionsTypes.Whitelist}>Whitelist</Radio>
          </div>
          <div>
            <Radio value={TransferRestrictionsTypes.Graylist}>Graylist</Radio>
          </div>
        </Radio.Group>
      </Form.Item>
      <Form.Item {...FORM.tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            {formData ? 'Save Token' : 'Create Token'}
          </Button>
          <Button htmlType="reset">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
