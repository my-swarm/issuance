import { EthereumAddress, EthereumNetwork, Uuid } from './ethereum';

import { AppFile, AppImage } from '.';
import { TokenFragment } from '@graphql';
import { BigNumber } from '@ethersproject/bignumber';

export interface LocalTokenAddresses {
  features?: EthereumAddress;
  transferRules?: EthereumAddress;
  src20?: EthereumAddress;
  fundraiser?: EthereumAddress;
  contributorRestrictions?: EthereumAddress;
  affiliateManager?: EthereumAddress;
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
}

export interface LocalTokenKya {
  description: string;
  image?: AppImage;

  assetName: string;
  assetDescription: string;
  nav: number;
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
  allowAutoburn: boolean;

  autoburnTs?: Date;

  networkState: Partial<Record<EthereumNetwork, LocalTokenState>>;
}

export type OnlineToken = TokenFragment;

export enum LocalTokenState {
  Created,
  Deployed,
}

export enum TokenAction {
  Create,
  Edit,
  Info,
  Deploy,
  Mint,
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
  localState?: LocalTokenState;
  onlineToken?: TokenFragment;
};

export const localTokenStates: { [key: number]: string } = {
  [LocalTokenState.Created]: 'Undeployed',
  [LocalTokenState.Deployed]: 'Deployed',
};

export const tokenFeatures = {
  allowAccountFreeze: 'Allow Account Freeze',
  allowContractFreeze: 'Allow Contract Freeze',
  allowForceTransfer: 'Allow Force Transfer',
  allowBurn: 'Allow Burn',
  allowMint: 'Allow Mint',
  allowAutoburn: 'Automatic Token Burn',
};

export function processNewToken(token: LocalToken): LocalToken {
  return { ...token, assetLegalDocuments: token.assetLegalDocuments || [] };
}

/**
 * Merges local underploed tokens with deployedTokens.
 *
 * @param localTokens
 * @param onlineTokens
 * @param networkId
 */
export function mergeLocalOnlineTokens(
  localTokens: LocalToken[],
  onlineTokens: OnlineToken[],
  networkId,
): TokenRecord[] {
  if (!networkId) return [];

  const result: TokenRecord[] = onlineTokens.map((token) => ({
    ...(({ id, name, symbol, address }) => ({ id, name, symbol, address }))(token),
    isMinted: BigNumber.from(token.supply).gt(0),
    isFundraising: token.currentFundraiser !== null,
    onlineToken: token,
  }));

  for (const token of localTokens) {
    const state = token.networkState[networkId] || LocalTokenState.Created;
    if (state === LocalTokenState.Created) {
      result.push({
        ...(({ id, name, symbol }) => ({ id, name, symbol }))(token),
        address: null,
        isMinted: false,
        isFundraising: false,
        localToken: token,
        localState: state,
      });
    }
  }

  return result;
}
