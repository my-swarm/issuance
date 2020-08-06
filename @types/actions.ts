import { AppError, ColdState, Token, Uuid } from '.';

interface resetDataAction {
  type: 'restoreState';
  data: ColdState;
}

interface AddTokenAction {
  type: 'addToken';
  token: Token;
}

interface DeleteTokenAction {
  type: 'deleteToken';
  id: Uuid;
}

interface UpdateTokenAction {
  type: 'updateToken';
  token: Token;
  id: Uuid;
}

interface IncrementVersonAction {
  type: 'incrementVersion';
}

interface StartSavingAction {
  type: 'startSaving';
}

interface EndSavingAction {
  type: 'endSaving';
}

interface ShowErrorAction {
  type: 'showError';
  error: AppError;
}

interface HideErrorAction {
  type: 'hideError';
}

export type Action =
  | resetDataAction
  | AddTokenAction
  | DeleteTokenAction
  | UpdateTokenAction
  | IncrementVersonAction
  | StartSavingAction
  | EndSavingAction
  | ShowErrorAction
  | HideErrorAction;
