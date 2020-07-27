import React, { useContext } from 'react';
import { Card } from 'antd';

import { EthersContext, EthersStatus } from '@app';
import { MetamaskConnect, Address } from '@components';

export function MetamaskStatus() {
  const { status, address, connect } = useContext(EthersContext);

  let cardTitle, cardBody;
  switch (status) {
    case EthersStatus.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = <MetamaskConnect label="Connect now" />;
      break;
    case EthersStatus.CONNECTED:
      cardTitle = 'Connceted';
      cardBody = (
        <div>
          {address ? <Address>{address}</Address> : 'unknown address'}
          <br />
          detect network (tbd)
        </div>
      );
      break;
    case EthersStatus.FAILED:
      cardTitle = 'Failed';
      cardBody = 'Failed to connect. Make sure you have Metamask installed';
      break;
  }

  return (
    <Card size="small" title={cardTitle}>
      {cardBody}
    </Card>
  );
}
