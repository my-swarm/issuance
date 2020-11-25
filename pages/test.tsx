import React, { useEffect, useState } from 'react';
import { Button, Drawer, Table } from 'antd';
import { DefaultLayout } from '@components';
import { useAppState, useContract, useContractAddress, useDispatch, useSwmAllowance } from '@app';
import { useTokensQuery } from '@graphql';

export default function TestPage() {
  const [{ tokens, token }, dispatch] = useAppState();
  const { setToken, dispatchTransaction } = useDispatch();
  const [swmAllowance] = useSwmAllowance();
  const tokensQuery = useTokensQuery();
  const { src20: src20Address, swm: swmAddress } = useContractAddress();
  const { src20, swm } = useContract();

  const { loading, error, data } = tokensQuery;
  console.log({ loading, error, data });

  useEffect(() => {
    console.log('eff');
    if (tokens.length) {
      const t = tokens.find((x) => x.symbol === 'TT2');
      if (!t) throw new Error('Token TT2 not found');
      setToken(t);
    }
  }, [tokens]);

  const [src20Symbol, setSrc20Symbol] = useState<string>('loading');
  useEffect(() => {
    if (src20) {
      src20.symbol().then((x) => setSrc20Symbol(x));
    }
  }, [src20]);

  const handleStartTransaction = () => {
    dispatchTransaction({
      method: 'src20.approve',
      arguments: ['0x0a057a7172d0466aef80976d7e8c80647dfd35e3', 1000000000],
      description: 'Running dummy transaction (setting allowance)',
      onSuccess: () => alert('Success mate!'),
    });
  };

  return (
    <DefaultLayout title="Test page">
      <h2>useAddress hook test</h2>
      <p>swm address: {swmAddress}</p>
      <p>src20 address: {src20Address}</p>

      <h2>useContract hook test</h2>
      <p>swm address: {swm ? swm.address : 'loading'}</p>
      <p>src20 address: {src20 ? src20.address : 'loading'}</p>
      <p>src20 symbol: {src20Symbol}</p>
      <p>
        {/*Available supply: {supply} /!*<Button size="small" onClick={() => reloadSupply()}>*!/*/}
        {/*  reload*/}
        {/*</Button>*/}
      </p>

      <h2>useContractValue test</h2>
      {swmAllowance ? (
        <p>
          Total supply: {swmAllowance.nice || '?'} [{swmAllowance.raw.toString()}]
        </p>
      ) : (
        'loading'
      )}

      <h2>Transaction modal test</h2>
      <Button onClick={handleStartTransaction}>test TransactionModal</Button>
    </DefaultLayout>
  );
}
