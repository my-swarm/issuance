import { Uuid } from '.';

export type EthereumAddress = string;

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

export interface Token {
  id: Uuid;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  image?: string; // todo: change to better type?
  description: string;
  transferRestrictionsType: TransferRestrictionsTypes;
}

export interface StoredToken {
  token: Token;
  address: EthereumAddress;
}
