import React, { ReactElement } from 'react';
import { Collapse } from 'antd';
import { useContractAddress } from '@app';
import { useFundraiserWithContributorsQuery } from '@graphql';
import {
  FundraiserInfo,
  Help,
  Loading,
  ManageAffiliates,
  ManageAsset,
  ManageContributors,
  ManageFundraiserEmbed,
  ManageFundraiserState,
} from '..';

export function TokenManageFundraiser(): ReactElement {
  const { fundraiser: fundraiserAddress } = useContractAddress();
  const { loading, refetch, data } = useFundraiserWithContributorsQuery({ variables: { id: fundraiserAddress } });
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
          <ManageContributors fundraiser={fundraiser} refetch={refetch} />
        </Collapse.Panel>

        <Collapse.Panel header="Edit token's KYA" key="asset" extra={<Help name="manageAsset" />}>
          <ManageAsset />
        </Collapse.Panel>

        {fundraiser.affiliateManager && (
          <Collapse.Panel header="Affiliates" key="affiliates" extra={<Help name="manageAffiliates" />}>
            <ManageAffiliates fundraiser={fundraiser} refetch={refetch} />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Mint Tokens" key="status" extra={<Help name="manageFundraiserStatus" />}>
          <ManageFundraiserState fundraiser={fundraiser} refetch={refetch} />
        </Collapse.Panel>

        <Collapse.Panel header="Embed widget" key="embed" extra={<Help name="manageFundraiserEmbed" />}>
          <ManageFundraiserEmbed fundraiser={fundraiser} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
