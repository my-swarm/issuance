import { EthereumAddress, EthereumNetwork, Uuid } from './ethereum';

import { AppFile, AppImage } from '.';
import { TokenFragment } from '@graphql';

export interface LocalTokenAddresses {
  features?: EthereumAddress;
  transferRules?: EthereumAddress;
  src20?: EthereumAddress;
  fundraiser?: EthereumAddress;
  contributorRestrictions?: EthereumAddress;
  affiliateManager?: EthereumAddress;
}

export interface LocalTokenNetworkData {
  state?: TokenState;
  addresses?: LocalTokenAddresses;
}

export interface LocalFundraiser {
  tokenAddress: string;
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
  maxContributors: number;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  networks: Record<EthereumNetwork, LocalTokenNetworkData>;
}

export interface LocalTokenKya {
  description: string;
  image?: AppImage;

  assetName: string;
  assetDescription: string;
  assetNetValue: number;
  assetNavDocument: AppFile;
  assetImage: AppImage;
  assetLegalDocuments: AppFile[];
}

export interface LocalToken extends LocalTokenKya {
  id: Uuid;

  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: number;
  allowUnlimitedSupply?: boolean;

  allowTransferRules: boolean;
  allowAccountFreeze: boolean;
  allowContractFreeze: boolean;
  allowForceTransfer: boolean;
  allowBurn: boolean;
  allowMint: boolean;

  networks: Record<EthereumNetwork, LocalTokenNetworkData>;
}

export type OnlineToken = TokenFragment;

export enum TokenState {
  Created, // local only
  Deploying, // local only
  Deployed,
  DeployingFundraiser, // local only
  Fundraising,
  // FundraisingFinished = 5,
  Minted,
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

/** Simplified token type for token list. References both local and online token for details */
export type TokenRecord = {
  name: string;
  symbol: string;
  address: string;
  isMinted: boolean;
  isFundraising: boolean;
  localToken?: LocalToken;
  localState?: TokenState;
  onlineToken?: TokenFragment;
};

export const tokenStates: { [key: number]: string } = {
  [TokenState.Created]: 'Undeployed',
  [TokenState.Fundraising]: 'Fundraising',
  [TokenState.Deploying]: 'Deployment in progress',
  [TokenState.Deployed]: 'Deployed',
  [TokenState.DeployingFundraiser]: 'Fundraiser deployment in progress',
  [TokenState.Fundraising]: 'Fundraiser in progress',
  [TokenState.Minted]: 'Minted',
};

export const tokenFeatures = {
  allowAccountFreeze: 'Allow Account Freeze',
  allowContractFreeze: 'Allow Contract Freeze',
  allowForceTransfer: 'Allow Force Transfer',
  allowBurn: 'Allow Burn',
  allowMint: 'Allow Mint',
};

export function processNewToken(token: LocalToken): LocalToken {
  return { ...token, assetLegalDocuments: token.assetLegalDocuments || [] };
}
