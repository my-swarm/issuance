import { Token } from './Token';

export interface ColdState {
  tokens: Token[];
  version: number;
}

export interface AppState extends ColdState {
  isLoading: boolean;
  isSaving: boolean;
  isLoaded: boolean;
  isSynced: boolean;
}
