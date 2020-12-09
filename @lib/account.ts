import { EthereumAddress } from '@lib';

export type AccountMeta = {
  name: string;
  note: string;
};

export type AccountsMeta = Record<string, AccountMeta>;

export type RawAccount = { address: string; createdAt: number };

export type Account = {
  address: EthereumAddress;
  name: string;
  note: string;
  createdAt: Date;
};

export type RawAccountList = RawAccount[];

export type AccountList = Account[];

export type AccountListType = 'whitelist' | 'greylist' | 'contributors';
