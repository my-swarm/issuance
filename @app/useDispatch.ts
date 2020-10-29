import { useAppState } from './StateContext';
import { AccountsMeta, Token, Transaction } from '@types';
import { useEthers } from './EthersContext';

interface UseDispatchResult {
  setToken: (token: Token) => void;
  dispatchError: (message: string, description: string) => void;
  dispatchTransaction: (transaction: Transaction) => void;
  setAccountProp: (address: string, prop: string, value: string) => void;
  batchSetAccountProp: (items: AccountsMeta) => void;
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
    console.log('dispatch', transaction);
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

  const setAccountProp = (address, prop, value) => {
    dispatch({ type: 'setAccountProp', address, prop, value, networkId });
  };

  const batchSetAccountProp = (items: AccountsMeta) => {
    dispatch({
      type: 'batchSetAccountProp',
      networkId,
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
