import { TransactionState } from '@types';

export const transactionStateMeta = {
  [TransactionState.None]: {
    message: "Transaction hasn't been initiated yet",
  },
  [TransactionState.Signing]: {
    message: 'Waiting for transaction signature',
  },
  [TransactionState.Confirming]: {
    message: 'Waiting for network confirmation',
  },
  [TransactionState.Confirmed]: {
    message: 'Done',
  },
};
