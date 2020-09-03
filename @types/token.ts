import { Uuid, AppFile, AppImage, EthereumAddress, EthereumNetwork, DeployerState } from '.';

export enum TransferRules {
  None,
  WhitelistOrGraylist,
  // Graylist, // graylist distinction isn't really implemented in the contracts!
}

export const transferRules: { [key: number]: string } = {
  [TransferRules.None]: 'None',
  [TransferRules.WhitelistOrGraylist]: 'Whitelist or Graylist',
  // [TransferRules.Graylist]: 'Graylist',
};

export enum TokenState {
  Created,
  Deploying,
  Deployed,
  Fundraising,
  Minted,
  Deleted,
}

export enum TokenAction {
  Create,
  Edit,
  Info,
  Deploy,
  StakeAndMint,
  StartFundraise,
  ManageFundraise,
  ManageToken,
  Delete,
}

export const tokenStates: { [key: number]: string } = {
  [TokenState.Created]: 'Created, not deployed',
  [TokenState.Deployed]: 'Deployed',
  [TokenState.Fundraising]: 'Fundraising',
  [TokenState.Deploying]: 'Deployment in progress',
  [TokenState.Fundraising]: 'Fundraiser in progress',
  [TokenState.Minted]: 'Minted',
  [TokenState.Deleted]: 'Deleted',
};

export interface TokenAddresses {
  features?: EthereumAddress;
  transferRules?: EthereumAddress;
  roles?: EthereumAddress;
  src20?: EthereumAddress;
}

export interface TokenNetworkData {
  state?: TokenState;
  deployerState?: DeployerState;
  addresses?: TokenAddresses;
}

type TokenNetworksData = { [index in EthereumNetwork]?: TokenNetworkData };

export interface TokenDeployState {
  state: DeployerState;
  transferRulesAddress: EthereumAddress;
  featuresAddress: EthereumAddress;
}

export interface AccountListRecord {
  address: EthereumAddress;
  name: string;
  note: string;
}

export type AccountList = AccountListRecord[];

export type TokenAccountListType = 'whitelist' | 'graylist';

export interface Token {
  id: Uuid;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  initialSupply: number;
  totalSupply?: number;
  allowUnlimitedSupply?: boolean;
  image?: AppImage;
  transferRules: TransferRules;

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

  networks: TokenNetworksData;
  whitelist?: AccountList;
  graylist?: AccountList;
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
