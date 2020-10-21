import React, { ReactElement, useState } from 'react';
import { Input, Modal } from 'antd';
import { AccountsMeta, TokenAccountListType } from '@types';
import ethers from 'ethers';
import { useAppState, useDispatch } from '@app';
import { Help } from '@components';

interface AccountsAddModalProps {
  list: TokenAccountListType;
  onClose: () => void;
}

function listToContractMethod(list: TokenAccountListType, operation: 'add' | 'remove'): string {
  const whitelistOperations = {
    add: 'bulkWhitelistAccount',
    remove: 'bulkUnWhitelistAccount',
  };
  const greylistOperations = {
    add: 'bulkGreylistAccount',
    remove: 'bulkUnGreylistAccount',
  };
  switch (list) {
    case 'contributors':
      return `contributorRestrictions.${whitelistOperations[operation]}`;
    case 'whitelist':
      return `transferRules.${whitelistOperations[operation]}`;
    case 'greylist':
      return `transferRules.${whitelistOperations[operation]}`;
  }
}

function listTitle(list: TokenAccountListType): string {
  switch (list) {
    case 'contributors':
      return 'fundraiser contributors list';
    case 'whitelist':
      return 'token whitelist';
    case 'greylist':
      return 'token greylist';
  }
}

export function AccountsAddModal({ list, onClose }: AccountsAddModalProps): ReactElement {
  const [input, setInput] = useState<string>('');
  const [, dispatch] = useAppState();
  const { dispatchTransaction, dispatchError } = useDispatch();

  const handleAdd = async (): Promise<void> => {
    const data = parseAddressesInput(input);
    if (Object.keys(data).length === 0) return;

    dispatchTransaction({
      method: listToContractMethod(list, 'add'),
      arguments: [Object.keys(data)],
      description: `Adding ${data.length} addresses to your ${listTitle(list)}`,
      onSuccess: () => handleAddToLocalState(data),
    });
  };

  const handleAddToLocalState = (items: AccountsMeta) => {
    dispatch({
      type: 'batchSetAccountProp',
      list,
      items,
    });
    handleCancel();
  };

  const handleCancel = () => {
    setInput('');
    onClose();
  };

  function parseAddressesInput(input: string): AccountsMeta {
    let hadError = false;

    if (input.trim() === '') {
      dispatchError('Invalid input', 'Please provide an address list');
      return {};
    }

    const rawData: string[] = input.trim().split('\n');

    const data = {};
    for (const rawRecord of rawData) {
      const [uncheckedAddress, name, note] = rawRecord.split(/[,;\t]/).map((x) => x.trim());
      let address;

      try {
        address = ethers.utils.getAddress(uncheckedAddress);
      } catch (e) {
        hadError = true;
        dispatchError('Error parsing address list', `${e.reason}: ${uncheckedAddress}`);
      }
      data[address] = { name, note };
    }

    return hadError ? [] : data;
  }

  return (
    <Modal visible={true} title="Batch add contributors" onOk={handleAdd} onCancel={handleCancel}>
      <div className="mb-2">
        <Help name="batchAdd" type="render" />
        <br />
        <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
      </div>
    </Modal>
  );
}
