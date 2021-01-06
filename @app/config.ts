import { LocalFundraiser, LocalToken, TransferRules } from '@lib';
import moment from 'moment';
import { BigNumber } from 'ethers';

export const MANAGE_TABLE_PER_PAGE = 10;

export const MASTERNODE_STAKE = 50000;
export const SWM_STAKE_OLD_REGISTRY = 281842;

export const colors = {
  orange: '#f3902d',
  yellow: '#f9d854',
  blue: '#608db9',
  bright: '#f2f4ed',
  grey1: '#3f4243',
  grey2: '#727272',
  grey3: '#a8a7a7',
  grey4: '#f6f7f7',
  red: '#bd395a',
  green: '#44a75a',
};

export const unlimitedAllowance = BigNumber.from(2).pow(256).sub(1);

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
export const FORM = {
  layout,
  tailLayout,
  acceptImage: 'application/png,application/jpeg',
  acceptDocument: 'application/png,application/jpeg', // todo: change this
  maxImageSize: '2MB',
  maxDocumentSize: '2MB',
};

export const isDev = process.env.NEXT_PUBLIC_DEV === '1';

export const devEthereumNode = {
  address: process.env.NEXT_PUBLIC_DEV_ETH_ADDRESS || 'http://127.0.0.1:7545',
  networkId: parseInt(process.env.NEXT_PUBLIC_DEV_ETH_NETWORK_ID) || 31337,
};

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export const devDefaultToken: LocalToken = {
  id: 'xxx-yyy',
  name: 'New Token',
  symbol: 'NWT',
  decimals: 18,
  description: 'Completely new token',
  totalSupply: 5000,
  transferRestrictionsType: TransferRules.None,
  allowAccountFreeze: true,
  allowContractFreeze: true,
  allowForceTransfer: true,
  allowBurn: true,
  allowMint: true,
  assetName: 'Luxury Mediterranean Condo',
  assetDescription: 'Love my condo',
  networks: undefined,
  assetNetValue: 50,
  assetNavDocument: undefined,
  assetImage: undefined,
  assetLegalDocuments: [],
};

export const devDefaultFundraiser: LocalFundraiser = {
  tokenAddress: undefined,
  label: 'Christmas fundraiser',
  baseCurrency: 'USDC',
  contributionsLocked: false,
  tokensToMint: 100000,
  tokenPrice: null,
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().add(1, 'M').format('YYYY-MM-DD'),
  softCap: 500000,
  hardCap: 1000000,
  startNow: true,
  networks: undefined,
};

export const devEthereumAccounts = [
  {
    address: '0xc783df8a850f42e7f7e57013759c285caa701eb6',
    privateKey: '0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122',
    title: 'Swarm',
  },
  {
    address: '0xead9c93b79ae7c1591b1fb5323bd777e86e150d4',
    privateKey: '0xd49743deccbccc5dc7baa8e69e5be03298da8688a15dd202e20f15d5e0e9a9fb',
    title: 'Token issuer',
  },
  {
    address: '0xe5904695748fe4a84b40b3fc79de2277660bd1d3',
    privateKey: '0x23c601ae397441f3ef6f1075dcb0031ff17fb079837beadaf3c84d96c6f3e569',
    title: 'Investor 1',
  },
  {
    address: '0x92561f28ec438ee9831d00d1d59fbdc981b762b2',
    privateKey: '0xee9d129c1997549ee09c0757af5939b2483d80ad649a0eda68e8b0357ad11131',
    title: 'Investor 2',
  },
  {
    address: '0x2ffd013aaa7b5a7da93336c2251075202b33fb2b',
    privateKey: '0x87630b2d1de0fbd5044eb6891b3d9d98c34c8d310c852f98550ba774480e47cc',
    title: 'Investor 3',
  },
  {
    address: '0x9fc9c2dfba3b6cf204c37a5f690619772b926e39',
    privateKey: '0x275cc4a2bfd4f612625204a20a2280ab53a6da2d14860c47a9f5affe58ad86d4',
    title: 'Investor 4',
  },
  {
    address: '0xfbc51a9582d031f2ceaad3959256596c5d3a5468',
    privateKey: '0x7f307c41137d1ed409f0a7b028f6c7596f12734b1d289b58099b99d60a96efff',
    title: 'Investor 5',
  },
  {
    address: '0x84fae3d3cba24a97817b2a18c2421d462dbbce9f',
    privateKey: '0x2a8aede924268f84156a00761de73998dac7bf703408754b776ff3f873bcec60',
    title: 'Investor 6',
  },
  {
    address: '0xfa3bdc8709226da0da13a4d904c8b66f16c3c8ba',
    privateKey: '0x8b24fd94f1ce869d81a34b95351e7f97b2cd88a891d5c00abc33d0ec9501902e',
    title: 'Investor 7',
  },
  {
    address: '0x6c365935ca8710200c7595f0a72eb6023a7706cd',
    privateKey: '0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b29085',
    title: 'Investor 8',
  },
  {
    address: '0xd7de703d9bbc4602242d0f3149e5ffcd30eb3adf',
    privateKey: '0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b29086',
    title: 'Investor 9',
  },
  {
    address: '0x532792b73c0c6e7565912e7039c59986f7e1dd1f',
    privateKey: '0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b29087',
    title: 'Investor 10',
  },
];
