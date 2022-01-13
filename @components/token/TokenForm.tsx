import React, { ReactElement, useMemo, useState } from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Store } from 'rc-field-form/lib/interface';

import { LocalToken } from '@lib';
import { tokenFormRules as rules } from './tokenFormRules';
import { AssetFormStub, Fieldset, HelpLabel, TokenMetaStub } from '..';
import { devDefaultToken, isDev } from '@app';
import dayjs from 'dayjs';
import { range } from 'lodash';

interface TokenFormProps {
  onCancel: () => void;
  onSubmit: (token: LocalToken) => void;
  formData?: LocalToken;
}

const defaultToken = isDev ? devDefaultToken : ({ decimals: 18 } as LocalToken);

const disabledTime = (date) => {
  const now = dayjs();
  return date.isSame(now, 'day')
    ? {
        disabledHours: () => range(0, parseInt(now.format('HH'))),
        disabledMinutes: () => (date.format('HH') === now.format('HH') ? range(0, parseInt(now.format('mm'))) : []),
      }
    : {};
};

export function TokenForm({ onCancel, onSubmit, formData = defaultToken }: TokenFormProps): ReactElement {
  const [allowUnlimitedSupply, setAllowUnlimitedSupply] = useState<boolean>(formData?.allowUnlimitedSupply || false);
  const [allowAutoburn, setAllowAutoburn] = useState<boolean>(formData?.allowAutoburn || false);
  const [form] = Form.useForm();
  const isNew = !formData?.id;

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (token: Store) => {
    onSubmit(token as LocalToken);
  };

  const handleToggleAllowUnlimitedSupply = (e: CheckboxChangeEvent) => {
    setAllowUnlimitedSupply(e.target.checked);
  };

  const handleToggleAllowAutoburn = (e: CheckboxChangeEvent) => {
    setAllowAutoburn(e.target.checked);
  };

  const formDataProcessed = useMemo(
    () => ({ ...formData, autoburnTs: formData.autoburnTs ? dayjs(formData.autoburnTs) : undefined }),
    [formData],
  );

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      onReset={handleCancel}
      layout="vertical"
      initialValues={formDataProcessed}
    >
      <Fieldset legend="Token basics">
        <Form.Item name="name" label="Token name" rules={rules.name}>
          <Input placeholder="Your token name" />
        </Form.Item>
        <Row gutter={16}>
          <Col lg={12}>
            <Form.Item name="symbol" label="Symbol" rules={rules.symbol} normalize={(x) => x.toUpperCase()}>
              <Input placeholder="XXX" />
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item name="decimals" label="Decimals (keep 18 if not sure)" rules={rules.decimals}>
              <InputNumber min={0} max={36} placeholder="18" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <TokenMetaStub />
      </Fieldset>

      <Fieldset legend="Token supply">
        <p>
          Set the maximum possible number of tokens that can ever be minted. The actual initial supply is decided when
          you mint your tokens later.
        </p>
        <Space size="large">
          <Form.Item
            name="totalSupply"
            rules={[
              {
                required: !allowUnlimitedSupply,
                message: 'Enter maximum supply or check unlimited',
              },
            ]}
          >
            <InputNumber disabled={allowUnlimitedSupply} />
          </Form.Item>
          <Form.Item name="allowUnlimitedSupply" valuePropName="checked">
            <Checkbox onChange={handleToggleAllowUnlimitedSupply}>Unlimited total supply</Checkbox>
          </Form.Item>
        </Space>
      </Fieldset>

      <Fieldset legend="Token features">
        <Form.Item>
          <Form.Item name="allowTransferRules" className="no-margin" valuePropName="checked">
            <Checkbox>
              <HelpLabel name="allowTransferRules" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowAccountFreeze" className="no-margin" valuePropName="checked">
            <Checkbox>
              <HelpLabel name="allowAccountFreeze" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowContractFreeze" className="no-margin" valuePropName="checked">
            <Checkbox>
              <HelpLabel name="allowContractFreeze" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowForceTransfer" className="no-margin" valuePropName="checked">
            <Checkbox>
              <HelpLabel name="allowForceTransfer" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowBurn" className="no-margin" valuePropName="checked">
            <Checkbox>
              <HelpLabel name="allowBurn" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowAutoburn" className="no-margin" valuePropName="checked">
            <Checkbox onChange={handleToggleAllowAutoburn}>
              <HelpLabel name="allowAutoburn" />
            </Checkbox>
          </Form.Item>
        </Form.Item>
      </Fieldset>

      {allowAutoburn && (
        <Fieldset legend="Automatic Token Burn">
          <Form.Item name="autoburnTs" label="Automatic burn date and time (UTC)">
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              disabledDate={(date) => date.isBefore(dayjs(), 'day')}
              disabledTime={disabledTime}
            />
          </Form.Item>
          <p className="note">Note: The time you enter</p>
        </Fieldset>
      )}

      <Fieldset legend="Asset details">
        <p>Define your asset, it&apos;s value and other information in detail.</p>
        <AssetFormStub />
      </Fieldset>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {isNew ? 'Create Token' : 'Save Token Changes'}
          </Button>
          <Button htmlType="reset">Cancel</Button>
        </Space>
      </Form.Item>
      <p className="note">
        Note: Submitting this form <strong>does not deploy the token</strong>, only saves it on your computer to deploy
        later.
      </p>
    </Form>
  );
}
