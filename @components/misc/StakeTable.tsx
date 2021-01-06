import React, { ReactElement } from 'react';

import { getNavToStake } from '@lib';
import { Descriptions, Space } from 'antd';

export function StakeTable(): ReactElement {
  return (
    <Descriptions title="Stake table" bordered size="small" column={1}>
      {getNavToStake().map((item, key) => (
        <Descriptions.Item
          label={item.to === Infinity ? `${item.from} USD or more` : `${item.from} to ${item.to} USD`}
          key={key}
        >
          {item.absolute ? `${item.absolute} USD flat` : `${item.relative * 100} %`}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}
