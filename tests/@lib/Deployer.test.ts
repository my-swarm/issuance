import { Contract, ContractFactory, providers, Wallet } from 'ethers';
import * as ganache from 'ganache-cli';
import { v4 as uuid } from 'uuid';
import { GANACHE, SWM_TOKEN } from '../config';
import { contracts } from '../../contracts';
import { DeployerState, Token, TokenState, TransferRestrictionsTypes } from '@types';
import { Deployer } from '@lib';

const REGEX_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const GAS_LIMIT = 21000;

const provider = new providers.Web3Provider(
  ganache.provider({
    mnemonic: GANACHE.mnemonic,
    port: GANACHE.port,
    hdPath: GANACHE.hdPath,
    network_id: GANACHE.networkId,
  }),
);

const accountTokenManager = GANACHE.accounts[0];
const accountSwmOwner = GANACHE.accounts[1];
const wrongAccount = GANACHE.wrongAccount;

const walletSwmOwner = new Wallet(accountSwmOwner.privateKey, provider);
const walletTokenManager = new Wallet(accountTokenManager.privateKey, provider);

let swmTokenInstance: Contract;
let priceOracleInstance: Contract;
let registryInstance: Contract;
let assetRegistryInstance: Contract;
let factoryInstance: Contract;
let getRateMinterInstance: Contract;

const deployContract = async (
  contractName: string,
  constructorArgs: Array<any>,
  owner: Wallet = walletSwmOwner,
): Promise<Contract> => {
  const artifacts = contracts[contractName];
  if (!artifacts) {
    throw new Error('Artifacts not defnied: ' + contractName);
  }
  const factory = new ContractFactory(artifacts.abi, artifacts.bytecode, owner);
  const instance = await factory.deploy(...constructorArgs);
  await instance.deployTransaction.wait();
  return instance;
};

beforeAll(async () => {
  const controller = accountSwmOwner.address;
  const initialAccount = accountSwmOwner.address;
  const { name, symbol, decimals, totalSupply } = SWM_TOKEN;
  swmTokenInstance = await deployContract('swmToken', [
    controller,
    name,
    symbol,
    decimals,
    initialAccount,
    totalSupply,
  ]);

  priceOracleInstance = await deployContract('priceOracle', [5, 10]); // the token price ~ 0.5 USD
  registryInstance = await deployContract('registry', [swmTokenInstance.address]);
  factoryInstance = await deployContract('factory', [registryInstance.address]);
  await registryInstance.addFactory(factoryInstance.address);
  assetRegistryInstance = await deployContract('assetRegistry', [factoryInstance.address]);
  getRateMinterInstance = await deployContract('getRateMinter', [
    registryInstance.address,
    assetRegistryInstance.address,
    priceOracleInstance.address,
  ]);
  await registryInstance.addMinter(getRateMinterInstance.address);
}, 60000);

test('everything properly setup for testing ;)', async () => {
  expect(swmTokenInstance.address).toMatch(REGEX_ADDRESS);
  const supply = await swmTokenInstance.totalSupply();
  const name = await swmTokenInstance.name();
  const symbol = await swmTokenInstance.symbol();
  console.log({ supply, name, symbol });
  expect(name).toBe(SWM_TOKEN.name);
  expect(symbol).toBe(SWM_TOKEN.symbol);
  console.log({
    swmTokenInstance: !!swmTokenInstance,
    priceOracleInstance: !!priceOracleInstance,
    registryInstance: !!registryInstance,
    assetRegistryInstance: !!assetRegistryInstance,
    factoryInstance: !!factoryInstance,
    getRateMinterInstance: !!getRateMinterInstance,
  });

  expect(priceOracleInstance.address).toMatch(REGEX_ADDRESS);
  expect(registryInstance.address).toMatch(REGEX_ADDRESS);
  expect(assetRegistryInstance.address).toMatch(REGEX_ADDRESS);
  expect(getRateMinterInstance.address).toMatch(REGEX_ADDRESS);
});

test('token is deployed', async () => {
  const token: Token = {
    id: uuid(),
    name: 'Automated Test Token',
    symbol: 'ATT',
    decimals: 18,
    initialSupply: 500000,
    description: 'Token for automated deployemnt test',
    allowAccountFreeze: false,
    allowContractFreeze: true,
    allowForceTransfer: true,
    allowBurn: true,
    allowMint: true,
    assetNetValue: 1000000,
    transferRestrictionsType: TransferRestrictionsTypes.Whitelist,
    state: TokenState.Created,
    deployerState: DeployerState.None,
  };

  const events = [];
  const deployer = new Deployer(walletTokenManager);
  deployer.onProgress((event) => {
    console.log('event', event);
    events.push(event);
  });
  deployer.setContractAddress('registry', registryInstance.address);
  deployer.setContractAddress('assetRegistry', assetRegistryInstance.address);
  deployer.setContractAddress('factory', factoryInstance.address);
  deployer.setContractAddress('getRateMinter', getRateMinterInstance.address);
  deployer.setContractAddress('swmToken', swmTokenInstance.address);
  await deployer.deploy(token);
  const addresses = deployer.addresses;
  console.log({ addresses });
  expect(addresses.transferRules).toMatch(REGEX_ADDRESS);
  expect(addresses.roles).toMatch(REGEX_ADDRESS);
  expect(addresses.features).toMatch(REGEX_ADDRESS);
  expect(addresses.token).toMatch(REGEX_ADDRESS);
}, 60000);
