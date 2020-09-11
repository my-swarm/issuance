export enum TokenDeployerState {
  None,
  TransferRules,
  Features,
  Roles,
  Token,
  Finished,
}

export enum FundraiserDeployerState {
  None,
  Fundraiser,
  ContributorRestrictions,
  Setup,
  Finished,
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
