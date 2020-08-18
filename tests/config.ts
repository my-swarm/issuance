import { EthereumNetwork } from '@types';
import { SWM_TOKEN_DECIMALS } from '@const';
import { getBnSupply } from '@lib';

export const GANACHE = {
  mnemonic: 'screen crop flip clean airport example clip envelope faint infant limit stay',
  hdPath: "m/44'/60'/0'/0/",
  host: '127.0.0.1',
  port: 8545,
  networkId: EthereumNetwork.Local,
  accounts: [
    {
      address: '0x34039dDd52ea8fFD1056B1025dF51Ef0c65fFc9d',
      privateKey: '0x6e547a6928202f8c1f404040ada7d127cad59a7550823e95a5b0c87ea5b00714',
    },
    {
      address: '0xc117F45Eacf32DB7374f3d6f1F3e6dDEF9C08975',
      privateKey: '0xa8b591e1e4bb5511448c00c73d8890e827665e440978d54be5b5ff55a7c93de9',
    },
    {
      address: '0x7CE94B80DC9F08B96F4F6CB2b96ad18C309ab58B',
      privateKey: '0x23ae06aa49a9c1dec986ae50c04348bc59aecbf252b366837eb6a65ca35ec2fb',
    },
  ],
  wrongAccount: {
    address: '0xC352B4aa77095D3c0c7CAbc28daeEB71E2304363',
    privateKey: '0x9548fbae3f33505592648145244a1a600d0836900f201eef571bb3df861f83f7',
  },
};

const SWM_TOKEN_SUPPLY = 10000000;

export const SWM_TOKEN = {
  name: 'Testing SWM token',
  symbol: 'SWM',
  decimals: SWM_TOKEN_DECIMALS,
  totalSupply: getBnSupply(SWM_TOKEN_SUPPLY, SWM_TOKEN_DECIMALS),
};
