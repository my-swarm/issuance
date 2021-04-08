import React, { ReactElement } from 'react';
import { LeftCircleTwoTone, LoadingOutlined, RightCircleTwoTone } from '../../@lib/icons';
import { Tooltip } from 'antd';

interface Props {
  myAddress: string;
  toAddress: string;
  pending?: boolean;
}

export function TransferDirection({ myAddress, toAddress, pending = false }: Props): ReactElement {
  if (pending) return <LoadingOutlined title="Pending transaction" />;
  if (toAddress === myAddress) {
    return (
      <Tooltip title="Incoming transfer">
        <RightCircleTwoTone twoToneColor="green" />
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Outgoing transfer">
        <LeftCircleTwoTone twoToneColor="red" />
      </Tooltip>
    );
  }
}
