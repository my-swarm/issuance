import {
  Uuid,
  AppFile,
  AppImage,
  EthereumAddress,
  EthereumNetwork,
  TokenDeployerState,
  FundraiserDeployerState,
} from '.';

export enum TransferRules {
  None,
  WhitelistOrGreylist,
  // Greylist, // greylist distinction isn't really implemented in the contracts!
}

export const transferRules: { [key: number]: string } = {
  [TransferRules.None]: 'None',
  [TransferRules.WhitelistOrGreylist]: 'Whitelist or Greylist',
  // [TransferRules.Greylist]: 'Greylist',
};

export enum TokenState {
  Created,
  Deploying,
  Deployed,
  DeployingFundraiser,
  Fundraising,
  // FundraisingFinished = 5,
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
  [TokenState.Fundraising]: 'Fundraising',
  [TokenState.Deploying]: 'Deployment in progress',
  [TokenState.Deployed]: 'Deployed',
  [TokenState.DeployingFundraiser]: 'Fundraiser deployment in progress',
  [TokenState.Fundraising]: 'Fundraiser in progress',
  [TokenState.Minted]: 'Minted',
  [TokenState.Deleted]: 'Deleted',
};

export interface TokenAddresses {
  features?: EthereumAddress;
  transferRules?: EthereumAddress;
  roles?: EthereumAddress;
  src20?: EthereumAddress;
  fundraiser?: EthereumAddress;
  contributorRestrictions?: EthereumAddress;
}

export type AccountMeta = {
  name: string;
  note: string;
};

export type AccountsMeta = {
  [key: string]: AccountMeta;
};

export interface TokenNetworkData {
  state?: TokenState;
  deployerState?: TokenDeployerState;
  fundraiserDeployerState?: FundraiserDeployerState;
  addresses?: TokenAddresses;
  contributors: AccountsMeta;
  whitelist?: AccountsMeta;
  greylist?: AccountsMeta;
}

type TokenNetworksData = { [index in EthereumNetwork]?: TokenNetworkData };

export interface TokenDeployState {
  state: TokenDeployerState;
  transferRulesAddress: EthereumAddress;
  featuresAddress: EthereumAddress;
}

export interface AccountListRecord {
  address: EthereumAddress;
  name: string;
  note: string;
}

export type AccountList = AccountListRecord[];

export type TokenAccountListType = 'whitelist' | 'greylist' | 'contributors';

export interface TokenFundraiser {
  label: string;
  baseCurrency: string;
  contributionsLocked: boolean;
  tokensToMint: number | null;
  tokenPrice: number | null;
  startDate: string;
  startNow: boolean;
  endDate: string;
  softCap: number;
  hardCap: number;
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
  transferRestrictionsType: TransferRules;

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
  assetLegalDocuments: AppFile[];

  networks: TokenNetworksData;
  fundraiser?: TokenFundraiser;
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
