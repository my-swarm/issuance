import React from 'react';
import { FundraiserWithContributorsFragment } from '@graphql';
import { FundraiserInfoBaseCurrency, FundraiserInfoCommon, FundraiserProgressChart } from '../fundraiser';

interface Props {
  fundraiser: FundraiserWithContributorsFragment;
}

export function FundraiserInfo({ fundraiser }: Props) {
  return (
    <div>
      <FundraiserInfoCommon fundraiser={fundraiser} />
      <div className="mb-3" />
      <FundraiserInfoBaseCurrency fundraiser={fundraiser} />
      <div className="mb-3" />
      <h3>
        <strong>Fundraiser progress</strong>
      </h3>
      <FundraiserProgressChart fundraiser={fundraiser} />
    </div>
  );
}
