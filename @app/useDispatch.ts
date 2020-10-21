import { useAppState } from './StateContext';
import { AccountsMeta, Token, TokenAccountListType, Transaction } from '@types';
import { useEthers } from './EthersContext';

interface UseDispatchResult {
  setToken: (token: Token) => void;
  dispatchError: (message: string, description: string) => void;
  dispatchTransaction: (transaction: Transaction) => void;
  setAccountProp: (list: TokenAccountListType, address: string, prop: string, value: string) => void;
  batchSetAccountProp: (list: TokenAccountListType, items: AccountsMeta) => void;
}

export function useDispatch(): UseDispatchResult {
  const [, dispatch] = useAppState();
  const { networkId } = useEthers();

  const dispatchError = (message: string, description: string) => {
    dispatch({
      type: 'showError',
      error: { message, description },
    });
  };

  const dispatchTransaction = (transaction: Transaction) => {
    let { contract, method } = transaction;
    if (method.match(/\./)) {
      const parts = method.split('.');
      contract = parts[0];
      method = parts[1];
    }
    if (!contract) {
      throw new Error('Contract name not provided');
    }
    console.log('startTransaction', { contract, method });

    if (!transaction.arguments) {
      transaction.arguments = [];
    }

    dispatch({
      type: 'startTransaction',
      transaction: { ...transaction, contract, method },
    });
  };

  const setAccountProp = (list: TokenAccountListType, address, prop, value) => {
    dispatch({ type: 'setAccountProp', list, address, prop, value, networkId });
  };

  const batchSetAccountProp = (list: TokenAccountListType, items: AccountsMeta) => {
    dispatch({
      type: 'batchSetAccountProp',
      networkId,
      list,
      items,
    });
  };

  const setToken = (token: Token) => {
    dispatch({ type: 'setToken', token });
  };

  return {
    setToken,
    dispatchError,
    dispatchTransaction,
    setAccountProp,
    batchSetAccountProp,
  };
}
