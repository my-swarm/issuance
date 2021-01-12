import React, { ReactElement, ReactNode } from 'react';
import * as help from '@help';
import { Popover } from 'antd';
import { QuestionCircleTwoTone } from '@lib/icons';

interface HelpProps {
  name: string;
  type?: 'popover' | 'render';
}

export function Help({ name, type = 'popover' }: HelpProps): ReactElement {
  if (type === 'render') {
    return <div className="mb-3">{help[name].content}</div>;
  } else {
    return (
      <Popover
        className="c-help"
        title={<strong>{help[name].title}</strong>}
        content={help[name].content}
        placement="top"
      >
        <QuestionCircleTwoTone />
      </Popover>
    );
  }
}
