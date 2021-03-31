import React, { ReactElement } from 'react';

import { getNavToFee } from '@lib';
import { Descriptions } from 'antd';

export function FeeTable(): ReactElement {
  return (
    <Descriptions title="Fee table" bordered size="small" column={1}>
      {getNavToFee().map((item, key) => (
        <Descriptions.Item
          label={item.to === Infinity ? `${item.from} USD or more` : `${item.from} to ${item.to} USD`}
          key={key}
        >
          {item.absolute ? `${item.absolute} SWM flat` : `${item.relative * 100} %`}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}
