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
  // factory: EthereumAddress;
  // registry: EthereumAddress;
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

  networks: TokenNetworksData;
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
