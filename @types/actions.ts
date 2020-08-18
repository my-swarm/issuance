import { AppError, ColdState, EthereumNetwork, Token, TokenNetworkData, TokenState, Uuid } from '.';

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

interface UpdateTokenNetworkAction {
  type: 'updateTokenNetwork';
  id: Uuid;
  networkId: EthereumNetwork;
  networkData: TokenNetworkData;
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

interface SetTokenStateAction {
  type: 'setTokenState';
  id: Uuid;
  networkId: EthereumNetwork;
  state: TokenState;
}

export type Action =
  | resetDataAction
  | AddTokenAction
  | DeleteTokenAction
  | UpdateTokenAction
  | UpdateTokenNetworkAction
  | IncrementVersonAction
  | StartSavingAction
  | EndSavingAction
  | ShowErrorAction
  | HideErrorAction
  | SetTokenStateAction;
