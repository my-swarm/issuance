import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Button, Modal, Space } from 'antd';
import { LoadingOutlined } from '@lib/icons';
import { useAppState, useEthers } from '@app';
import { ContractProxy, TransactionState, transactionStatesMeta } from '@lib';
import { Transaction } from '@ethersproject/transactions';

export function TransactionModal(): ReactElement {
  const { signer } = useEthers();
  const [{ transaction, onlineToken }, dispatch] = useAppState();
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const [error, setError] = useState<string>();
  const [retry, setRetry] = useState<boolean>(false);

  function processError(e) {
    console.error(e);
    setTransactionState(TransactionState.Error);
    if (e.code === 4001) {
      setError('Please confirm metamask signature popup');
    } else {
      setError(e.reason || e.message || 'Unknown error');
    }
  }

  useEffect(() => {
    if ((signer && transaction) || retry) {
      const proxy = new ContractProxy(signer, onlineToken);
      proxy.onProgress(handleTransactionProgress);
      setRetry(false);

      const { address, contract: contractName, method, arguments: args, overrides } = transaction;

      const contract: string | [string, string] = address ? [contractName, address] : contractName;

      if (method === 'deploy') {
        proxy.deploy(contractName, args).catch((e) => {
          processError(e);
        });
      } else {
        proxy.call(contract, method, args, {}, overrides || {}).catch((e) => {
          processError(e);
        });
      }
    }
  }, [signer, transaction, retry]);

  const handleTransactionProgress = (state: TransactionState, tx?: Transaction) => {
    setTransactionState(state);
    if (tx) transaction.hash = tx.hash;
    if (state === TransactionState.Confirming) {
      dispatch({ type: 'addPendingTransaction', transaction });
    } else if (state === TransactionState.Confirmed) {
      dispatch({ type: 'removePendingTransaction', transaction });
      if (transaction.onSuccess) transaction.onSuccess();
      if (transaction.autoclose) handleClose();
    }
  };

  const handleRetry = () => {
    setRetry(true);
  };

  const handleClose = () => {
    dispatch({ type: 'resetTransaction' });
  };

  if (!transaction) {
    return null;
  }

  const { description } = transaction;
  const transactionStateMeta = transactionStatesMeta[transactionState];

  function renderHeader() {
    return (
      <Space>
        <img src="/images/metamask-fox.svg" alt="Metamask icon" className="image-1" />
        <span>Transaction in progress</span>
      </Space>
    );
  }

  return (
    <Modal title={renderHeader()} footer={null} visible={true} closable={false}>
      {description && (
        <p>
          <strong>{description}</strong>
        </p>
      )}
      <p>
        {(transactionState === TransactionState.Signing || transactionState === TransactionState.Confirming) && (
          <span>
            <LoadingOutlined />{' '}
          </span>
        )}
        {transactionStateMeta.message}
      </p>
      {transactionState === TransactionState.Error && (
        <div>
          <Alert className="mb-3" type="error" showIcon={true} message={error} />
          <Space>
            <Button onClick={handleRetry}>Try again</Button>
            <Button onClick={handleClose}>Close</Button>
          </Space>
        </div>
      )}
      {transactionState === TransactionState.Confirmed && (
        <>
          <p>Please note that it might take some times for the changes to show in the UI.</p>
          <div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
