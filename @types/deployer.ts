export enum DeployerState {
  None,
  TransferRules,
  Features,
  Roles,
  Token,
  Finished,
}

export type DeployerEventCallback = (state: DeployerState) => void;
