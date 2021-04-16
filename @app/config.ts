import { LocalFundraiser, LocalToken } from '@lib';
import dayjs from 'dayjs';
import { BigNumber } from '@ethersproject/bignumber';

export const MANAGE_TABLE_PER_PAGE = 10;

export const SWM_STAKE_OLD_REGISTRY = 281842;

export const knownAccounts = {
  swarmTreasury: '0x689a20daa8b813a73f86717b572e8fa3a42398d6',
  swarmMnRewards: '0xa450791357cAD888C429386bB1C2Fd27f6C1001b',
};

export const devSwmBalances = {
  [knownAccounts.swarmTreasury]: 8360425,
  [knownAccounts.swarmMnRewards]: 5898828,
};

export const colors = {
  orange: '#f3902d',
  orangeAlt: '#fcad25',
  yellow: '#f9d854',
  blue: '#608db9',
  bright: '#f2f4ed',
  grey1: '#3f4243',
  grey2: '#727272',
  grey3: '#a8a7a7',
  grey4: '#f6f7f7',
  red: '#bd395a',
  green: '#44a75a',
  white: '#ffffff',
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
  address: process.env.NEXT_PUBLIC_DEV_ETH_ADDRESS || 'http://127.0.0.1:8545',
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
  allowTransferRules: true,
  allowAccountFreeze: true,
  allowContractFreeze: true,
  allowForceTransfer: true,
  allowBurn: true,
  allowMint: true,
  assetName: 'Luxury Mediterranean Condo',
  assetDescription: 'Love my condo',
  networkState: undefined,
  nav: 50,
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
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(1, 'M').format('YYYY-MM-DD'),
  softCap: 500000,
  hardCap: 1000000,
  startNow: true,
  maxContributors: 0,
  minInvestmentAmount: 0,
  maxInvestmentAmount: 0,
};

export const devEthereumAccounts = [
  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    title: 'Swarm',
  },
  {
    address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    title: 'Token issuer',
  },
  /*
  {
    address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    title: 'Treasury',
  },
  {
    address: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
    title: 'Reward Pool',
  },
  */
  {
    address: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
    privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
    title: 'Investor 1',
  },
  {
    address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
    title: 'Investor 2',
  },
  {
    address: '0x976ea74026e726554db657fa54763abd0c3a0aa9',
    privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
    title: 'Investor 3',
  },
];
