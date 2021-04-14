import React, { ReactElement, useState } from 'react';
import { Input, Modal } from 'antd';
import { useDispatch } from '@app';
import { Help } from '@components';
import { AccountListType, AccountMeta, AccountsMeta, parseAddressesInput } from '@lib';

interface AccountsAddModalProps {
  list: AccountListType;
  onClose: () => void;
}

function listToContractMethod(list: AccountListType, operation: 'add' | 'remove'): string {
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
      return `transferRules.${greylistOperations[operation]}`;
  }
}

function listTitle(list: AccountListType): string {
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
  const { dispatchTransaction, dispatchError, batchSetAccountProp } = useDispatch();

  const handleAdd = async (): Promise<void> => {
    try {
      const data = parseAddressesInput<AccountMeta>(input, (meta) => ({ name: meta[0], note: meta[1] }));
      const addresses = Object.keys(data);
      dispatchTransaction({
        method: listToContractMethod(list, 'add'),
        args: [addresses],
        description: `Adding ${addresses.length} addresses to your ${listTitle(list)}`,
        onSuccess: () => handleAddToLocalState(data),
      });
    } catch (e) {
      dispatchError(e.message, e.description);
      return;
    }
  };

  const handleAddToLocalState = (items: AccountsMeta) => {
    batchSetAccountProp(items);
    handleCancel();
  };

  const handleCancel = () => {
    setInput('');
    onClose();
  };

  return (
    <Modal visible={true} title="Batch add accounts" onOk={handleAdd} onCancel={handleCancel}>
      <div className="mb-2">
        <Help name="batchAdd" type="render" />
        <br />
        <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
      </div>
    </Modal>
  );
}
