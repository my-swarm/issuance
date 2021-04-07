import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import { unlimitedAllowance, useAppState, useDispatch, useEthers } from '@app';
import { formatUnits, getContractAddress } from '@lib';
import { BigNumber } from '@ethersproject/bignumber';

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export function SpendingApprovalModal(): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ spendingApproval }, dispatch] = useAppState();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const { dispatchTransaction } = useDispatch();

  const { amount, tokenContract, spenderName, spenderAddress, currentAllowance, onSuccess } = spendingApproval;

  useEffect(() => {
    if (tokenContract && signer && networkId) {
      (async () => {
        setTokenInfo({
          name: await tokenContract.name(),
          symbol: await tokenContract.symbol(),
          decimals: await tokenContract.decimals(),
        });
      })();
    }
  }, [tokenContract.address, signer, networkId]);

  if (!tokenInfo) return null;

  const handleAllow = (unlimited: boolean) => {
    const realAmount = unlimited ? unlimitedAllowance : amount;
    dispatchTransaction({
      method: 'erc20.approve',
      address: tokenContract.address,
      args: [spenderAddress, realAmount],
      description: 'Approving spending',
      onSuccess,
    });
    handleClose();
  };

  const handleClose = () => {
    dispatch({ type: 'resetSpendingApproval' });
  };

  return (
    <Modal title="Approve spending" footer={null} visible={true} closable={true} onCancel={handleClose}>
      {amount === null ? (
        <>
          <p>
            The <strong>{spenderName}</strong> contract needs to be able to spend your {tokenInfo.symbol} tokens. Please
            approve unlimited allowance
          </p>
        </>
      ) : (
        <>
          <p>
            The <strong>{spenderName}</strong> contract needs to spend{' '}
            <strong>{formatUnits(amount, tokenInfo.decimals)}</strong> {tokenInfo.symbol} on your behalf. Please allow
            limited or unlimited spending
          </p>
          <p>
            Current allowance:{' '}
            <strong>
              {formatUnits(currentAllowance, tokenInfo.decimals)} {tokenInfo.symbol}
            </strong>
          </p>
          <p>
            Required spending:{' '}
            <strong>
              {formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}
            </strong>
          </p>
        </>
      )}

      <Space>
        <Button onClick={() => handleAllow(true)} type="primary">
          Approve unlimited
        </Button>
        {amount !== null && (
          <Button onClick={() => handleAllow(false)} type="primary">
            Approve {formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}
          </Button>
        )}
      </Space>
    </Modal>
  );
}
