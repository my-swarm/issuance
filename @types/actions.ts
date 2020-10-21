import {
  AccountList,
  AccountsMeta,
  AppError,
  ColdState,
  EthereumNetwork,
  Token,
  TokenNetworkData,
  TokenState,
  Transaction,
  Uuid,
} from '.';

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
  token: Partial<Token>;
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

interface SetTokenAction {
  type: 'setToken';
  token: Token | undefined;
}

interface StartTransactionAction {
  type: 'startTransaction';
  transaction: Transaction;
}

interface ResetTransactionAction {
  type: 'resetTransaction';
}

interface SetAccountPropAction {
  type: 'setAccountProp';
  prop: 'name' | 'note';
  address: string;
  // tokenId: string;
  networkId: EthereumNetwork;
  value: string;
}

interface BatchSetAccountPropAction {
  type: 'batchSetAccountProp';
  networkId: EthereumNetwork;
  items: AccountsMeta;
}
/*
interface DeleteFromTokenAccountListAction {
  type: 'deleteFromTokenAccountList';
  networkId: EthereumNetwork;
  list: TokenAccountListType;
  items: AccountList;
}
*/

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
  | SetTokenStateAction
  | SetTokenAction
  | StartTransactionAction
  | ResetTransactionAction
  | SetAccountPropAction
  | BatchSetAccountPropAction;
