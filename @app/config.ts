import { EthereumNetwork, LocalFundraiser, LocalToken } from '@lib';
import dayjs from 'dayjs';
import { BigNumber } from '@ethersproject/bignumber';

export const MANAGE_TABLE_PER_PAGE = 10;

export const SWM_STAKE_OLD_REGISTRY = 281842;

export const knownAccounts = {
  swarmTreasuryOld: '0x689a20daa8b813a73f86717b572e8fa3a42398d6',
  swarmTreasury: '0x33e33760c3e3e452b6c7692fa94654b8fc48065b',
  swarmMnRewards: '0xa450791357cAD888C429386bB1C2Fd27f6C1001b',
};

export const graphqlEndpoints = {
  [EthereumNetwork.Local]: 'http://localhost:8100/subgraphs/name/my-swarm/issuance',
  [EthereumNetwork.Main]: 'https://api.thegraph.com/subgraphs/name/my-swarm/issuance',
  [EthereumNetwork.Kovan]: 'https://api.thegraph.com/subgraphs/name/my-swarm/issuance-kovan',
  [EthereumNetwork.Mumbai]: 'https://api.thegraph.com/subgraphs/name/my-swarm/issuance-mumbai',
  // [EthereumNetwork.Polygon]: 'https://api.thegraph.com/subgraphs/name/my-swarm/issuance-kovan',
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
  allowAutoburn: false,
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
    address: '0xb9a96b5c322e02ab6bc337be1448c4bc5b040fef',
    privateKey: '0xfceb92abc33d58c70fc0012ef5283a5df08abef64f2e865693b9f55e201eb585',
    title: 'Swarm',
  },
  {
    address: '0x9af7698ab9edfff376ae519d3fa87fe44b7dd114',
    privateKey: '0xd33a672f8b35d436300ac26446f995cf76a8da2fe371e92c836b027928893c89',
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
    address: '0x5fa6cb828574aef0c397e59cad2aaaf04dbe0f98',
    privateKey: '0xecdfe96f4e966b08a157fad60a86cb20bf0e9436437108276b02894cf2975c8a',
    title: 'Investor 1',
  },
  {
    address: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
    title: 'Investor 2',
  },
  {
    address: '0x9c63d1698c0dc928d09ba58251a1d55f5095e408',
    privateKey: '0x1353523cc469a7440c5470771d2e51f6fafefc593465b409a33f4b5754312fa9',
    title: 'Investor 3',
  },
];
