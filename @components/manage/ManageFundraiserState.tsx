import React, { ReactElement, useMemo } from 'react';
import { Button, Tag, Alert, Divider } from 'antd';
import { useContractAddress, useDispatch, useGraphql, useStakeInfo } from '@app';
import { FundraiserStatus, FundraiserWithContributorsFragment } from '@graphql';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits, SWM_TOKEN_DECIMALS, getUnitsAsNumber } from '@lib';
import { CheckOutlined, WarningOutlined } from '@lib/icons';
import { TokenInfoStaking } from '../token';
import { StakeTable } from '../misc';

interface ManageFundraiserStateProps {
  fundraiser: FundraiserWithContributorsFragment;
}

export function ManageFundraiserState({ fundraiser }: ManageFundraiserStateProps): ReactElement {
  const { dispatchTransaction, checkAllowance } = useDispatch();
  const { swm: swmAddress } = useContractAddress();
  const { reset } = useGraphql();
  const baseCurrency = fundraiser.baseCurrency;
  const value = useMemo(() => {
    return getUnitsAsNumber(fundraiser.amountQualified, baseCurrency.decimals);
  }, [fundraiser]);
  const { lowSwmBalance, stake } = useStakeInfo(value);

  const handleCancel = () => {
    dispatchTransaction({
      method: 'fundraiser.cancel',
      description: 'Canceling the fundraiser.',
      onSuccess: () => {
        alert('What now?');
      },
    });
  };

  const handleStakeAndMint = async () => {
    checkAllowance(
      ['fundraiser', fundraiser.address],
      fundraiser.token.address,
      null, // unlimited
      () => {
        checkAllowance('registry', swmAddress, stake, () => {
          dispatchTransaction({
            method: 'fundraiser.stakeAndMint',
            description: 'Staking and minting...',
            onSuccess: () => {
              reset();
            },
          });
        });
      },
    );
  };

  const statusFinished = fundraiser.status === FundraiserStatus.Finished;
  const statusRunning = fundraiser.status === FundraiserStatus.Running;
  const amountQualified = BigNumber.from(fundraiser.amountQualified);
  const softCap = BigNumber.from(fundraiser.softCap);
  const hardCap = BigNumber.from(fundraiser.hardCap);
  const raisedEnoughSoft = amountQualified.gte(softCap);
  const raisedEnoughHard = amountQualified.gte(hardCap);
  const afterEndDate = fundraiser.endDate < Date.now() / 1000;
  const allowStakeAndMint = statusRunning && (raisedEnoughHard || (raisedEnoughSoft && afterEndDate));

  const raisedSoft = (
    <>
      Soft Cap: raised <strong>{formatUnits(amountQualified, baseCurrency.decimals)}</strong> of{' '}
      <strong>{formatUnits(softCap, baseCurrency.decimals)}</strong> {baseCurrency.symbol}
    </>
  );

  const raisedHard = (
    <>
      Hard Cap: raised <strong>{formatUnits(amountQualified, baseCurrency.decimals)}</strong> of{' '}
      <strong>{formatUnits(hardCap, baseCurrency.decimals)}</strong> {baseCurrency.symbol}
    </>
  );

  return (
    <div>
      {/*
      {!statusFinished && (
        <>
          <h2>Cancel fundraiser</h2>
          <p>Stops the fundraiser and returns all funds back to contributors.</p>
          <p>
            <Popconfirm
              title="Are you 100% sure you want to cancel the fundraiser? There is no way back!"
              onConfirm={handleCancel}
            >
              <Button size="large" type="primary" danger>
                Cancel fundraiser
              </Button>
            </Popconfirm>
          </p>
        </>
      )}
      <h2>Stake and mint</h2>
*/}
      {statusFinished ? (
        <p>Fundraiser is finished and your tokens have already been minted</p>
      ) : (
        <>
          {allowStakeAndMint ? (
            <>
              <Alert type="success" message="Your token is ready to be minted" className="mb-3" showIcon />
              <TokenInfoStaking fundraiser={fundraiser} />
            </>
          ) : (
            <>
              <p>Tokens can be minted when one of these conditions is true:</p>
              <ul>
                <li>Hard Cap is reached</li>
                <li>Soft Cap is reached and the fundraiser is beyond the end date</li>
              </ul>

              <div className="mb-2">
                {raisedEnoughSoft ? (
                  <Tag color="green">
                    <CheckOutlined /> {raisedSoft}
                  </Tag>
                ) : (
                  <Tag color="red">
                    <WarningOutlined /> {raisedSoft}
                  </Tag>
                )}
              </div>
              <div className="mb-2">
                {raisedEnoughHard ? (
                  <Tag color="green">
                    <CheckOutlined /> {raisedHard}
                  </Tag>
                ) : (
                  <Tag color="red">
                    <WarningOutlined /> {raisedHard}
                  </Tag>
                )}
              </div>
              <div className="mb-2">
                {afterEndDate ? (
                  <Tag color="green">
                    <CheckOutlined /> End Date: reached
                  </Tag>
                ) : (
                  <Tag color="red">
                    <WarningOutlined /> End Date: not reached
                  </Tag>
                )}
              </div>
            </>
          )}

          {lowSwmBalance && (
            <Alert type="error" message="Not enough SWM balance to mint your token!" showIcon className="mb-3" />
          )}
          <p>
            <Button
              disabled={!allowStakeAndMint || lowSwmBalance !== false}
              size="large"
              type="primary"
              onClick={handleStakeAndMint}
            >
              Stake &amp; Mint
            </Button>
          </p>

          {allowStakeAndMint && (
            <>
              <Divider />
              <StakeTable />
            </>
          )}
        </>
      )}
    </div>
  );
}
