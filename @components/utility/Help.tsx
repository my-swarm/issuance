import React, { ReactElement, ReactNode } from 'react';
import * as help from '@help';
import { Popover } from 'antd';
import { QuestionCircleTwoTone as HelpIcon } from '@ant-design/icons/lib/icons';

interface HelpProps {
  name: string;
  type?: 'popover' | 'render';
}

export function Help({ name, type = 'popover' }: HelpProps): ReactElement {
  if (type === 'render') {
    return help[name].content;
  } else {
    return (
      <Popover
        className="c-help"
        title={<strong>{help[name].title}</strong>}
        content={help[name].content}
        placement="top"
      >
        <HelpIcon />
      </Popover>
    );
  }
}
