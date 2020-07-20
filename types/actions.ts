import { AppState, Token, Uuid } from '.';

interface resetDataAction {
  type: 'restoreState';
  data: AppState;
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

export type Action =
  | resetDataAction
  | AddTokenAction
  | DeleteTokenAction
  | UpdateTokenAction
  | IncrementVersonAction
  | StartSavingAction
  | EndSavingAction;
