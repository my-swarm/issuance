import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import { useContractAddress } from '@app';
import { useFundraiserWithContributorsQuery } from '@graphql';
import {
  Loading,
  ManageContributors,
  ManageAffiliates,
  ManageFundraiserState,
  ManageAsset,
  ManageFundraiserEmbed,
  FundraiserInfo,
  Help,
} from '..';

export function TokenManageFundraiser(): ReactElement {
  const { fundraiser: fundraiserAddress } = useContractAddress();
  const { loading, error, data } = useFundraiserWithContributorsQuery({ variables: { id: fundraiserAddress } });
  if (loading || !data) return <Loading />;

  const fundraiser = data.fundraiser;
  if (!fundraiser) {
    throw new Error('Fundraiser not found');
  }

  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel header="Overview" key="overview" extra={<Help name="manageFundraiserOverview" />}>
          <FundraiserInfo fundraiser={fundraiser} />
        </Collapse.Panel>

        <Collapse.Panel header="Contributors" key="contributors" extra={<Help name="manageContributors" />}>
          <ManageContributors fundraiser={fundraiser} />
        </Collapse.Panel>

        <Collapse.Panel header="Edit token's KYA" key="asset" extra={<Help name="manageAsset" />}>
          <ManageAsset />
        </Collapse.Panel>

        {fundraiser.affiliateManager && (
          <Collapse.Panel header="Affiliates" key="affiliates" extra={<Help name="manageAffiliates" />}>
            <ManageAffiliates affiliates={fundraiser.affiliates} baseCurrency={fundraiser.baseCurrency} />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Mint Tokens" key="status" extra={<Help name="manageFundraiserStatus" />}>
          <ManageFundraiserState fundraiser={fundraiser} />
        </Collapse.Panel>

        <Collapse.Panel header="Embed widget" key="embed" extra={<Help name="manageFundraiserEmbed" />}>
          <ManageFundraiserEmbed fundraiser={fundraiser} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
