import React, { ReactElement } from 'react';
import { useContractAddress, useDispatch, useGraphql } from '@app';
import { Form } from 'antd';
import { useTokenStatusQuery } from '@graphql';
import { Loading } from '@components';

type FormData = {
  kyaHash: string;
  kuaUrl: string;
};

export function ManageAsset(): ReactElement {
  const { src20: src20Address } = useContractAddress();

  const { loading, error, data } = useTokenStatusQuery({
    variables: { id: src20Address },
  });
  const gToken = data?.localToken || undefined;
  if (loading || !gToken) return <Loading />;

  const handleSubmit = async (values: FormData) => {
    console.log({ values });
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <p>Asset management TBD</p>
    </Form>
  );
}
