import { useAppState } from './StateContext';
import { Transaction } from '@types';

interface UseDispatchResult {
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
    dispatch({ type: 'startTransaction', transaction });
  };

  return {
    dispatchError,
    dispatchTransaction,
  };
}
