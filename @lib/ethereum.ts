export type Uuid = string;
export type EthereumAddress = string;
import localAddresses from '@contracts/addresses/local.json';

export enum EthereumNetwork {
  Unknown = 0,
  Main = 1,
  Kovan = 42,
  Mumbai = 80001,
  Polygon = 137,
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
      [EthereumNetwork.Kovan]: '0xF2ed3cA62b1D4dd57ad46184634f6b1F8Be85EE3',
      [EthereumNetwork.Mumbai]: '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e',
      [EthereumNetwork.Polygon]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [EthereumNetwork.Local]: localAddresses.USDC,
    },
  },
};

export const etherscanDomains = {
  [EthereumNetwork.Local]: 'localscan.l',
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Kovan]: 'kovan.etherscan.io',
  [EthereumNetwork.Mumbai]: 'mumbai.polygonscan.com',
  [EthereumNetwork.Polygon]: 'polygonscan.com',
};

export const networkNames = {
  [EthereumNetwork.Local]: 'Local',
  [EthereumNetwork.Main]: 'Ethereum',
  [EthereumNetwork.Polygon]: 'Polygon',
  [EthereumNetwork.Kovan]: 'Kovan testnet',
  [EthereumNetwork.Mumbai]: 'Mumbai testnet',
};

export function getNetwork(networkId: number): string {
  return networkNames[networkId] || 'Unsupported chain';
}

export const supportedNetworks = [
  EthereumNetwork.Main,
  EthereumNetwork.Polygon,
  EthereumNetwork.Kovan,
  EthereumNetwork.Mumbai,
];

export const exchanges = {
  [EthereumNetwork.Main]: 'https://app.uniswap.org/#/swap?theme=dark&',
  [EthereumNetwork.Polygon]: 'https://quickswap.exchange/#/swap?',
};
