import { getNetwork } from '@ethersproject/networks';

export type Uuid = string;
export type EthereumAddress = string;
import localAddresses from '@contracts/addresses/local.json';

export enum EthereumNetwork {
  Unknown = 0,
  Main = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Local = 31337, // buidler node
}

export interface EthereumToken {
  name: string;
  symbol: string;
  decimals: number;
  addresses: { [index in EthereumNetwork]?: EthereumAddress };
}

export const BASE_CURRENCIES: { [key: string]: EthereumToken } = {
  USDC: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [EthereumNetwork.Main]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [EthereumNetwork.Kovan]: '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5',
      [EthereumNetwork.Local]: localAddresses.USDC,
    },
  },
};

export const etherscanDomains = {
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Ropsten]: 'ropsten.etherscan.io',
  [EthereumNetwork.Kovan]: 'kovan.etherscan.io',
  [EthereumNetwork.Rinkeby]: 'rinkeby.etherscan.io',
  [EthereumNetwork.Goerli]: 'goerli.etherscan.io',
};

export function getNetworkName(networkId: number): string {
  const name = getNetwork(networkId).name;
  return name === 'homestead' ? 'mainnet' : name;
}
