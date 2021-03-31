export const navToFeeBase = [
  { to: 500000, absolute: 1 },
  { to: 1000000, relative: 0.005 },
  { to: 15000000, relative: 0.004 },
  { to: 50000000, relative: 0.0025 },
  { to: 100000000, relative: 0.002 },
  { to: 150000000, relative: 0.0015 },
  { to: Infinity /* and beyond! */, relative: 0.001 },
];

export const SWM_TOKEN_DECIMALS = 18;

export const swmToken = {
  name: 'Swarm Token',
  symbol: 'SWM',
  decimals: SWM_TOKEN_DECIMALS,
};
