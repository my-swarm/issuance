import {
  EthereumNetwork,
  AccountsMeta,
  Token,
  TokenNetworkData,
  TokenState,
  Transaction,
  SpendingApproval,
  Uuid,
  ColdState,
} from '@lib';
import { AppError } from './state';

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

interface ApproveSpendingAction {
  type: 'approveSpending';
  spendingApproval: SpendingApproval;
}

interface ResetSpendingApprovalAction {
  type: 'resetSpendingApproval';
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
  | StartSavingAction
  | EndSavingAction
  | ShowErrorAction
  | HideErrorAction
  | SetTokenStateAction
  | SetTokenAction
  | StartTransactionAction
  | ResetTransactionAction
  | ApproveSpendingAction
  | ResetSpendingApprovalAction
  | SetAccountPropAction
  | BatchSetAccountPropAction;
