import { useAppState } from './StateContext';
import { useEthers } from './EthersContext';
import { getContract, getContractAbi, Token, AccountsMeta, Transaction } from '@lib';
import { BigNumber, Contract } from 'ethers';

interface UseDispatchResult {
  setToken: (token: Token) => void;
  dispatchError: (message: string, description: string) => void;
  dispatchTransaction: (transaction: Transaction) => void;
  checkAllowance: (
    contractName: string | [string, string],
    tokenAddress: string,
    amount: BigNumber,
    onSuccess: () => void,
  ) => void;
  setAccountProp: (address: string, prop: string, value: string) => void;
  batchSetAccountProp: (items: AccountsMeta) => void;
}

export function useDispatch(): UseDispatchResult {
  const [, dispatch] = useAppState();
  const { networkId, address, signer } = useEthers();

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

    if (!transaction.arguments) {
      transaction.arguments = [];
    }

    dispatch({
      type: 'startTransaction',
      transaction: { ...transaction, contract, method },
    });
  };

  const checkAllowance = async (
    spender: string | [string, string],
    tokenAddress: string,
    amount: BigNumber,
    onSuccess: () => void,
  ) => {
    let spenderName;
    let spenderAddress;

    if (typeof spender === 'string') {
      spenderName = spender;
      const spenderContract = getContract(spenderName, signer, networkId);
      spenderAddress = spenderContract.address;
    } else {
      spenderName = spender[0];
      spenderAddress = spender[1];
    }

    const tokenContract = new Contract(tokenAddress, getContractAbi('erc20'), signer);
    const currentAllowance = await tokenContract.allowance(address, spenderAddress);
    if (currentAllowance.lt(amount)) {
      dispatch({
        type: 'approveSpending',
        spendingApproval: {
          spenderName,
          spenderAddress,
          tokenContract,
          amount,
          currentAllowance,
          onSuccess,
        },
      });
    } else {
      onSuccess();
    }
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
    checkAllowance,
    setAccountProp,
    batchSetAccountProp,
  };
}
