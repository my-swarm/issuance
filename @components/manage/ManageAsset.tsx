import React, { ReactElement, useMemo } from 'react';
import { useContract, useDispatch, useKya } from '@app';
import { Button, Form } from 'antd';
import { AssetFormStub, Loading, TokenMetaStub } from '..';
import { kyaToToken, LocalTokenKya, storeKya, tokenToKya } from '@lib';

export function ManageAsset(): ReactElement {
  // const [{ onlineToken }] = useAppState();
  const { kya, nav } = useKya();
  const { dispatchTransaction } = useDispatch();
  const { src20 } = useContract();

  const formData = useMemo(() => {
    if (kya) {
      return kyaToToken(kya, nav);
    } else {
      return undefined;
    }
  }, [kya, nav]);

  if (!kya) return <Loading />;

  const handleSubmit = async (values: LocalTokenKya) => {
    const { kyaHash, kyaUrl } = await storeKya(tokenToKya(values));
    dispatchTransaction({
      contract: 'assetRegistry',
      method: 'updateKya',
      description: 'Updating onchain link to your KYA',
      arguments: [src20.address, kyaHash, kyaUrl],
      onSuccess: () => {
        if (values.assetNetValue !== nav) {
          dispatchTransaction({
            contract: 'assetRegistry',
            method: 'updateNav',
            description: 'Updating your Net Asset Value',
            arguments: [src20.address, values.assetNetValue],
          });
        }
      },
    });

    console.log('changing kya');
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
      <Form.Item>
        <h2>Token Meta information</h2>
        <TokenMetaStub />
        <h2>Asset information</h2>
        <AssetFormStub />
        <Button type="primary" htmlType="submit">
          Update your KYA
        </Button>
      </Form.Item>
    </Form>
  );
}
