import React, { ReactElement, useState } from 'react';
import { Alert, Button, Divider } from 'antd';

import { useAppState, useContract, useDispatch, useGraphql, useStakeInfo } from '@app';
import { parseUnits } from '@lib';
import { StakeTable, StakingForm, StakingFormData, TokenInfoStaking } from '..';

interface TokenStakeAndMintProps {
  onCancel: () => void;
}

export function TokenStakeAndMint({ onCancel }: TokenStakeAndMintProps): ReactElement {
  const [{ onlineToken: token }] = useAppState();
  const { swm } = useContract();
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const { reset } = useGraphql();
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const { stake, reloadSwmBalance } = useStakeInfo();

  const handleStakeAndMint = async (values: StakingFormData) => {
    console.log('handleStakeANdMint', values, stake);

    checkAllowance('registry', swm.address, stake, () => {
      dispatchTransaction({
        method: 'minter.stakeAndMint',
        arguments: [token.address, parseUnits(values.supply, token.decimals)],
        description: 'Minting Your Token...',
        onSuccess: () => {
          reset();
          reloadSwmBalance();
          setIsStaked(true);
        },
      });
    });
  };

  return (
    <div>
      <TokenInfoStaking />

      {isStaked ? (
        <>
          <Alert type="info" message="Your token has been minted!" className="mb-3" showIcon />
          <p>
            <Button onClick={onCancel} type="primary">
              Close
            </Button>
          </p>
        </>
      ) : (
        <StakingForm value={token.nav} onSubmit={handleStakeAndMint} />
      )}

      <Divider />

      <h3>How does this work</h3>
      <ul>
        <li>
          When you click the <strong>Stake &amp; Mint</strong> button, we first check (and increase if necessary) your
          SWM spending allowance. You have to sign a transaction for that.
        </li>
        <li>
          After that, the <strong>Mint</strong> function is run and the computed SWM amount is transfered from your
          wallet to the smart contract.
        </li>
      </ul>

      <h3>How is the stake amount computed</h3>
      <p>It&apos;s derived from your asset value using the table below</p>
      <StakeTable />
    </div>
  );
}
