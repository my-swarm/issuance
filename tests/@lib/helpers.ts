import { v4 as uuid } from 'uuid';
import ganache from 'ganache-cli';
import { Contract, ContractFactory, providers, Wallet } from 'ethers';

import { contracts } from '@contracts';
import { TokenDeployer } from '@lib';
import { TokenDeployerState, Token, TokenState, TransferRules } from '@types';

import { GANACHE, SWM_TOKEN } from '../config';

const accountSwmOwner = GANACHE.accounts[0];
const accountTokenManager = GANACHE.accounts[1];
const wrongAccount = GANACHE.wrongAccount;
const TOKEN_PRICE = [5, 10]; // the token price ~ 0.5 USD

const provider = new providers.Web3Provider(
  ganache.provider({
    mnemonic: GANACHE.mnemonic,
    port: GANACHE.port,
    hdPath: GANACHE.hdPath,
    networkId: GANACHE.networkId,
    network_id: GANACHE.networkId,
  }),
);

export function getTestingWallets(): { swmOwner: Wallet; tokenManager: Wallet } {
  return {
    swmOwner: new Wallet(accountSwmOwner.privateKey, provider),
    tokenManager: new Wallet(accountTokenManager.privateKey, provider),
  };
}

export function getTestingToken(): Token {
  return {
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
    transferRestrictionsType: TransferRules.WhitelistOrGreylist,
    networks: {
      [GANACHE.networkId]: {
        state: TokenState.Created,
        deployerState: TokenDeployerState.None,
        addresses: {},
      },
    },
  };
}

export const deployContract = async (
  contractName: string,
  constructorArgs: Array<any>,
  owner: Wallet,
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

export interface ContractInstances {
  swmToken: Contract;
  priceOracle: Contract;
  registry: Contract;
  assetRegistry: Contract;
  factory: Contract;
  minter: Contract;
  features?: Contract;
  transferRules?: Contract;
  roles?: Contract;
  src20?: Contract;
}

export const deployRequiredContracts = async (): Promise<ContractInstances> => {
  const wallets = getTestingWallets();
  const controller = wallets.swmOwner.address;
  const initialAccount = wallets.swmOwner.address;
  const { name, symbol, decimals, totalSupply } = SWM_TOKEN;
  const swmToken = await deployContract(
    'swmToken',
    [controller, name, symbol, decimals, initialAccount, totalSupply],
    wallets.swmOwner,
  );

  const priceOracle = await deployContract('priceOracle', TOKEN_PRICE, wallets.swmOwner);
  const registry = await deployContract('registry', [swmToken.address], wallets.swmOwner);
  const factory = await deployContract('factory', [registry.address], wallets.swmOwner);
  await registry.addFactory(factory.address);
  const assetRegistry = await deployContract('assetRegistry', [factory.address], wallets.swmOwner);
  const minter = await deployContract(
    'minter',
    [registry.address, assetRegistry.address, priceOracle.address],
    wallets.swmOwner,
  );
  await registry.addMinter(minter.address);

  // send myself some SWM, so that I can stake
  await swmToken.transfer(wallets.tokenManager.address, SWM_TOKEN.totalSupply.div(10));

  return { swmToken, priceOracle, registry, assetRegistry, factory, minter };
};

export const setupDeployer = async (
  wallet: Wallet,
  instances: ContractInstances,
  token: Token,
): Promise<TokenDeployer> => {
  const deployer = new TokenDeployer(wallet, token);
  await deployer.setup();
  deployer.setContractAddress('registry', instances.registry.address);
  deployer.setContractAddress('assetRegistry', instances.assetRegistry.address);
  deployer.setContractAddress('factory', instances.factory.address);
  deployer.setContractAddress('minter', instances.minter.address);
  deployer.setContractAddress('swmToken', instances.swmToken.address);

  return deployer;
};

export async function getDeployedToken(
  wallet: Wallet,
): Promise<{ token: Token; deployer: TokenDeployer; instances: ContractInstances }> {
  const instances = await deployRequiredContracts();
  const token = getTestingToken();
  const deployer = await setupDeployer(wallet, instances, token);
  await deployer.deploy();
  const { addresses } = deployer;
  token.networks = {
    [GANACHE.networkId]: {
      state: TokenState.Deployed,
      deployerState: TokenDeployerState.Finished,
      addresses,
    },
  };
  for (const contractName of ['src20', 'transferRules', 'roles', 'features']) {
    instances[contractName] = new Contract(addresses[contractName], contracts[contractName].abi, wallet);
  }

  return { token, deployer, instances };
}

export async function getDeployedAndMintedToken(wallet: Wallet): Promise<{ token: Token; deployer: TokenDeployer }> {
  const { token, deployer } = await getDeployedToken(wallet);
  await deployer.stakeAndMint();
  token.networks[GANACHE.networkId] = {
    state: TokenState.Minted,
    deployerState: TokenDeployerState.Finished,
    addresses: deployer.addresses,
  };
  return { token, deployer };
}
