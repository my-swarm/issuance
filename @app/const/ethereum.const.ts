import { EthereumNetwork } from '@types';

export const etherscanDomains = {
  [EthereumNetwork.Main]: 'etherscan.io',
  [EthereumNetwork.Ropsten]: 'ropsten.etherscan.io',
  [EthereumNetwork.Kovan]: 'kovan.etherscan.io',
  [EthereumNetwork.Rinkeby]: 'rinkeby.etherscan.io',
  [EthereumNetwork.Goerli]: 'goerli.etherscan.io',
};
