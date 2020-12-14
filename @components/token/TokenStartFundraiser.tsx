import React, { ReactElement, useState } from 'react';
import { DeployerState, LocalFundraiser } from '@lib';
import { FundraiserForm, TokenDeployProgress, FundraiserDeployProgress } from '..';
import { useEthers, useAppState } from '@app';

interface TokenManageProps {
  onClose: () => void;
}

export function TokenStartFundraiser({ onClose }: TokenManageProps): ReactElement {
  const [{ onlineToken, fundraisers }, dispatch] = useAppState();
  const { networkId } = useEthers();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const fundraiser = fundraisers[onlineToken.address];
  const deployerState = fundraiser?.networks?.[networkId]?.deployerState || DeployerState.None;
  const isDeploying = deployerState !== DeployerState.None;

  const handleSave = async (values: LocalFundraiser) => {
    save(values);
    onClose();
  };

  const handleStart = async (values: LocalFundraiser) => {
    save(values);
    setIsStarted(true);
  };

  function save(fundraiser) {
    dispatch({
      type: 'saveFundraiser',
      fundraiser,
      tokenAddress: onlineToken.address,
    });
  }

  return (
    <div>
      <FundraiserForm
        tokenName={onlineToken.name}
        onCancel={onClose}
        onSave={handleSave}
        onStart={handleStart}
        formData={fundraiser}
        disabled={isDeploying || isStarted}
      />
      {(isDeploying || isStarted) && (
        <>
          <h2>Fundraiser contract deployment</h2>
          <FundraiserDeployProgress onClose={onClose} />
        </>
      )}
    </div>
  );
}
