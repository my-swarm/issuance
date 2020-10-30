import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import { FundraiserCard, FundraiserChart } from '../fundraiser';
import { useContractAddress } from '@app';
import { useFundraiserQuery } from '@graphql';
import { Loading } from '../utility';
import { FundraiserInfo } from '../fundraiser/FundraiserInfo';
import { ManageContributors } from '../manage/ManageContributors';
import { ManageFundraiserState } from '../manage/ManageFundraiserState';

export function TokenManageFundraiser(): ReactElement {
  const { fundraiser: fundraiserAddress } = useContractAddress();
  const { loading, error, data } = useFundraiserQuery({ variables: { id: fundraiserAddress } });
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
            <FundraiserInfo fundraiser={fundraiser} column={2} />
            <FundraiserChart fundraiser={fundraiser} />
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
