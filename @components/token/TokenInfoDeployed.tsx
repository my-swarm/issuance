import React, { ReactElement } from 'react';
import { Token } from '@types';
import { Descriptions } from 'antd';
import { useEthers } from '@app';
import { Address } from '@components/utility';

export function TokenInfoDeployed({ token }: { token: Token }): ReactElement {
  const { networkId } = useEthers();

  const addresses = token.networks[networkId].addresses;
  if (!addresses) {
    return null;
  }

  function printAddress(type) {
    if (addresses && addresses[type]) {
      return <Address link>{addresses[type]}</Address>;
    } else {
      return 'Not deployed';
    }
  }

  return (
    <Descriptions title="Deployed addresses" layout="horizontal" bordered size="small" className="mb-3" column={1}>
      <Descriptions.Item label="SRC20 Token Contract">{printAddress('token')}</Descriptions.Item>
      <Descriptions.Item label="Features Contract">{printAddress('features')}</Descriptions.Item>
      <Descriptions.Item label="Roles Contract">{printAddress('roles')}</Descriptions.Item>
      <Descriptions.Item label="Transfer Rules Contract">{printAddress('transferRules')}</Descriptions.Item>
    </Descriptions>
  );
}
