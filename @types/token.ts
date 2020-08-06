import { Uuid, AppFile, AppImage, EthereumAddress, EthereumNetwork, DeployerState } from '.';

export enum TransferRestrictionsTypes {
  None,
  Whitelist,
  Graylist,
}

export const transferRestrictionsTypes: { [key: number]: string } = {
  [TransferRestrictionsTypes.None]: 'None',
  [TransferRestrictionsTypes.Whitelist]: 'Whitelist',
  [TransferRestrictionsTypes.Graylist]: 'Graylist',
};

export enum TokenState {
  Created,
  Deploying,
  Deployed,
  Fundraising,
  Deleted,
}

export const tokenStates: { [key: number]: string } = {
  [TokenState.Created]: 'Created',
  [TokenState.Deployed]: 'Deployed',
  [TokenState.Fundraising]: 'Fundraising',
  [TokenState.Deleted]: 'Deleted',
};

export interface TokenAddresses {
  features: EthereumAddress;
  transferRules: EthereumAddress;
  roles: EthereumAddress;
  token: EthereumAddress;
  // factory: EthereumAddress;
  // registry: EthereumAddress;
}

type TokenNetworkAddresses = { [index in EthereumNetwork]: TokenAddresses };

export interface TokenDeployState {
  state: DeployerState;
  transferRulesAddress: EthereumAddress;
  featuresAddress: EthereumAddress;
}

export interface Token {
  id: Uuid;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  image?: AppImage;
  description: string;
  transferRestrictionsType: TransferRestrictionsTypes;

  allowAccountFreeze: boolean;
  allowContractFreeze: boolean;
  allowForceTransfer: boolean;
  allowBurn: boolean;
  allowMint: boolean;

  assetName?: string;
  assetNetValue: number;
  navSupportingDocument?: AppFile;
  assetDescription?: string;
  assetImage?: AppImage;
  assetLegalDocuments?: AppFile[];

  state?: TokenState;
  deployerState: DeployerState;
  addresses?: TokenNetworkAddresses;
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
