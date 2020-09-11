import { EthereumNetwork, TokenNetworkData, EthereumAddress, EthereumToken } from '@types';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

export const tokenFeatures = {
  allowAccountFreeze: 'Allow Account Freeze',
  allowContractFreeze: 'Allow Contract Freeze',
  allowForceTransfer: 'Allow Force Transfer',
  allowBurn: 'Allow Burn',
  allowMint: 'Allow Mint',
};

export const FORM = {
  layout,
  tailLayout,
  acceptImage: 'application/png,application/jpeg',
  acceptDocument: 'application/png,application/jpeg', // todo: change this
  maxImageSize: '2MB',
  maxDocumentSize: '2MB',
};

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
