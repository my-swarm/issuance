import React, { ReactElement, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Popover, Space, Radio, Upload } from 'antd';
import { Store } from 'rc-field-form/lib/interface';

import { Token, TransferRestrictionsTypes } from '@types';
import { tokenFormRules as rules } from './rules';
import { Help, HelpLabel, SingleFileUpload, MultipleFilesUpload } from '@components';

interface EditFormProps {
  onCancel: () => void;
  onSubmit: (token: Token) => void;
  formData?: Token;
}

const sampleFormData: Token = {
  id: 'xxx-yyy',
  name: 'New Token',
  symbol: 'NWT',
  decimals: 18,
  description: 'Completely new token',
  initialSupply: 1000000,
  transferRestrictionsType: TransferRestrictionsTypes.Whitelist,
  allowAccountFreeze: true,
  allowContractFreeze: false,
  allowForceTransfer: false,
  allowBurn: true,
  allowMint: false,
  assetName: 'Luxury Mediterranean Condo',
  assetDescription: 'Love my condo',
};

export function TokenForm({ onCancel, onSubmit, formData = sampleFormData }: EditFormProps): ReactElement {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (token: Store) => {
    onSubmit(token as Token);
  };

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [formData]);

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical">
      <h3>Token basics</h3>
      <Form.Item name="name" label="Token name" rules={rules.name}>
        <Input placeholder="Your token name" />
      </Form.Item>
      <Form.Item name="symbol" label="Symbol" rules={rules.symbol}>
        <Input placeholder="XXX" />
      </Form.Item>
      <Form.Item name="decimals" label="Decimals" rules={rules.decimals}>
        <InputNumber min={0} max={36} placeholder="18" />
      </Form.Item>
      <Form.Item name="initialSupply" label="Initial Supply" rules={rules.decimals}>
        <InputNumber min={0} placeholder="Gazillion" />
      </Form.Item>
      <Form.Item name="image" label="Image/logo" rules={rules.image}>
        <SingleFileUpload image />
      </Form.Item>
      <Form.Item name="description" label="Token description">
        <Input.TextArea rows={5} />
      </Form.Item>
      <h3>Tranfer restrictions</h3>

      <div style={{ marginBottom: '1rem' }}>
        <Space>
          Select how do you wanna restrict token transfers
          <Help name="transferRestrictions" />
        </Space>
      </div>

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

      <h3>Token features</h3>
      <Form.Item>
        <Form.Item name="allowAccountFreeze" valuePropName="checked" className="no-margin">
          <Checkbox>
            <HelpLabel name="allowAccountFreeze" />
          </Checkbox>
        </Form.Item>
        <Form.Item name="allowContractFreeze" valuePropName="checked" className="no-margin">
          <Checkbox>
            <HelpLabel name="allowContractFreeze" />
          </Checkbox>
        </Form.Item>
        <Form.Item name="allowForceTransfer" valuePropName="checked" className="no-margin">
          <Checkbox>
            <HelpLabel name="allowForceTransfer" />
          </Checkbox>
        </Form.Item>
        <Form.Item name="allowBurn" valuePropName="checked" className="no-margin">
          <Checkbox>
            <HelpLabel name="allowBurn" />
          </Checkbox>
        </Form.Item>
        <Form.Item name="allowMint" valuePropName="checked" className="no-margin">
          <Checkbox>
            <HelpLabel name="allowMint" />
          </Checkbox>
        </Form.Item>
      </Form.Item>

      <h3>Asset details</h3>
      <p>Define your asset, it's value and other information in detail.</p>

      <Form.Item name="assetName" label="Asset Name">
        <Input />
      </Form.Item>

      <Form.Item name="assetNetValue" label="Net Asset Value (USD)">
        <Input />
      </Form.Item>

      <Form.Item name="assetNavDocument" label={<HelpLabel name="assetNavDocument" />}>
        <SingleFileUpload />
      </Form.Item>

      <Form.Item name="assetDescription" label={<HelpLabel name="assetDescription" />}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="assetImage" label="Asset Image">
        <SingleFileUpload image />
      </Form.Item>

      <Form.Item name="assetLegalDocuments" label="Asset Legal Documents">
        <MultipleFilesUpload />
      </Form.Item>

      <Form.Item>
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
