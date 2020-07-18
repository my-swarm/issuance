import { Uuid } from '.';

export enum TransferRestrictionTypes {
  None,
  Whitelist,
  Graylist,
}

export const tranferRestrictionTypes = {
  [TransferRestrictionTypes.None]: 'None',
  [TransferRestrictionTypes.Whitelist]: 'Whitelist',
  [TransferRestrictionTypes.Graylist]: 'Graylist',
};

export interface Token {
  id: Uuid;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  image?: string; // todo: change to better type?
  description: string;
  transferRestrictionType: TransferRestrictionTypes;
}
