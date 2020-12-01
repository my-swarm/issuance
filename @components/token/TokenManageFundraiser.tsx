import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import { useContractAddress } from '@app';
import { useFundraiserWithContributorsQuery } from '@graphql';
import { Loading, FundraiserProgressChart, FundraiserInfo, ManageContributors, ManageFundraiserState } from '..';

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
      <Collapse defaultActiveKey={['status']}>
        <Collapse.Panel header="Overview" key="overview">
          <Space direction="vertical">
            <FundraiserCommon fundraiser={fundraiser} column={2} />
            <FundraiserProgressChart fundraiser={fundraiser} />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel header="Contributors" key="contributors">
          <ManageContributors contributors={fundraiser.contributors} />
        </Collapse.Panel>
        <Collapse.Panel header="Status control" key="status">
          <ManageFundraiserState fundraiser={fundraiser} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
