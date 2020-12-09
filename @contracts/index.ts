export * from './abis';
export * from './addresses';
import b from './bytecodes.json';
export const bytecodes = b;

interface ContractMeta {
  shortName: string;
  isBase: boolean;
}

export const contractsMeta: { [key: string]: ContractMeta } = {
  SRC20Registry: { shortName: 'registry', isBase: true },
  SRC20Factory: { shortName: 'factory', isBase: true },
  AssetRegistry: { shortName: 'assetRegistry', isBase: true },
  TokenMinter: { shortName: 'minter', isBase: true },
  SWMPriceOracle: { shortName: 'swmPriceOracle', isBase: true },
  FundraiserManager: { shortName: 'fundraiserManager', isBase: true },
  USDC: { shortName: 'usdc', isBase: true },
  SwmToken: { shortName: 'swm', isBase: true },
  Disperse: { shortName: 'disperse', isBase: true },

  SRC20: { shortName: 'src20', isBase: false },
  Features: { shortName: 'features', isBase: false },
  SRC20Roles: { shortName: 'roles', isBase: false },
  TransferRules: { shortName: 'transferRules', isBase: false },
  Fundraiser: { shortName: 'fundraiser', isBase: false },
  ContributorRestrictions: { shortName: 'contributorRestrictions', isBase: false },
  AffiliateManager: { shortName: 'affiliateManager', isBase: false },

  ERC20: { shortName: 'erc20', isBase: false },
};

const nameMap = {};
for (const [key, val] of Object.entries(contractsMeta)) {
  nameMap[key] = key;
  nameMap[val.shortName] = key;
}

export const contractNameMap = nameMap;
