import React, { ReactElement } from 'react';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatNumber, formatUnits } from '@lib';
import { Card, Tooltip } from 'antd';

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
  const amountNumber = formatNumber(formatUnits(amount, decimals));
  const softCapNumber = formatNumber(formatUnits(softCap, decimals));
  const hardCapNumber = formatNumber(formatUnits(hardCap, decimals));

  return (
    <div>
      <h3>Amount raised</h3>
      <div style={{ width: '100%' }} className="mb-1 c-fundraiser-status">
        {softCap.gt(0) && (
          <Tooltip title={`Soft Cap: ${softCapNumber} USD`}>
            <div className="softcap" style={{ left: `${softCapPercent}%` }} />
          </Tooltip>
        )}
        <Tooltip title={`Hard Cap: ${hardCapNumber} USD`}>
          <div className="hardcap" />
        </Tooltip>
        <Tooltip title={`Raised so far ${amountNumber} USD`}>
          <div className="raised" style={{ width: `${amountPercentHardcap}%` }} />
        </Tooltip>
      </div>
      <div style={{ fontSize: '11px' }}>
        {amountPercentSoftcap < 100 ? (
          <>
            {amountPercentSoftcap} % of soft cap ({softCapNumber} USD)
          </>
        ) : (
          <>
            {amountPercentHardcap} % of hard cap ({hardCapNumber} USD)
          </>
        )}
      </div>
    </div>
  );
}
