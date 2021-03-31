import { navToFeeBase } from '@lib';

export const getNavToFee = () => {
  const result = [];
  for (let i = 0; i < navToFeeBase.length; i++) {
    const item = navToFeeBase[i];
    result.push({ from: i === 0 ? 0 : navToFeeBase[i - 1].to, ...item });
  }
  return result;
};

export function getFeeFromNav(nav: number): number {
  const correctRow = getNavToFee().find((row) => nav > row.from && nav <= row.to);
  return correctRow.absolute || correctRow.relative * nav;
}
