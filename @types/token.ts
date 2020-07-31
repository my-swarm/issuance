import { Uuid, AppFile, AppImage, EthereumAddress } from '.';

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

export interface Token {
  id: Uuid;
  state: TokenState;
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
  assetNetValue?: string;
  navSupportingDocument?: AppFile;
  assetDescription?: string;
  assetImage?: AppImage;
  assetLegalDocuments?: AppFile[];
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
