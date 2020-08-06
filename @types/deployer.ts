export enum DeployerState {
  None,
  DeployStarted,
  TransferRulesStarted,
  TransferRulesFinished,
  FeaturesStarted,
  FeaturesFinished,
  RolesStarted,
  RolesFinished,
  TokenStarted,
  TokenFinished,
  StakeApproveStarted,
  StakeApproveFinished,
  MintStarted,
  MintFinished,
  DeployFinished,
  Error,
}

export type DeployerEventCallback = (state: DeployerState) => void;
