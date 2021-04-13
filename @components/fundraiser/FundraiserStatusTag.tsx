import React, { ReactElement } from 'react';
import { FundraiserStatus } from '@graphql';
import { Tag } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined, SyncOutlined } from '../../@lib/icons';

interface Props {
  status: FundraiserStatus;
}

export function FundraiserStatusTag({ status }: Props): ReactElement {
  if (status === FundraiserStatus.Running) {
    return (
      <Tag icon={<SyncOutlined spin />} color="processing">
        {status}
      </Tag>
    );
  } else if (status === FundraiserStatus.Finished) {
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        {status}
      </Tag>
    );
  } else {
    return (
      <Tag icon={<QuestionCircleOutlined />} color="default">
        {status}
      </Tag>
    );
  }
}
