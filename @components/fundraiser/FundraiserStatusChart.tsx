import React, { ReactElement } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatNumber, formatUnits } from '@lib';

interface FundraiserStatusChartProps {
  softCap: BigNumberish;
  hardCap: BigNumberish;
  amount: BigNumberish;
  decimals: number;
}

export function FundraiserStatusChart({
  softCap,
  hardCap,
  amount,
  decimals,
}: FundraiserStatusChartProps): ReactElement {
  softCap = BigNumber.from(softCap);
  hardCap = BigNumber.from(hardCap);
  amount = BigNumber.from(amount);
  const softCapPercent = softCap.mul(100).div(hardCap).toNumber();
  const amountPercentHardcap = amount.mul(100).div(hardCap).toNumber();
  const amountPercentSoftcap = amount.mul(100).div(softCap).toNumber();

  return (
    <div>
      <h3>Amount raised</h3>
      <div style={{ width: '100%' }} className="mb-1 raise-progress">
        {softCap.gt(0) && <div className="softcap" style={{ left: `${softCapPercent}%` }} />}
        <div className="raised" style={{ width: `${amountPercentHardcap}%` }} />
      </div>
      <div style={{ fontSize: '11px' }}>
        {amountPercentSoftcap < 100 ? (
          <>
            {amountPercentSoftcap} % of soft cap ({formatNumber(formatUnits(softCap, decimals))} USD)
          </>
        ) : (
          <>
            {amountPercentHardcap} % of hard cap ({formatNumber(formatUnits(hardCap, decimals))} USD)
          </>
        )}{' '}
        raised
      </div>
    </div>
  );
}
