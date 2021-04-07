import React, { ReactElement, useMemo } from 'react';
import { useDispatch, useKya } from '@app';
import { Button, Form } from 'antd';
import { AssetFormStub, Loading, TokenMetaStub } from '..';
import { kyaToToken, LocalTokenKya, storeKya, tokenToKya } from '@lib';

export function ManageAsset(): ReactElement {
  const { kya, nav } = useKya();
  const { dispatchTransaction } = useDispatch();

  const formData = useMemo(() => {
    if (kya) {
      return kyaToToken(kya, nav);
    } else {
      return undefined;
    }
  }, [kya, nav]);

  if (!kya) return <Loading />;

  const handleSubmit = async (values: LocalTokenKya) => {
    const { kyaUri } = await storeKya(tokenToKya(values));
    dispatchTransaction({
      contract: 'src20',
      method: 'updateKya',
      description: 'Updating onchain link to your KYA',
      args: [kyaUri],
    });
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
