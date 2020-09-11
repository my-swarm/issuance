import { EthereumNetwork, EthereumToken } from '@types';

export const BASE_CURRENCIES: EthereumToken[] = [
  {
    name: 'USDC',
    symbol: 'USDC',
    addresses: {
      [EthereumNetwork.Main]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [EthereumNetwork.Kovan]: '0xCa5A93FA0812992C0e1B6cf0A63e189dc682F542',
      [EthereumNetwork.Local]: '0x500D1d6A4c7D8Ae28240b47c8FCde034D827fD5e',
    },
  },
];

export const etherscanDomains = {
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Ropsten]: 'ropsten.etherscan.io',
  [EthereumNetwork.Kovan]: 'kovan.etherscan.io',
  [EthereumNetwork.Rinkeby]: 'rinkeby.etherscan.io',
  [EthereumNetwork.Goerli]: 'goerli.etherscan.io',
};
