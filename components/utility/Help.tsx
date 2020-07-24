import React from 'react';
import * as help from '@help';
import { Popover } from 'antd';
import { QuestionCircleTwoTone as HelpIcon } from '@ant-design/icons/lib/icons';

interface HelpProps {
  name: string;
}

export function Help({ name }: HelpProps): React.ReactElement {
  return (
    <Popover className="c-help" title={help[name].title} content={help[name].content} placement="top">
      <HelpIcon />
    </Popover>
  );
}
