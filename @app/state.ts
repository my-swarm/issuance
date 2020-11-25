import { Token, ColdState, Transaction, SpendingApproval } from '@lib';
import { ReactElement } from 'react';

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
  token?: Token;
  transaction?: Transaction;
  spendingApproval?: SpendingApproval;
}
