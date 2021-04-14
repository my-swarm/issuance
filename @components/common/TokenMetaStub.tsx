import React, { ReactElement } from 'react';
import { Form, Input } from 'antd';
import { SingleFileUpload } from '..';
import { tokenFormRules as rules } from '../token/tokenFormRules';

export function TokenMetaStub(): ReactElement {
  return (
    <>
      <Form.Item name="image" label="Image/logo" rules={rules.image}>
        <SingleFileUpload image />
      </Form.Item>
      <Form.Item name="description" label="Token description">
        <Input.TextArea rows={5} />
      </Form.Item>
    </>
  );
}
