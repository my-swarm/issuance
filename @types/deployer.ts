export const DeployerStateNone = 0;
export const DeployerStateFinished = -1;

export enum TokenDeployerState {
  None = DeployerStateNone,
  TransferRules = 1,
  Features,
  Roles,
  Token,
  Finished = DeployerStateFinished,
}

export enum FundraiserDeployerState {
  None = DeployerStateNone,
  Fundraiser = 1,
  ContributorRestrictions,
  AffiliateManager,
  Setup,
  Finished = DeployerStateFinished,
}

export type DeployerState = TokenDeployerState | FundraiserDeployerState;

export type DeployerEventCallback = (state: DeployerState) => void;

export interface DeployerStateMeta {
  message?: string;
  description?: string;
  percent?: number;
}

export interface TransactionStateMeta {
  message: string;
}

export type DeployerStatesMeta = { [index in DeployerState]?: DeployerStateMeta };
