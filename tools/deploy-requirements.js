const ethers = require('ethers');
const ganache = require('ganache-cli');
const { ContractFactory, providers, Wallet, BigNumber } = ethers;

const contracts = {
  transferRules: require('../@contracts/TransferRules.json'),
  features: require('../@contracts/Featured.json'),
  roles: require('../@contracts/SRC20Roles.json'),
  assetRegistry: require('../@contracts/AssetRegistry.json'),
  getRateMinter: require('../@contracts/GetRateMinter.json'),
  factory: require('../@contracts/SRC20Factory.json'),
  registry: require('../@contracts/SRC20Registry.json'),
  swmToken: require('../@contracts/SwmToken.json'),
  priceOracle: require('../@contracts/SWMPriceOracle.json'),
  src20: require('../@contracts/SRC20.json'),
};

function getBnSupply(intSupply, decimals) {
  return BigNumber.from(`${intSupply}${'0'.repeat(decimals)}`);
}

const GANACHE = {
  mnemonic: 'screen crop flip clean airport example clip envelope faint infant limit stay',
  hdPath: "m/44'/60'/0'/0/",
  host: '127.0.0.1',
  port: 7546,
  networkId: 1337,
  accounts: [
    {
      address: '0x34039dDd52ea8fFD1056B1025dF51Ef0c65fFc9d',
      privateKey: '0x6e547a6928202f8c1f404040ada7d127cad59a7550823e95a5b0c87ea5b00714',
    },
    {
      address: '0xc117F45Eacf32DB7374f3d6f1F3e6dDEF9C08975',
      privateKey: '0xa8b591e1e4bb5511448c00c73d8890e827665e440978d54be5b5ff55a7c93de9',
    },
  ],
};

const SWM_TOKEN = {
  name: 'Testing SWM token',
  symbol: 'SWM',
  decimals: 18,
  totalSupply: getBnSupply(10000000, 18),
};

const TOKEN_PRICE = [5, 10]; // the token price ~ 0.5 USD

const provider = new providers.JsonRpcProvider('http://127.0.0.1:7545');

const swmOwner = new Wallet(GANACHE.accounts[0].privateKey, provider);
const tokenManager = new Wallet(GANACHE.accounts[1].privateKey, provider);

async function deployContract(contractName, constructorArgs, owner) {
  const artifacts = contracts[contractName];
  if (!artifacts) {
    throw new Error('Artifacts not defnied: ' + contractName);
  }
  const factory = new ContractFactory(artifacts.abi, artifacts.bytecode, owner);
  const instance = await factory.deploy(...constructorArgs);
  await instance.deployTransaction.wait();
  return instance;
}

async function deployRequiredContracts() {
  const controller = swmOwner.address;
  const initialAccount = swmOwner.address;
  const { name, symbol, decimals, totalSupply } = SWM_TOKEN;
  const swmToken = await deployContract(
    'swmToken',
    [controller, name, symbol, decimals, initialAccount, totalSupply],
    swmOwner,
  );

  const priceOracle = await deployContract('priceOracle', TOKEN_PRICE, swmOwner);
  const registry = await deployContract('registry', [swmToken.address], swmOwner);
  const factory = await deployContract('factory', [registry.address], swmOwner);
  await registry.addFactory(factory.address);
  const assetRegistry = await deployContract('assetRegistry', [factory.address], swmOwner);
  const getRateMinter = await deployContract(
    'getRateMinter',
    [registry.address, assetRegistry.address, priceOracle.address],
    swmOwner,
  );
  await registry.addMinter(getRateMinter.address);

  // send myself some SWM, so that I can stake
  await swmToken.transfer(tokenManager.address, SWM_TOKEN.totalSupply.div(10));

  return { swmToken, priceOracle, registry, assetRegistry, factory, getRateMinter };
}

async function main() {
  const instances = await deployRequiredContracts();
  for (const [key, instance] of Object.entries(instances)) {
    console.log(`${key}: ${instance.address}`);
  }
}

main()
  .then(() => console.log('done'))
  .catch((e) => console.error(e));
