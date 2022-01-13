import React from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@lib/icons';

import { getNetwork, supportedNetworks } from '@lib';
import { EthersStatus, useEthers } from '@app';
import { Address, SideBox } from '@components';

export function SidebarMetamask() {
  const { status, connect, address, networkId } = useEthers();

  let cardTitle, cardBody;
  switch (status) {
    case EthersStatus.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = (
        <div className="body">
          <a onClick={() => connect(false)} className="link">
            connect
          </a>
        </div>
      );
      break;
    case EthersStatus.CONNECTED:
      cardTitle = 'Connected';

      cardBody = (
        <div className="body">
          <div className="mb-1">{address ? <Address shorter>{address}</Address> : 'unknown address'}</div>
          <div>
            network:{' '}
            {supportedNetworks.indexOf(networkId) === -1 && (
              <Tooltip title={`Unsupported network. Please use Kovan for testing`}>
                <ExclamationCircleOutlined twoToneColor="red" />
              </Tooltip>
            )}{' '}
            <strong>{getNetwork(networkId)}</strong>
          </div>
        </div>
      );
      break;
    case EthersStatus.FAILED:
      cardTitle = 'Failed';
      cardBody = 'Failed to connect. Make sure you have Metamask installed';
      break;
  }

  return (
    <SideBox margin={4}>
      <h3 className="title">
        <img src="/images/metamask-fox.svg" alt="Metamask icon" className="image-1" /> {cardTitle}
      </h3>
      <div>{cardBody}</div>
    </SideBox>
  );
}
