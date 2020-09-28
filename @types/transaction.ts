export enum TransactionState {
  None,
  Signing,
  Confirming,
  Confirmed,
  Error = -1,
}

export type TransactionEventCallback = (event: TransactionState) => void;
