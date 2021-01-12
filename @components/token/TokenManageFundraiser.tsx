import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import { useContractAddress } from '@app';
import { useFundraiserWithContributorsQuery } from '@graphql';
import {
  Loading,
  FundraiserProgressChart,
  FundraiserInfoCommon,
  ManageContributors,
  ManageAffiliates,
  ManageFundraiserState,
  ManageAsset,
  ManageFundraiserEmbed,
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
        <Collapse.Panel header="Overview" key="overview">
          <Space direction="vertical">
            <FundraiserInfoCommon fundraiser={fundraiser} column={2} />
            <FundraiserProgressChart fundraiser={fundraiser} />
          </Space>
        </Collapse.Panel>

        <Collapse.Panel header="Contributors" key="contributors">
          <ManageContributors fundraiser={fundraiser} />
        </Collapse.Panel>

        <Collapse.Panel header="Edit token's KYA" key="asset">
          <ManageAsset />
        </Collapse.Panel>

        {fundraiser.affiliateManager && (
          <Collapse.Panel header="Affiliates" key="affiliates">
            <ManageAffiliates affiliates={fundraiser.affiliates} />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Stake &amp; Mint" key="status">
          <ManageFundraiserState fundraiser={fundraiser} />
        </Collapse.Panel>

        <Collapse.Panel header="Embed widget" key="embed">
          <ManageFundraiserEmbed fundraiser={fundraiser} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
