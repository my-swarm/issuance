import { Token, TokenAddresses } from '@types';
import { getDeployedToken, getTestingWallets, ContractInstances } from './helpers';
import { GANACHE } from '../config';

let token: Token;
let instances: ContractInstances;
const TEST_TIMEOUT = 60000;

const wallets = getTestingWallets();

beforeAll(async () => {
  ({ token, instances } = await getDeployedToken(wallets.tokenManager));
}, TEST_TIMEOUT);

it('can burn token', async () => {
  const { src20 } = instances;
  // get current supply
  const supplyBefore = await src20.totalSupply();
  console.log({ supplyBefore });

  // call burn
  // get supply after
  // check difference
});
