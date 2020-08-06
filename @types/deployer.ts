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
  Error, // todo: this one might be unnecessary. Error are handled on component level
}

export type DeployerEventCallback = (state: DeployerState) => void;
