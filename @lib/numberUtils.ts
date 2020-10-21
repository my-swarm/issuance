import { BigNumber, utils } from 'ethers';

export function parseUnits(amount: string | number, decimals: number): BigNumber {
  if (typeof amount === 'number') amount = amount.toString();
  return utils.parseUnits(amount, decimals);
}

export function formatUnits(bnAmount: BigNumber, decimals: number): string {
  return utils.formatUnits(bnAmount, decimals);
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n);
}

export function formatTokenAmount(bnAmount: BigNumber | string, decimals: number): string {
  if (typeof bnAmount === 'string') bnAmount = BigNumber.from(bnAmount);
  return formatNumber(parseFloat(formatUnits(bnAmount, decimals)));
}

export function formatInt(n) {
  return n;
}

export function parseInt(n) {
  return n;
}
