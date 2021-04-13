import { FundraiserWithTokenFragment } from '@graphql';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export function getClaimableAmount(fundraiser: FundraiserWithTokenFragment, contributed: BigNumberish): BigNumber {
  const baseCurrencyDecimals = BigNumber.from(10).pow(fundraiser.baseCurrency.decimals);
  const tokenDecimals = BigNumber.from(10).pow(fundraiser.token.decimals);
  const amountQualified = BigNumber.from(fundraiser.amountQualified);
  let tokenPrice = BigNumber.from(fundraiser.tokenPrice);
  console.log({ fundraiser });
  if (tokenPrice.eq(0)) {
    if (amountQualified.eq(0)) return BigNumber.from(0);
    tokenPrice = amountQualified.mul(tokenDecimals).mul(tokenDecimals).div(fundraiser.supply).div(baseCurrencyDecimals);
  }
  return BigNumber.from(contributed).mul(tokenDecimals).mul(tokenDecimals).div(tokenPrice).div(baseCurrencyDecimals);
}
