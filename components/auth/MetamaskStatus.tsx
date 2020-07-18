import { EthersContext, Status } from '../../context/EthersContext';
import { MetamaskConnect } from './MetamaskConnect';
import { Address } from '../utility';
import { Card } from 'antd';
import React, { useContext } from 'react';

export function MetamaskStatus() {
  const { status, address, connect } = useContext(EthersContext);

  let cardTitle, cardBody;
  switch (status) {
    case Status.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = <MetamaskConnect label="Connect now" />;
      break;
    case Status.CONNECTED:
      cardTitle = 'Connceted';
      cardBody = (
        <div>
          your address:
          <br />
          {address ? <Address>{address}</Address> : 'unknown address'}
        </div>
      );
      break;
    case Status.FAILED:
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
