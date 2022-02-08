import React, { ReactElement } from 'react';
import { Button, Dropdown, Menu, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getNetwork, networkNames, supportedNetworks } from '@lib';
import { useEthers, isDev } from '@app';

export function NetworkSwitcher(): ReactElement {
  const { networkId, changeNetwork } = useEthers();

  const menu = (
    <Menu>
      {Object.entries(networkNames)
        .filter(([chainId]) => isDev || chainId !== '31337')
        .map(([chainId, chainName]) => (
          <Menu.Item key={chainId}>
            <Button type="link" onClick={() => changeNetwork(parseInt(chainId))}>
              {chainName}
            </Button>
          </Menu.Item>
        ))}
    </Menu>
  );

  const isUnsupported = supportedNetworks.indexOf(networkId) === -1;
  // && (
  //   <Tooltip title={`Unsupported network. Please use Kovan for testing`}>
  //     <ExclamationCircleOutlined twoToneColor="red" />
  //   </Tooltip>
  // )}

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button danger={isUnsupported} type="default" block>
        {getNetwork(networkId) || 'Switch'} <DownOutlined />
      </Button>
    </Dropdown>
  );
}
