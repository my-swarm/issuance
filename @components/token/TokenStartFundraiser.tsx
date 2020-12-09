import React, { ReactElement, useState } from 'react';
import { FundraiserDeployerState, LocalFundraiser } from '@lib';
import { FundraiserForm, DeployProgress } from '..';
import { useEthers, useAppState } from '@app';

interface TokenManageProps {
  onClose: () => void;
}

export function TokenStartFundraiser({ onClose }: TokenManageProps): ReactElement {
  const [{ localToken, onlineToken, fundraisers }, dispatch] = useAppState();
  const { networkId } = useEthers();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const deployerState = localToken?.networks[networkId]?.fundraiserDeployerState || FundraiserDeployerState.None;
  const isDeploying = deployerState !== FundraiserDeployerState.None;
  const fundraiser = fundraisers[onlineToken.address];

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
          <DeployProgress type="fundraiser" onClose={onClose} />
        </>
      )}
    </div>
  );
}
