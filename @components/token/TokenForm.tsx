import React, { ReactElement, useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Space, Radio } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Store } from 'rc-field-form/lib/interface';

import { LocalToken, TransferRules } from '@lib';
import { tokenFormRules as rules } from './tokenFormRules';
import { Help, HelpLabel, SingleFileUpload, MultipleFilesUpload } from '@components/index';
import { devDefaultToken, isDev } from '@app';

interface TokenFormProps {
  onCancel: () => void;
  onSubmit: (token: LocalToken) => void;
  formData?: LocalToken;
}

const defaultToken = isDev ? devDefaultToken : undefined;

export function TokenForm({ onCancel, onSubmit, formData = defaultToken }: TokenFormProps): ReactElement {
  const [initialSupply, setInitialSupply] = useState<number>(formData.initialSupply || 0);
  const [showMintSection, setShowMintSection] = useState<boolean>(formData.allowMint || false);
  const [allowUnlimitedSupply, setallowUnlimitedSupply] = useState<boolean>(formData.allowUnlimitedSupply || false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (token: Store) => {
    onSubmit(token as LocalToken);
  };

  const handleToggleAdditionalMinting = (e: CheckboxChangeEvent) => {
    setShowMintSection(e.target.checked);
  };

  const handleToggleallowUnlimitedSupply = (e: CheckboxChangeEvent) => {
    setallowUnlimitedSupply(e.target.checked);
  };

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical" initialValues={formData}>
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
        <InputNumber min={0} placeholder="Gazillion" onChange={(x) => setInitialSupply(parseInt(x.toString()))} />
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
          Select if you want to be able to restrict token transfers.
          <Help name="transferRestrictions" />
        </Space>
      </div>

      <Form.Item name="transferRestrictionsType" rules={rules.transferRestrictionsType}>
        <Radio.Group>
          <div>
            <Radio value={TransferRules.None}>No transfer restrictions</Radio>
          </div>
          <div>
            <Radio value={TransferRules.WhitelistOrGreylist}>Whitelist or Greylist</Radio>
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
          <Checkbox onChange={handleToggleAdditionalMinting}>
            <HelpLabel name="allowMint" />
          </Checkbox>
        </Form.Item>
      </Form.Item>

      {showMintSection && (
        <div>
          <h3>Additional minting setup</h3>
          <p>Set the maximum possible number of tokens that can ever be minted.</p>
          <Space size="large">
            <Form.Item name="totalSupply">
              <InputNumber min={initialSupply} disabled={allowUnlimitedSupply} />
            </Form.Item>
            <Form.Item name="allowUnlimitedSupply" valuePropName="checked">
              <Checkbox onChange={handleToggleallowUnlimitedSupply}>Unlimited total supply</Checkbox>
            </Form.Item>
          </Space>
        </div>
      )}

      <h3>Asset details</h3>
      <p>Define your asset, it&apos;s value and other information in detail.</p>

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
