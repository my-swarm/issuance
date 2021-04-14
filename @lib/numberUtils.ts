import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { parseUnits as _parseUnits, formatUnits as _formatUnits } from '@ethersproject/units';

export function parseUnits(amount: string | number, decimals: number): BigNumber {
  if (!amount) return BigNumber.from(0);
  if (typeof amount === 'number') amount = amount.toString();
  return _parseUnits(amount, decimals);
}

export function formatUnits(bnAmount: BigNumberish, decimals: number, ifZero = '0'): string {
  bnAmount = BigNumber.from(bnAmount || 0);
  if (bnAmount.eq(0)) return ifZero;
  return _formatUnits(bnAmount, decimals);
}

export function getUnitsAsNumber(bnAmount: BigNumberish, decimals: number): number {
  bnAmount = BigNumber.from(bnAmount || 0);
  if (bnAmount.eq(0)) return 0;
  return parseFloat(_formatUnits(bnAmount, decimals));
}

export function formatNumber(n: number | string, decimals = 0): string {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(n);
}

export function formatInt(n) {
  return n || 0;
}

export function parseInt(n) {
  return n;
}

export function bnCompare(a: BigNumber, b: BigNumber) {
  if (a.gt(b)) return -1;
  if (b.gt(a)) return 1;
  return 0;
}

export function bnRatio(a: BigNumberish, b: BigNumberish, precision = 8) {
  const multiplier = BigNumber.from(10).pow(precision);
  return BigNumber.from(a).mul(multiplier).div(BigNumber.from(b)).toNumber() / 10 ** precision;
}
