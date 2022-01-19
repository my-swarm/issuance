import {
  EthereumNetwork,
  AccountsMeta,
  LocalToken,
  LocalTokenState,
  Transaction,
  SpendingApproval,
  LocalFundraiser,
  Uuid,
  ColdState,
  OnlineToken,
} from '@lib';
import { AppError } from './state';

interface resetDataAction {
  type: 'restoreState';
  data: ColdState;
}

interface AddTokenAction {
  type: 'addToken';
  token: LocalToken;
  networkId: EthereumNetwork;
}

interface SaveFundraiserAction {
  type: 'saveFundraiser';
  tokenAddress: string;
  fundraiser: LocalFundraiser;
}

interface DeleteTokenAction {
  type: 'deleteToken';
  id: Uuid;
}

interface UpdateTokenAction {
  type: 'updateToken';
  token: Partial<LocalToken>;
  id: Uuid;
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
  state: LocalTokenState;
}

interface SetTokenAction {
  type: 'setToken';
  localToken?: LocalToken;
  onlineToken?: OnlineToken;
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
  value: string;
}

interface BatchSetAccountPropAction {
  type: 'batchSetAccountProp';
  networkId: EthereumNetwork;
  items: AccountsMeta;
}

interface AddPendingTransactionAction {
  type: 'addPendingTransaction';
  transaction: Transaction;
}

interface RemovePendingTransactionAction {
  type: 'removePendingTransaction';
  transaction: Transaction;
}

interface StartSubgraphSyncAction {
  type: 'startSubgraphSync';
  callbacks: (() => void)[];
}

interface EndSubgraphSyncAction {
  type: 'endSubgraphSync';
}

// interface AddSubgraphSyncCallbackAction {
//   type: 'addSubgraphSyncCallback';
// }

export type Action =
  | resetDataAction
  | AddTokenAction
  | SaveFundraiserAction
  | DeleteTokenAction
  | UpdateTokenAction
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
  | BatchSetAccountPropAction
  | AddPendingTransactionAction
  | RemovePendingTransactionAction
  | StartSubgraphSyncAction
  | EndSubgraphSyncAction;
