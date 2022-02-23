import React, { ReactElement, useState } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { useAppState, useDispatch } from '@app';
import { getUnitsAsNumber, parseAddressesInput, sameAddress } from '@lib';
import { useTokenHoldersQuery } from '@graphql';
import { AmountsTable, Loading } from '../utility';
import { BigNumber } from '@ethersproject/bignumber';
import { round } from 'lodash';
import { AddressZero } from '@ethersproject/constants';

interface Props {
  onClose: () => void;
  refetch: () => void;
}

export function AccountsBurnModal({ onClose, refetch }: Props): ReactElement {
  const [input, setInput] = useState<string>('');
  const [percent, setPercent] = useState<number>(100);
  const [type, setType] = useState<'all' | 'list'>('all');
  const { dispatchTransaction, dispatchError } = useDispatch();
  const [{ onlineToken }] = useAppState();
  const { data, loading } = useTokenHoldersQuery({ variables: { token: onlineToken.address } });

  if (loading || !data) {
    return <Loading />;
  }

  const batchSize = onlineToken.deployedAt < 1645623558 ? 1 : 200; // todo: check by version instead

  const holders = data.token.holders;

  async function burnChunk(addresses, totalCount) {
    const numBatches = Math.ceil(totalCount / batchSize);
    const oneBatch = numBatches === 1;
    const addressesBatch = addresses.slice(0, batchSize);
    const addressesLeft = addresses.slice(batchSize);
    const batchesLeft = Math.ceil(addressesLeft.length / batchSize);
    const batchNum = numBatches - batchesLeft;

    const percentContract = Math.round(percent * 1_0000); // 4 decimal places
    let description: string;
    let method: string;
    let args: any[];
    if (batchSize === 1) {
      const address = addressesBatch[0];
      const amount = BigNumber.from(holders.find((h) => sameAddress(h.address, address)).balance)
        .mul(percentContract)
        .div(100_0000);
      method = 'src20.burnAccount';
      args = [address, amount];
      description = `Burning ${percent}% from ${totalCount} accounts (${batchNum} of ${numBatches})`;
    } else {
      method = 'src20.burnAccountsPercent';
      args = [addressesBatch, percentContract];
      description = `Burning ${percent}% from ${totalCount} accounts${
        oneBatch ? `` : ` (batch ${batchNum} of ${numBatches}; ${batchSize} per batch)`
      }`;
    }

    dispatchTransaction({
      method,
      args,
      description,
      onSuccess: () => {
        if (addressesLeft.length > 0) {
          burnChunk(addressesLeft, totalCount);
        } else {
          handleCancel();
        }
      },
      syncCallbacks: [refetch],
    });
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      let addresses: string[];
      if (type === 'all') {
        addresses = holders.map((holder) => holder.address).filter((a) => a !== AddressZero);
      } else {
        addresses = Object.keys(parseAddressesInput(input));
      }

      if (addresses.length === 0) {
        dispatchError(
          'No accounts provided',
          type === 'all' ? 'Your token has no holders' : 'Please provide an account list',
        );
      }

      const amounts = addresses.map((address) =>
        round(
          (getUnitsAsNumber(
            BigNumber.from(holders.find((holder) => sameAddress(holder.address, address)).balance),
            onlineToken.decimals,
          ) *
            percent) /
            100,
          4,
        ),
      );

      Modal.confirm({
        title: `Please confirm burning ${addresses.length} accounts by ${percent} %`,
        width: 640,
        content: (
          <>
            <div className="limit-height">
              <AmountsTable amounts={amounts} addresses={addresses} token={onlineToken} />
            </div>
          </>
        ),

        onOk: () => burnChunk(addresses, addresses.length),
      });
    } catch (e) {
      dispatchError(e.message, e.description);
      return;
    }
  };

  const handleCancel = () => {
    setInput('');
    setPercent(100);
    onClose();
  };

  return (
    <Modal visible={true} title="Mass burn accounts" onOk={handleSubmit} onCancel={handleCancel} okText="Burn!">
      <div className="mb-2">
        <Form layout="vertical">
          <Form.Item label="Burn">
            <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
              <Radio value="all">All token holders</Radio>
              <Radio value="list">Custom account list</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Percent to burn">
            <InputNumber min={0} max={100} step={1} value={percent} onChange={(x) => setPercent(x)} />
          </Form.Item>
          {type === 'list' && (
            <Form.Item label="Account list (one address per line)">
              <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
            </Form.Item>
          )}
        </Form>
      </div>
    </Modal>
  );
}
