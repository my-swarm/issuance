import React from 'react';
import { Tooltip } from 'antd';
import { getNetwork } from '@ethersproject/networks';
import { ExclamationCircleOutlined } from '@lib/icons';

import { EthereumNetwork } from '@lib';
import { EthersStatus, useEthers } from '@app';
import { Address } from '@components';

export function MetamaskStatus() {
  const { status, connect, address, networkId } = useEthers();

  const supportedNetworks = [EthereumNetwork.Main, EthereumNetwork.Kovan];

  let cardTitle, cardBody;
  switch (status) {
    case EthersStatus.DISCONNECTED:
      cardTitle = 'Disconnected';
      cardBody = (
        <div className="side-box-body">
          <a onClick={() => connect(false)} className="link">
            connect
          </a>
        </div>
      );
      break;
    case EthersStatus.CONNECTED:
      cardTitle = 'Connected';

      cardBody = (
        <div className="side-box-body">
          <div className="mb-1">{address ? <Address short>{address}</Address> : 'unknown address'}</div>
          <div>
            network:{' '}
            {supportedNetworks.indexOf(networkId) === -1 && (
              <Tooltip title={`Unsupported network. Please use Kovan for testing`}>
                <ExclamationCircleOutlined twoToneColor="red" />
              </Tooltip>
            )}{' '}
            <strong>{getNetwork(networkId).name}</strong>
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
    <>
      <h3 className="side-box-title">
        <img src="/images/metamask-fox.svg" alt="Metamask icon" className="image-1" /> {cardTitle}
      </h3>
      <div>{cardBody}</div>
    </>
  );
}
