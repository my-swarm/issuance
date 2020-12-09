import React, { ReactElement } from 'react';
import { Button, Divider } from 'antd';

import { useAppState, useContract, useDispatch, useGraphql } from '@app';
import { StakeTable, TokenInfoMinting, TokenInfoStaking } from '..';
import { BigNumber } from 'ethers';

interface TokenStakeAndMintProps {
  onCancel: () => void;
}

export function TokenStakeAndMint({ onCancel }: TokenStakeAndMintProps): ReactElement {
  const [{ onlineToken: token, localToken }] = useAppState();
  const { swm, minter } = useContract();
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const { reset } = useGraphql();

  const handleStakeAndMint = async () => {
    const stakeAmount = await minter.calcStake(token.nav);

    checkAllowance('registry', swm.address, stakeAmount, () => {
      dispatchTransaction({
        method: 'minter.stakeAndMint',
        arguments: [token.address, localToken.initialSupply],
        description: 'Minting Your Token...',
        onSuccess: () => {
          reset();
        },
      });
    });
  };

  return (
    <div>
      <TokenInfoStaking />
      <TokenInfoMinting />
      <div className="mb-3">
        {BigNumber.from(token.stake).gt(0) ? (
          <Button size="large" onClick={onCancel}>
            Token minted! Close.
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={handleStakeAndMint}>
            Stake &amp; Mint
          </Button>
        )}
      </div>
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
