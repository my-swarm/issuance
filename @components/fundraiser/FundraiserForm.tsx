import React, { ReactElement, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Input, InputNumber, Button, Space, Select, Row, Col, Checkbox } from 'antd';

import { TokenFundraiser, BASE_CURRENCIES } from '@lib';
import { useEthers } from '@app';
import { Help, HelpLabel } from '..';

interface FundraiserFormProps {
  tokenName: string;
  onCancel: () => void;
  formData: TokenFundraiser;
  onSave: (values: TokenFundraiser) => void;
  onStart: (values: TokenFundraiser) => void;
  disabled: boolean;
}

const sampleFormData: TokenFundraiser = {
  label: 'Christmas fundraiser',
  baseCurrency: 'USDC',
  contributionsLocked: false,
  tokensToMint: 100000,
  tokenPrice: null,
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().add(1, 'M').format('YYYY-MM-DD'),
  softCap: 500000,
  hardCap: 1000000,
  startNow: true,
};

export function FundraiserForm({
  tokenName,
  onCancel,
  onSave,
  onStart,
  formData = sampleFormData,
  disabled = false,
}: FundraiserFormProps): ReactElement {
  const [startNow, setStartNow] = useState(sampleFormData.startNow);
  const [form] = Form.useForm();
  const [submitButton, setSubmitButton] = useState<string>();
  const { networkId, network } = useEthers();

  const handleToggleStartNow = () => {
    setStartNow(!startNow);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    values.startNow = startNow;
    if (submitButton === 'start') {
      onStart(values);
    } else {
      onSave(values);
    }
  };

  const initialValues = {
    ...formData,
    label: `${tokenName} fundraiser`,
    startDate: moment(formData.startDate),
    endDate: moment(formData.endDate),
  };

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical" initialValues={initialValues}>
      <Form.Item name="label" label="What do you want to call your fundraiser">
        <Input disabled={disabled} />
      </Form.Item>
      <Form.Item name="baseCurrency" label="Base currency">
        <Select defaultActiveFirstOption disabled={disabled}>
          {Object.entries(BASE_CURRENCIES).map(([key, currency]) => {
            const address = currency.addresses[networkId] || undefined;
            return (
              <Select.Option value={key} key={key}>
                {currency.symbol}: {address || 'unknown address'}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="contributionsLocked" valuePropName="checked">
        <Checkbox disabled={disabled}>
          <HelpLabel name="contributionsLocked" />
        </Checkbox>
      </Form.Item>

      <h3>
        Token price/supply <Help name="supplyOrPrice" />
      </h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="tokensToMint" label="Token supply to mint">
            <InputNumber
              min={1}
              step={1000}
              className="w-full"
              onChange={() => form.setFieldsValue({ tokenPrice: null })}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="tokenPrice" label="Token price (USD)">
            <InputNumber
              min={0}
              step={0.1}
              className="w-full"
              onChange={() => form.setFieldsValue({ tokensToMint: null })}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>

      <h3>Dates</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startDate"
            label={
              <Space size="large">
                <span>Start date</span>
                <Checkbox checked={startNow} onChange={handleToggleStartNow}>
                  Start now
                </Checkbox>
              </Space>
            }
          >
            <DatePicker className="w-full" disabled={disabled || startNow} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="endDate" label="End date">
            <DatePicker className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <h3>Caps</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="softCap" label="Soft Cap">
            <InputNumber min={1} step={1000} className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="hardCap" label="Hard Cap">
            <InputNumber min={1} step={1000} className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            onClick={() => setSubmitButton('start')}
            disabled={disabled}
          >
            Save and deploy now
          </Button>
          <Button htmlType="submit" size="large" onClick={() => setSubmitButton('save')} disabled={disabled}>
            Save and deploy later
          </Button>
          <Button size="large" onClick={onCancel} disabled={disabled}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
