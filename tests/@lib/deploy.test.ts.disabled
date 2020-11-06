import { BigNumber, Contract, ContractFactory, providers, Wallet } from 'ethers';
import { GANACHE, SWM_TOKEN } from '../config';
import { contracts } from '@contracts';
import { TokenDeployerState, Token, TokenState } from '@types';
import { TokenDeployer, parseUnits, getStakeFromNav } from '@lib';
import {
  getTestingToken,
  getTestingWallets,
  deployRequiredContracts,
  ContractInstances,
  getDeployedToken,
  setupDeployer,
} from './helpers';

const REGEX_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const TEST_TIMEOUT = 60000;

const wallets = getTestingWallets();

let token: Token;
let instances: ContractInstances;

beforeAll(async () => {
  token = getTestingToken();
  instances = await deployRequiredContracts();
}, TEST_TIMEOUT);
/*
it('can can deploy or required contracts', async () => {
  expect(instances.swmToken.address).toMatch(REGEX_ADDRESS);
  const supply = await instances.swmToken.totalSupply();
  const name = await instances.swmToken.name();
  const symbol = await instances.swmToken.symbol();
  expect(name).toBe(SWM_TOKEN.name);
  expect(symbol).toBe(SWM_TOKEN.symbol);
  expect(instances.priceOracle.address).toMatch(REGEX_ADDRESS);
  expect(instances.registry.address).toMatch(REGEX_ADDRESS);
  expect(instances.assetRegistry.address).toMatch(REGEX_ADDRESS);
  expect(instances.minter.address).toMatch(REGEX_ADDRESS);
});

it(
  'can deploy a token',
  async () => {
    const events = [];
    const deployer = await setupDeployer(wallets.tokenManager, instances, token);
    deployer.onProgress((event) => {
      events.push(event);
    });
    await deployer.deploy();
    const addresses = deployer.addresses;
    expect(addresses.transferRules).toMatch(REGEX_ADDRESS);
    expect(addresses.roles).toMatch(REGEX_ADDRESS);
    expect(addresses.features).toMatch(REGEX_ADDRESS);
    expect(addresses.src20).toMatch(REGEX_ADDRESS);
    expect(events.length).toBe(5);
  },
  TEST_TIMEOUT,
);
it(
  'can compute stake amount',
  async () => {
    const token = getTestingToken();
    const deployer = await setupDeployer(wallets.tokenManager, instances, token);
    const stakeAmount = await deployer.getStakeAmount();
    const multiplier = BigNumber.from(10).pow(18);
    const { priceNumerator, priceDenominator } = await instances.priceOracle.getPrice();
    const expectedStakeAmount = BigNumber.from(getStakeFromNav(token.assetNetValue))
      .mul(multiplier) // conver to 'wei'
      .mul(priceDenominator) // swm price (in USD) expressed as fraction. Inverse multiplication!
      .div(priceNumerator);

    expect(stakeAmount.toString()).toBe(expectedStakeAmount.toString());
  },
  TEST_TIMEOUT,
);
*/
it(
  'can stake the correct amount and mint all tokens',
  async () => {
    const { token, deployer } = await getDeployedToken(wallets.tokenManager);
    const swmBalance = await instances.swmToken.balanceOf(wallets.tokenManager.address);
    const stakeAmount = await deployer.getStakeAmount();
    await deployer.stakeAndMint();
    const { src20: src20Address } = deployer.addresses;

    // 1. registry has the stake recorded
    const actualStake = await instances.registry.getStake(src20Address);
    console.log({ actual: actualStake.toString(), expected: stakeAmount.toString() });
    expect(actualStake).toEqual(stakeAmount);
    // 2. src 20 has all the tokens
    const src20Instance = new Contract(src20Address, contracts.src20.abi, wallets.tokenManager);
    const actualSupply = await src20Instance.totalSupply();
    expect(actualSupply).toEqual(parseUnits(token.initialSupply, token.decimals));
  },
  TEST_TIMEOUT,
);
