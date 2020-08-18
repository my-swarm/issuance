import React, { useContext } from 'react';
import { EthereumNetwork } from '@types';
import { Card, Alert, Tooltip } from 'antd';
import { ExclamationCircleTwoTone } from '@ant-design/icons';

import { EthersContext, EthersStatus } from '@app';
import { Address, MetamaskConnect } from '@components';

export function MetamaskStatus() {
  const { status, address, networkId } = useContext(EthersContext);

  const networkNames = {
    [EthereumNetwork.Main]: 'Mainnet',
    [EthereumNetwork.Ropsten]: 'Ropsten',
    [EthereumNetwork.Rinkeby]: 'Rinkeby',
    [EthereumNetwork.Goerli]: 'Goerli',
    [EthereumNetwork.Kovan]: 'Kovan',
    [EthereumNetwork.Local]: 'Local',
  };

  const supportedNetworks = [EthereumNetwork.Main, EthereumNetwork.Ropsten];

  let cardTitle, cardBody;
  switch (status) {
    case EthersStatus.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = <MetamaskConnect label="Connect now" />;
      break;
    case EthersStatus.CONNECTED:
      cardTitle = 'Connected';
      cardBody = (
        <div>
          {address ? <Address>{address}</Address> : 'unknown address'}
          <br />
          network:{' '}
          {supportedNetworks.indexOf(networkId) === -1 && (
            <Tooltip title={`Unsupported network. Please use Ropsten for testing`}>
              <ExclamationCircleTwoTone twoToneColor="red" />
            </Tooltip>
          )}{' '}
          <strong>{networkNames[networkId] ?? 'Unknown'}</strong>
        </div>
      );
      break;
    case EthersStatus.FAILED:
      cardTitle = 'Failed';
      cardBody = 'Failed to connect. Make sure you have Metamask installed';
      break;
  }

  return (
    <Card
      size="small"
      title={
        <div>
          <img src="/images/metamask-fox.svg" alt="Metamask icon" style={{ width: '1rem', height: '1rem' }} />{' '}
          {cardTitle}
        </div>
      }
    >
      {cardBody}
    </Card>
  );
}
