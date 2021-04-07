import React, { ReactElement, useState } from 'react';
import { BASE_CURRENCIES, getUnixTimestamp, LocalFundraiser, parseUnits } from '@lib';
import { FundraiserForm } from '..';
import { useAppState, useContract, useDispatch, useEthers } from '@app';
import { Modal } from 'antd';

interface TokenManageProps {
  onClose: () => void;
}

export function TokenStartFundraiser({ onClose }: TokenManageProps): ReactElement {
  const [{ onlineToken, fundraisers }, dispatch] = useAppState();
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { dispatchTransaction } = useDispatch();
  const { networkId } = useEthers();
  const { fundraiserManager, minter } = useContract();
  const fundraiser = fundraisers[onlineToken.address];

  const handleSave = async (values: LocalFundraiser) => {
    save(values);
    onClose();
  };

  const handleStart = async (values: LocalFundraiser) => {
    save(values);

    const baseCurrency = BASE_CURRENCIES[values.baseCurrency];

    setIsDeploying(true);
    dispatchTransaction({
      method: 'fundraiser.deploy',
      args: [
        values.label,
        onlineToken.address,
        parseUnits(values.tokensToMint, onlineToken.decimals),
        parseUnits(values.tokenPrice || 0, baseCurrency.decimals),
        getUnixTimestamp(values.startDate || 0), // startDate (int)
        getUnixTimestamp(values.endDate), // endDate (int)
        parseUnits(values.softCap, baseCurrency.decimals), // softCap
        parseUnits(values.hardCap, baseCurrency.decimals), // hardCap
        values.maxContributors || 0,
        parseUnits(values.minInvestmentAmount || 0, baseCurrency.decimals),
        parseUnits(values.maxInvestmentAmount || 0, baseCurrency.decimals),
        values.contributionsLocked, // bool _contributionsLocked
        [baseCurrency.addresses[networkId], fundraiserManager.address, minter.address],
      ],
      description: 'Creating fundraiser',
      onSuccess: () => {
        onClose();
        Modal.info({
          title: 'Hooray!',
          content: (
            <div>
              <p>The fundraiser has been successfully deployed.</p>
            </div>
          ),
        });
      },
    });
  };
  /*
    address[] memory addressList
 */
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
        disabled={isDeploying}
      />
    </div>
  );
}
