import { ReactElement } from 'react';
import { Token } from './token';

export interface ColdState {
  tokens: Token[];
  version: number;
}

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
}
