import React, { ReactElement } from 'react';
import * as help from '@help';
import { Space } from 'antd';
import { Help } from '@components';

interface HelpLabelProps {
  name: string;
}

export function HelpLabel({ name }: HelpLabelProps): ReactElement {
  if (!help[name]) throw new Error(`Help not found: ${name}`);
  return (
    <Space>
      <span>{help[name].shortTitle || help[name].title}</span>
      <Help name={name} />
    </Space>
  );
}
