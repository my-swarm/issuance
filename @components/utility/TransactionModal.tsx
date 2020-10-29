import React, { ReactElement, useEffect, useState } from 'react';
import { Space, Modal, Alert, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppState, useEthers } from '@app';
import { ContractProxy } from '../../@lib';
import { TransactionState } from '@types';
import { transactionStatesMeta } from '@const';

export function TransactionModal(): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ transaction, token }, dispatch] = useAppState();
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const [error, setError] = useState<string>();
  const [retry, setRetry] = useState<boolean>(false);

  useEffect(() => {
    if ((signer && transaction) || retry) {
      const proxy = new ContractProxy(signer, token);
      proxy.onProgress(handleTransactionProgress);
      setRetry(false);
      const contract: string | [string, string] = transaction.address
        ? [transaction.contract, transaction.address]
        : transaction.contract;
      proxy.call(contract, transaction.method, transaction.arguments).catch((e) => {
        console.error(e);
        setTransactionState(TransactionState.Error);
        if (e.code === 4001) {
          setError('Please confirm metamask signature popup');
        } else {
          setError(e.reason || e.message || 'Unknown error');
        }
      });
    }
  }, [signer, transaction, retry]);

  const handleTransactionProgress = (state: TransactionState) => {
    setTransactionState(state);
    if (state === TransactionState.Confirmed && transaction.onSuccess) {
      transaction.onSuccess();
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
  console.log({ transaction });

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
        <div>
          <Button onClick={handleClose}>Close</Button>
        </div>
      )}
    </Modal>
  );
}
