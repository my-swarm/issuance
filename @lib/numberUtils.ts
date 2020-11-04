import { BigNumber, BigNumberish, utils } from 'ethers';

export function parseUnits(amount: string | number, decimals: number): BigNumber {
  if (typeof amount === 'number') amount = amount.toString();
  return utils.parseUnits(amount, decimals);
}

export function formatUnits(bnAmount: BigNumber, decimals: number): string {
  if (typeof bnAmount === 'string') bnAmount = BigNumber.from(bnAmount);
  return utils.formatUnits(bnAmount, decimals);
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n);
}

export function formatInt(n) {
  return n;
}

export function parseInt(n) {
  return n;
}

export function bnCompare(a: BigNumber, b: BigNumber) {
  if (a.gt(b)) return -1;
  if (b.gt(a)) return 1;
  return 0;
}

export function bnRatio(a: BigNumberish, b: BigNumberish, precision = 16) {
  const multiplier = BigNumber.from(10).pow(precision);
  return BigNumber.from(a).mul(multiplier).div(BigNumber.from(b)).toNumber() / 10 ** precision;
}
