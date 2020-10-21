import { useAppState } from './StateContext';
import { Token, Transaction } from '@types';

interface UseDispatchResult {
  setToken: (token: Token) => void;
  dispatchError: (message: string, description: string) => void;
  dispatchTransaction: (transaction: Transaction) => void;
}

export function useDispatch(): UseDispatchResult {
  const [, dispatch] = useAppState();

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

  const setToken = (token: Token) => {
    dispatch({ type: 'setToken', token });
  };

  return {
    setToken,
    dispatchError,
    dispatchTransaction,
  };
}
