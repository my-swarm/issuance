import { EthereumNetwork, EthereumToken } from '@types';

export const BASE_CURRENCIES: { [key: string]: EthereumToken } = {
  USDC: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    addresses: {
      [EthereumNetwork.Main]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [EthereumNetwork.Kovan]: '0xCa5A93FA0812992C0e1B6cf0A63e189dc682F542',
      [EthereumNetwork.Local]: '0xD6C850aeBFDC46D7F4c207e445cC0d6B0919BDBe',
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
