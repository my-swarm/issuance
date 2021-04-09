import React, { ReactElement } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { HelpLabel, MultipleFilesUpload, SingleFileUpload } from '..';
import { tokenFormRules as rules } from '../token/tokenFormRules';

export function AssetFormStub(): ReactElement {
  return (
    <>
      <Form.Item name="assetName" label="Asset Name" rules={rules.assetName}>
        <Input />
      </Form.Item>

      <Form.Item name="nav" label={<HelpLabel name="nav" />} rules={rules.nav}>
        <InputNumber min={1} />
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
    </>
  );
}
