import React, { ReactElement } from 'react';
import { AddressZero } from '@ethersproject/constants';
import { Descriptions } from 'antd';
import { useAppState, useEthers } from '@app';
import { Address, HelpLabel } from '@components/utility';
import { LocalTokenAddresses } from '@lib';

export function TokenInfoDeployed(): ReactElement {
  const { networkId } = useEthers();
  const [{ onlineToken, localToken }] = useAppState();

  const addresses = localToken.networks[networkId]?.addresses || ({} as LocalTokenAddresses);

  function printAddress(type) {
    let address;
    if (onlineToken) {
      switch (type) {
        case 'src20':
          address = onlineToken.address;
          break;
        case 'features':
        case 'roles':
        case 'transferRules':
          address = onlineToken[type].address;
          break;
        case 'fundraiser':
          address = onlineToken.currentFundraiser.address;
          break;
        case 'contributorRestrictions':
        case 'affiliateManager':
          address = onlineToken.currentFundraiser[type];
          break;
      }
      if (address === AddressZero) {
        address = undefined;
      }
    } else {
      address = (addresses && addresses[type]) || undefined;
    }

    return address ? <Address link>{address}</Address> : 'Not deployed';
  }

  return (
    <Descriptions title="Deployed addresses" layout="horizontal" bordered size="small" className="mb-3" column={1}>
      <Descriptions.Item label={<HelpLabel name="contractsSrc20" />}>{printAddress('src20')}</Descriptions.Item>
      <Descriptions.Item label={<HelpLabel name="contractsFeatures" />}>{printAddress('features')}</Descriptions.Item>
      <Descriptions.Item label={<HelpLabel name="contractsRoles" />}>{printAddress('roles')}</Descriptions.Item>
      <Descriptions.Item label={<HelpLabel name="contractsTransferRules" />}>
        {printAddress('transferRules')}
      </Descriptions.Item>
      {addresses.fundraiser && (
        <Descriptions.Item label={<HelpLabel name="contractsFundraiser" />}>
          {printAddress('fundraiser')}
        </Descriptions.Item>
      )}
      {addresses.contributorRestrictions && (
        <Descriptions.Item label={<HelpLabel name="contractsContributorRestrictions" />}>
          {printAddress('contributorRestrictions')}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
}
