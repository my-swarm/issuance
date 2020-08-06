import _AssetRegistry from './AssetRegistry.json';
import _Features from './Featured.json';
import _GetRateMinter from './GetRateMinter.json';
import _Roles from './SRC20Roles.json';
import _Src20Factory from './SRC20Factory.json';
import _Src20Registry from './SRC20Registry.json';
import _SwmToken from './SwmToken.json';
import _TransferRules from './TransferRules.json';
import _SwmPriceOracle from './SWMPriceOracle.json';

export const transferRulesContract = _TransferRules;
export const featuresContract = _Features;
export const rolesContract = _Roles;
export const assetRegistryContract = _AssetRegistry;
export const getRateMinterContract = _GetRateMinter;
export const factoryContract = _Src20Factory;
export const registryContract = _Src20Registry;
export const swmTokenContract = _SwmToken;
export const priceOracleContract = _SwmPriceOracle;

export const contracts = {
  transferRules: transferRulesContract,
  features: featuresContract,
  roles: rolesContract,
  assetRegistry: assetRegistryContract,
  getRateMinter: getRateMinterContract,
  factory: factoryContract,
  registry: registryContract,
  swmToken: swmTokenContract,
  priceOracle: priceOracleContract,
};
