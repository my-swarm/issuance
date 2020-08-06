import { BigNumber } from 'ethers';

export function getBnSupply(intSupply: number, decimals: number): BigNumber {
  return BigNumber.from(`${intSupply}${'0'.repeat(decimals)}`);
}
