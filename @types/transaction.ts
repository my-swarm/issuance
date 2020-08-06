export enum TransactionState {
  None,
  Signing,
  Confirming,
  Confirmed,
}

export type TransactionEventCallback = (event: TransactionState) => void;
