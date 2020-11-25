import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import { useAppState, useDispatch, useEthers } from '@app';
import { formatUnits, getContractAddress } from '@lib';
import { BigNumber } from 'ethers';

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export function SpendingApprovalModal(): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ spendingApproval, token }, dispatch] = useAppState();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const { dispatchTransaction } = useDispatch();

  const { amount, tokenContract, contractName, currentAllowance, onSuccess } = spendingApproval;

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
    const realAmount = unlimited ? BigNumber.from(2).pow(256).sub(1) : amount;
    const transaction = {
      method: 'erc20.approve',
      address: tokenContract.address,
      arguments: [getContractAddress(contractName, networkId, token), realAmount],
      description: 'Approving spending',
      onSuccess,
    };
    dispatchTransaction(transaction);
  };

  const handleClose = () => {
    dispatch({ type: 'resetSpendingApproval' });
  };

  return (
    <Modal title="Approve spending" footer={null} visible={true} closable={false}>
      <p>
        The <strong>{contractName}</strong> contract needs to spend{' '}
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

      <Space>
        <Button onClick={() => handleAllow(true)} type="primary">
          Allow unlimited
        </Button>
        <Button onClick={() => handleAllow(false)} type="primary">
          Allow {formatUnits(amount, tokenInfo.decimals)} {tokenInfo.symbol}
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Space>
    </Modal>
  );
}
