import { ColdState, LocalToken, SpendingApproval, Transaction } from '@lib';
import { ReactElement } from 'react';
import { TokenFragment } from '@graphql';

export interface AppError {
  message: string;
  description: string | ReactElement;
}

export interface AppState extends ColdState {
  isLoading: boolean;
  isSaving: boolean;
  isLoaded: boolean;
  isSynced: boolean;
  error?: AppError;

  localToken?: LocalToken;
  onlineToken?: TokenFragment;

  transaction?: Transaction;
  spendingApproval?: SpendingApproval;
  pendingTransactions: Transaction[];

  subgraphSyncing: boolean;
  syncCallbacks: (() => void)[];
}
