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
  port: 7545,
  networkId: 31337,
  accounts: [
    {
      address: '0xc783df8a850f42e7f7e57013759c285caa701eb6',
      privateKey: '0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122',
    },
    {
      address: '0xead9c93b79ae7c1591b1fb5323bd777e86e150d4',
      privateKey: '0xd49743deccbccc5dc7baa8e69e5be03298da8688a15dd202e20f15d5e0e9a9fb',
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

const provider = new providers.JsonRpcProvider('http://192.168.137.100:7545');

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
