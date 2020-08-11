import { DeployerState, Token, TokenState, TransferRestrictionsTypes } from '../@types';

const tokenDefaults: Partial<Token> = {
  decimals: 18,
  initialSupply: 1000000,
  description: 'Testing token',
  transferRestrictionsType: TransferRestrictionsTypes.None,
  allowAccountFreeze: true,
  allowContractFreeze: true,
  allowForceTransfer: true,
  allowBurn: true,
  allowMint: true,

  assetName: 'Some valuable asset',
  assetNetValue: 10000000,
  state: TokenState.Created,
  deployerState: DeployerState.None,
};

export const tokens = [
  {
    ...tokenDefaults,
    name: 'Undeployed Token',
    symbol: 'UDT',
    state: TokenState.Created,
  },
  {
    ...tokenDefaults,
    name: 'Partially Deployed Token',
    symbol: 'PDT',
    state: TokenState.Deploying,
    deployerState: DeployerState.FeaturesFinished,
  },
  {
    ...tokenDefaults,
    name: 'Deployed Token',
    symbol: 'DET',
    state: TokenState.Deployed,
    deployerState: DeployerState.Finished,
  },
  {
    ...tokenDefaults,
    name: 'Fundraising Token',
    symbol: 'FUT',
    state: TokenState.Fundraising,
    deployerState: DeployerState.Finished,
  },
  {
    ...tokenDefaults,
    name: 'Minted Token',
    symbol: 'MIT',
    state: TokenState.Minted,
    deployerState: DeployerState.Finished,
  },
];
