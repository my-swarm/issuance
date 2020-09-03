import { BigNumber } from 'ethers';

export function getBnSupply(intSupply: string | number, decimals: number): BigNumber {
  return BigNumber.from(`${intSupply.toString()}${'0'.repeat(decimals)}`);
}

export function getTokenAmount(bnAmount: BigNumber, decimals: number): number {
  return bnAmount.div(`1${'0'.repeat(decimals)}`).toNumber();
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n);
}

export function formatTokenAmount(bnAmount: BigNumber, decimals: number): string {
  return formatNumber(getTokenAmount(bnAmount, decimals));
}

export function formatInt(n) {
  return n;
}

export function parseInt(n) {
  return n;
}
