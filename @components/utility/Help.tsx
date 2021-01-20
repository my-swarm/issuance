import React, { ReactElement, ReactNode } from 'react';
import * as help from '@help';
import { Popover } from 'antd';
import { QuestionCircleTwoTone } from '@lib/icons';

interface HelpProps {
  name: string;
  type?: 'popover' | 'render';
}

export function Help({ name, type = 'popover' }: HelpProps): ReactElement {
  const helpItem = help?.[name] || { title: name, content: `No help for ${name}` };
  if (type === 'render') {
    return <div className="mb-3">{helpItem.content}</div>;
  } else {
    return (
      <Popover className="c-help" title={<strong>{helpItem.title}</strong>} content={helpItem.content} placement="top">
        <QuestionCircleTwoTone />
      </Popover>
    );
  }
}
