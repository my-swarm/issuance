export enum DeployerState {
  None,
  Started,
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
  Finished,
  Error, // todo: this one might be unnecessary. Error are handled on component level
}

export type DeployerEventCallback = (state: DeployerState) => void;
