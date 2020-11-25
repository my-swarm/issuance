import { EthereumAddress, EthereumNetwork, Uuid } from './ethereum';

import { FundraiserDeployerState, TokenDeployerState, AccountsMeta, AppFile, AppImage } from '.';

export enum TransferRules {
  None,
  WhitelistOrGreylist,
}

export interface TokenAddresses {
  features?: EthereumAddress;
  transferRules?: EthereumAddress;
  roles?: EthereumAddress;
  src20?: EthereumAddress;
  fundraiser?: EthereumAddress;
  contributorRestrictions?: EthereumAddress;
  affiliateManager?: EthereumAddress;
}

export interface TokenNetworkData {
  state?: TokenState;
  deployerState?: TokenDeployerState;
  fundraiserDeployerState?: FundraiserDeployerState;
  addresses?: TokenAddresses;
  accounts: AccountsMeta;
}

type TokenNetworksData = { [index in EthereumNetwork]?: TokenNetworkData };

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

export enum TokenState {
  Created, // local only
  Deploying, // local only
  Deployed,
  DeployingFundraiser, // local only
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

export type TokenRecord = {
  name: string;
  symbol: string;
  address: string;
  localState?: TokenState;
  isDeployed: boolean;
  isMinted: boolean;
  isFundraising: boolean;
  localToken: Token;
};

export const tokenStates: { [key: number]: string } = {
  [TokenState.Created]: 'Undeployed',
  [TokenState.Fundraising]: 'Fundraising',
  [TokenState.Deploying]: 'Deployment in progress',
  [TokenState.Deployed]: 'Deployed',
  [TokenState.DeployingFundraiser]: 'Fundraiser deployment in progress',
  [TokenState.Fundraising]: 'Fundraiser in progress',
  [TokenState.Minted]: 'Minted',
  [TokenState.Deleted]: 'Deleted',
};

export const transferRules: { [key: number]: string } = {
  [TransferRules.None]: 'None',
  [TransferRules.WhitelistOrGreylist]: 'Whitelist or Greylist',
};

export const tokenFeatures = {
  allowAccountFreeze: 'Allow Account Freeze',
  allowContractFreeze: 'Allow Contract Freeze',
  allowForceTransfer: 'Allow Force Transfer',
  allowBurn: 'Allow Burn',
  allowMint: 'Allow Mint',
};
