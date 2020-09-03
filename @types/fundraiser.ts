import { Uuid, AppFile, AppImage, EthereumAddress, TransferRules } from '.';

export enum FundraiserState {
  Unlaunched,
  Running,
  Finished,
}

export const fundraiserStates: { [key: number]: string } = {
  [FundraiserState.Unlaunched]: 'Unlaunched',
  [FundraiserState.Running]: 'Running',
  [FundraiserState.Finished]: 'Finished',
};

export interface Fundraiser {
  id: Uuid;
  token: string;
  status: FundraiserState;
  startDate: Date;
  endDate: Date;
}
