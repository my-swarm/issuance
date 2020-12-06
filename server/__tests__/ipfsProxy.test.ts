import { KyaStorage } from '../lib';
import { ipfsConfig } from '../config';

describe('ipfsProxy', () => {
  if (!process.env.IPFS_HOST) throw new Error('Need IPFS_HOST env config');
  const ipfsProxy = new KyaStorage(ipfsConfig);

  it('works', async () => {
    expect(ipfsProxy.hello()).toEqual('hi');
  });
});
