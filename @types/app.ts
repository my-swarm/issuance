import { ReactElement } from 'react';
import { Token } from './token';
import { BigNumber, Contract } from 'ethers';

export interface ColdState {
  tokens: Token[];
  version: number;
}

export interface AppError {
  message: string;
  description: string | ReactElement;
}

export interface Transaction {
  contract?: string;
  method: string;
  arguments?: any[];
  description?: string;
  onSuccess?: () => void;
  address?: string;
}

export interface SpendingApproval {
  contractName: string;
  tokenContract: Contract;
  amount: BigNumber;
  currentAllowance: BigNumber;
  onSuccess: () => void;
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
