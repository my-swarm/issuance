import React, { ReactElement } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { HelpLabel, MultipleFilesUpload, SingleFileUpload } from '..';

export function AssetFormStub(): ReactElement {
  return (
    <>
      <Form.Item name="assetName" label="Asset Name">
        <Input />
      </Form.Item>

      <Form.Item name="assetNetValue" label={<HelpLabel name="assetNetValue" />}>
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
