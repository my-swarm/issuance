import { navToStakeBase } from '@lib';

export const getNavToStake = () => {
  const result = [];
  for (let i = 0; i < navToStakeBase.length; i++) {
    const item = navToStakeBase[i];
    result.push({ from: i === 0 ? 0 : navToStakeBase[i - 1].to, ...item });
  }
  return result;
};

export function getStakeFromNav(nav: number): number {
  const correctRow = getNavToStake().find((row) => nav > row.from && nav <= row.to);
  return correctRow.absolute || correctRow.relative * nav;
}
