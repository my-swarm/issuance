import React from 'react';
import { EthersStatus, useEthers } from '@app';
import { Address, NetworkSwitcher, SideBox } from '@components';
import { Button, Alert } from 'antd';

export function SidebarMetamask() {
  const { status, connect, address, networkId } = useEthers();

  switch (status) {
    case EthersStatus.DISCONNECTED:
      return (
        <div className="c-sidebar-status">
          <Alert type="error" message="Disconnected" showIcon className="mb-2" />
          <div>
            <Button
              onClick={() => connect(false)}
              block
              icon={
                <img
                  src="/images/metamask-fox.svg"
                  alt="Metamask icon"
                  style={{ height: '16px', width: 'auto', marginRight: '8px' }}
                />
              }
            >
              Connect
            </Button>
          </div>
        </div>
      );
    case EthersStatus.CONNECTED:
      return (
        <div className="c-sidebar-status">
          <Alert type="success" message="Connected" showIcon className="mb-2" />
          <NetworkSwitcher />
          <div className="mt-2 text-center">{address ? <Address shorter>{address}</Address> : 'unknown address'}</div>
        </div>
      );
    case EthersStatus.FAILED:
      return (
        <div className="c-sidebar-status">
          <div>Failed</div>
          <div>Failed to connect. Make sure you have Metamask installed</div>
        </div>
      );
  }
}
