import { BigNumber, Contract, Transaction as EthersTransaction } from 'ethers';

export enum TransactionState {
  None,
  Signing,
  Confirming,
  Confirmed,
  Error = -1,
}

export interface TransactionStateMeta {
  message: string;
}

export type TransactionEventCallback = (event: TransactionState) => void;

export interface Transaction {
  hash?: string;
  contract?: string;
  method: string;
  arguments?: any[];
  description?: string;
  onSuccess?: () => void;
  address?: string;
  createdAt: Date;
}

export interface SpendingApproval {
  spenderName: string;
  spenderAddress: string;
  tokenContract: Contract;
  amount: BigNumber;
  currentAllowance: BigNumber;
  onSuccess: () => void;
}

export const transactionStatesMeta: { [index in TransactionState]: TransactionStateMeta } = {
  [TransactionState.None]: {
    message: "Transaction hasn't been initiated yet.",
  },
  [TransactionState.Signing]: {
    message: 'Waiting for transaction signature...',
  },
  [TransactionState.Confirming]: {
    message: 'Waiting for network confirmation...',
  },
  [TransactionState.Confirmed]: {
    message: 'Transaction has finished.',
  },
  [TransactionState.Error]: {
    message: 'Error when processing transaction.',
  },
};
