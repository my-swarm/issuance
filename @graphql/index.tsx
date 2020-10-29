import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export type Contribution = {
  __typename?: 'Contribution';
  id: Scalars['ID'];
  contributor: Contributor;
  type: ContributorStatus;
  timestamp: Scalars['Int'];
  amount: Scalars['BigInt'];
};

export type Contribution_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  contributor?: Maybe<Scalars['String']>;
  contributor_not?: Maybe<Scalars['String']>;
  contributor_gt?: Maybe<Scalars['String']>;
  contributor_lt?: Maybe<Scalars['String']>;
  contributor_gte?: Maybe<Scalars['String']>;
  contributor_lte?: Maybe<Scalars['String']>;
  contributor_in?: Maybe<Array<Scalars['String']>>;
  contributor_not_in?: Maybe<Array<Scalars['String']>>;
  contributor_contains?: Maybe<Scalars['String']>;
  contributor_not_contains?: Maybe<Scalars['String']>;
  contributor_starts_with?: Maybe<Scalars['String']>;
  contributor_not_starts_with?: Maybe<Scalars['String']>;
  contributor_ends_with?: Maybe<Scalars['String']>;
  contributor_not_ends_with?: Maybe<Scalars['String']>;
  type?: Maybe<ContributorStatus>;
  type_not?: Maybe<ContributorStatus>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Contribution_OrderBy {
  Id = 'id',
  Contributor = 'contributor',
  Type = 'type',
  Timestamp = 'timestamp',
  Amount = 'amount'
}

export type Contributor = {
  __typename?: 'Contributor';
  id: Scalars['ID'];
  fundraiser: Fundraiser;
  status: ContributorStatus;
  address: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  contributions?: Maybe<Array<Contribution>>;
};


export type ContributorContributionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contribution_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contribution_Filter>;
};

export enum ContributorStatus {
  Pending = 'Pending',
  Qualified = 'Qualified',
  Removed = 'Removed',
  Refunded = 'Refunded'
}

export type Contributor_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  fundraiser?: Maybe<Scalars['String']>;
  fundraiser_not?: Maybe<Scalars['String']>;
  fundraiser_gt?: Maybe<Scalars['String']>;
  fundraiser_lt?: Maybe<Scalars['String']>;
  fundraiser_gte?: Maybe<Scalars['String']>;
  fundraiser_lte?: Maybe<Scalars['String']>;
  fundraiser_in?: Maybe<Array<Scalars['String']>>;
  fundraiser_not_in?: Maybe<Array<Scalars['String']>>;
  fundraiser_contains?: Maybe<Scalars['String']>;
  fundraiser_not_contains?: Maybe<Scalars['String']>;
  fundraiser_starts_with?: Maybe<Scalars['String']>;
  fundraiser_not_starts_with?: Maybe<Scalars['String']>;
  fundraiser_ends_with?: Maybe<Scalars['String']>;
  fundraiser_not_ends_with?: Maybe<Scalars['String']>;
  status?: Maybe<ContributorStatus>;
  status_not?: Maybe<ContributorStatus>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Contributor_OrderBy {
  Id = 'id',
  Fundraiser = 'fundraiser',
  Status = 'status',
  Address = 'address',
  Amount = 'amount',
  Contributions = 'contributions'
}

export type Features = {
  __typename?: 'Features';
  id: Scalars['ID'];
  token: Token;
  forceTransfer: Scalars['Boolean'];
  tokenFreeze: Scalars['Boolean'];
  accountFreeze: Scalars['Boolean'];
  accountBurn: Scalars['Boolean'];
};

export type Features_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  forceTransfer?: Maybe<Scalars['Boolean']>;
  forceTransfer_not?: Maybe<Scalars['Boolean']>;
  forceTransfer_in?: Maybe<Array<Scalars['Boolean']>>;
  forceTransfer_not_in?: Maybe<Array<Scalars['Boolean']>>;
  tokenFreeze?: Maybe<Scalars['Boolean']>;
  tokenFreeze_not?: Maybe<Scalars['Boolean']>;
  tokenFreeze_in?: Maybe<Array<Scalars['Boolean']>>;
  tokenFreeze_not_in?: Maybe<Array<Scalars['Boolean']>>;
  accountFreeze?: Maybe<Scalars['Boolean']>;
  accountFreeze_not?: Maybe<Scalars['Boolean']>;
  accountFreeze_in?: Maybe<Array<Scalars['Boolean']>>;
  accountFreeze_not_in?: Maybe<Array<Scalars['Boolean']>>;
  accountBurn?: Maybe<Scalars['Boolean']>;
  accountBurn_not?: Maybe<Scalars['Boolean']>;
  accountBurn_in?: Maybe<Array<Scalars['Boolean']>>;
  accountBurn_not_in?: Maybe<Array<Scalars['Boolean']>>;
};

export enum Features_OrderBy {
  Id = 'id',
  Token = 'token',
  ForceTransfer = 'forceTransfer',
  TokenFreeze = 'tokenFreeze',
  AccountFreeze = 'accountFreeze',
  AccountBurn = 'accountBurn'
}

export type Fundraiser = {
  __typename?: 'Fundraiser';
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  token: Token;
  label: Scalars['String'];
  startDate: Scalars['Int'];
  endDate: Scalars['Int'];
  softCap: Scalars['BigInt'];
  hardCap: Scalars['BigInt'];
  supply: Scalars['BigInt'];
  baseCurrency?: Maybe<Scalars['Bytes']>;
  tokenPrice?: Maybe<Scalars['BigInt']>;
  affiliateManager?: Maybe<Scalars['Bytes']>;
  contributorRestrictions?: Maybe<Scalars['Bytes']>;
  minter?: Maybe<Scalars['Bytes']>;
  contributionsLocked?: Maybe<Scalars['Boolean']>;
  amountQualified: Scalars['BigInt'];
  amountPending: Scalars['BigInt'];
  amountRefunded: Scalars['BigInt'];
  amountWithdrawn: Scalars['BigInt'];
  status: FundraiserStatus;
  contributors?: Maybe<Array<Contributor>>;
};


export type FundraiserContributorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contributor_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contributor_Filter>;
};

export enum FundraiserStatus {
  SettingUp = 'SettingUp',
  Setup = 'Setup',
  Running = 'Running',
  Finished = 'Finished',
  Canceled = 'Canceled'
}

export type Fundraiser_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  label_not?: Maybe<Scalars['String']>;
  label_gt?: Maybe<Scalars['String']>;
  label_lt?: Maybe<Scalars['String']>;
  label_gte?: Maybe<Scalars['String']>;
  label_lte?: Maybe<Scalars['String']>;
  label_in?: Maybe<Array<Scalars['String']>>;
  label_not_in?: Maybe<Array<Scalars['String']>>;
  label_contains?: Maybe<Scalars['String']>;
  label_not_contains?: Maybe<Scalars['String']>;
  label_starts_with?: Maybe<Scalars['String']>;
  label_not_starts_with?: Maybe<Scalars['String']>;
  label_ends_with?: Maybe<Scalars['String']>;
  label_not_ends_with?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Int']>;
  startDate_not?: Maybe<Scalars['Int']>;
  startDate_gt?: Maybe<Scalars['Int']>;
  startDate_lt?: Maybe<Scalars['Int']>;
  startDate_gte?: Maybe<Scalars['Int']>;
  startDate_lte?: Maybe<Scalars['Int']>;
  startDate_in?: Maybe<Array<Scalars['Int']>>;
  startDate_not_in?: Maybe<Array<Scalars['Int']>>;
  endDate?: Maybe<Scalars['Int']>;
  endDate_not?: Maybe<Scalars['Int']>;
  endDate_gt?: Maybe<Scalars['Int']>;
  endDate_lt?: Maybe<Scalars['Int']>;
  endDate_gte?: Maybe<Scalars['Int']>;
  endDate_lte?: Maybe<Scalars['Int']>;
  endDate_in?: Maybe<Array<Scalars['Int']>>;
  endDate_not_in?: Maybe<Array<Scalars['Int']>>;
  softCap?: Maybe<Scalars['BigInt']>;
  softCap_not?: Maybe<Scalars['BigInt']>;
  softCap_gt?: Maybe<Scalars['BigInt']>;
  softCap_lt?: Maybe<Scalars['BigInt']>;
  softCap_gte?: Maybe<Scalars['BigInt']>;
  softCap_lte?: Maybe<Scalars['BigInt']>;
  softCap_in?: Maybe<Array<Scalars['BigInt']>>;
  softCap_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hardCap?: Maybe<Scalars['BigInt']>;
  hardCap_not?: Maybe<Scalars['BigInt']>;
  hardCap_gt?: Maybe<Scalars['BigInt']>;
  hardCap_lt?: Maybe<Scalars['BigInt']>;
  hardCap_gte?: Maybe<Scalars['BigInt']>;
  hardCap_lte?: Maybe<Scalars['BigInt']>;
  hardCap_in?: Maybe<Array<Scalars['BigInt']>>;
  hardCap_not_in?: Maybe<Array<Scalars['BigInt']>>;
  supply?: Maybe<Scalars['BigInt']>;
  supply_not?: Maybe<Scalars['BigInt']>;
  supply_gt?: Maybe<Scalars['BigInt']>;
  supply_lt?: Maybe<Scalars['BigInt']>;
  supply_gte?: Maybe<Scalars['BigInt']>;
  supply_lte?: Maybe<Scalars['BigInt']>;
  supply_in?: Maybe<Array<Scalars['BigInt']>>;
  supply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  baseCurrency?: Maybe<Scalars['Bytes']>;
  baseCurrency_not?: Maybe<Scalars['Bytes']>;
  baseCurrency_in?: Maybe<Array<Scalars['Bytes']>>;
  baseCurrency_not_in?: Maybe<Array<Scalars['Bytes']>>;
  baseCurrency_contains?: Maybe<Scalars['Bytes']>;
  baseCurrency_not_contains?: Maybe<Scalars['Bytes']>;
  tokenPrice?: Maybe<Scalars['BigInt']>;
  tokenPrice_not?: Maybe<Scalars['BigInt']>;
  tokenPrice_gt?: Maybe<Scalars['BigInt']>;
  tokenPrice_lt?: Maybe<Scalars['BigInt']>;
  tokenPrice_gte?: Maybe<Scalars['BigInt']>;
  tokenPrice_lte?: Maybe<Scalars['BigInt']>;
  tokenPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  affiliateManager?: Maybe<Scalars['Bytes']>;
  affiliateManager_not?: Maybe<Scalars['Bytes']>;
  affiliateManager_in?: Maybe<Array<Scalars['Bytes']>>;
  affiliateManager_not_in?: Maybe<Array<Scalars['Bytes']>>;
  affiliateManager_contains?: Maybe<Scalars['Bytes']>;
  affiliateManager_not_contains?: Maybe<Scalars['Bytes']>;
  contributorRestrictions?: Maybe<Scalars['Bytes']>;
  contributorRestrictions_not?: Maybe<Scalars['Bytes']>;
  contributorRestrictions_in?: Maybe<Array<Scalars['Bytes']>>;
  contributorRestrictions_not_in?: Maybe<Array<Scalars['Bytes']>>;
  contributorRestrictions_contains?: Maybe<Scalars['Bytes']>;
  contributorRestrictions_not_contains?: Maybe<Scalars['Bytes']>;
  minter?: Maybe<Scalars['Bytes']>;
  minter_not?: Maybe<Scalars['Bytes']>;
  minter_in?: Maybe<Array<Scalars['Bytes']>>;
  minter_not_in?: Maybe<Array<Scalars['Bytes']>>;
  minter_contains?: Maybe<Scalars['Bytes']>;
  minter_not_contains?: Maybe<Scalars['Bytes']>;
  contributionsLocked?: Maybe<Scalars['Boolean']>;
  contributionsLocked_not?: Maybe<Scalars['Boolean']>;
  contributionsLocked_in?: Maybe<Array<Scalars['Boolean']>>;
  contributionsLocked_not_in?: Maybe<Array<Scalars['Boolean']>>;
  amountQualified?: Maybe<Scalars['BigInt']>;
  amountQualified_not?: Maybe<Scalars['BigInt']>;
  amountQualified_gt?: Maybe<Scalars['BigInt']>;
  amountQualified_lt?: Maybe<Scalars['BigInt']>;
  amountQualified_gte?: Maybe<Scalars['BigInt']>;
  amountQualified_lte?: Maybe<Scalars['BigInt']>;
  amountQualified_in?: Maybe<Array<Scalars['BigInt']>>;
  amountQualified_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPending?: Maybe<Scalars['BigInt']>;
  amountPending_not?: Maybe<Scalars['BigInt']>;
  amountPending_gt?: Maybe<Scalars['BigInt']>;
  amountPending_lt?: Maybe<Scalars['BigInt']>;
  amountPending_gte?: Maybe<Scalars['BigInt']>;
  amountPending_lte?: Maybe<Scalars['BigInt']>;
  amountPending_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPending_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountRefunded?: Maybe<Scalars['BigInt']>;
  amountRefunded_not?: Maybe<Scalars['BigInt']>;
  amountRefunded_gt?: Maybe<Scalars['BigInt']>;
  amountRefunded_lt?: Maybe<Scalars['BigInt']>;
  amountRefunded_gte?: Maybe<Scalars['BigInt']>;
  amountRefunded_lte?: Maybe<Scalars['BigInt']>;
  amountRefunded_in?: Maybe<Array<Scalars['BigInt']>>;
  amountRefunded_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountWithdrawn?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_not?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_gt?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_lt?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_gte?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_lte?: Maybe<Scalars['BigInt']>;
  amountWithdrawn_in?: Maybe<Array<Scalars['BigInt']>>;
  amountWithdrawn_not_in?: Maybe<Array<Scalars['BigInt']>>;
  status?: Maybe<FundraiserStatus>;
  status_not?: Maybe<FundraiserStatus>;
};

export enum Fundraiser_OrderBy {
  Id = 'id',
  Owner = 'owner',
  Token = 'token',
  Label = 'label',
  StartDate = 'startDate',
  EndDate = 'endDate',
  SoftCap = 'softCap',
  HardCap = 'hardCap',
  Supply = 'supply',
  BaseCurrency = 'baseCurrency',
  TokenPrice = 'tokenPrice',
  AffiliateManager = 'affiliateManager',
  ContributorRestrictions = 'contributorRestrictions',
  Minter = 'minter',
  ContributionsLocked = 'contributionsLocked',
  AmountQualified = 'amountQualified',
  AmountPending = 'amountPending',
  AmountRefunded = 'amountRefunded',
  AmountWithdrawn = 'amountWithdrawn',
  Status = 'status',
  Contributors = 'contributors'
}

export type GreylistedAccount = {
  __typename?: 'GreylistedAccount';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  createdAt: Scalars['BigInt'];
  token?: Maybe<Token>;
};

export type GreylistedAccount_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
};

export enum GreylistedAccount_OrderBy {
  Id = 'id',
  Address = 'address',
  CreatedAt = 'createdAt',
  Token = 'token'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  token?: Maybe<Token>;
  tokens: Array<Token>;
  whitelistedAccount?: Maybe<WhitelistedAccount>;
  whitelistedAccounts: Array<WhitelistedAccount>;
  greylistedAccount?: Maybe<GreylistedAccount>;
  greylistedAccounts: Array<GreylistedAccount>;
  transferRules: Array<TransferRules>;
  features: Array<Features>;
  transferRequest?: Maybe<TransferRequest>;
  transferRequests: Array<TransferRequest>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolders: Array<TokenHolder>;
  fundraiser?: Maybe<Fundraiser>;
  fundraisers: Array<Fundraiser>;
  contributor?: Maybe<Contributor>;
  contributors: Array<Contributor>;
  contribution?: Maybe<Contribution>;
  contributions: Array<Contribution>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryWhitelistedAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryWhitelistedAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<WhitelistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<WhitelistedAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryGreylistedAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryGreylistedAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<GreylistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<GreylistedAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTransferRulesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferRules_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferRules_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFeaturesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Features_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Features_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTransferRequestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTransferRequestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferRequest_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTokenHolderArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolder_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolder_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFundraiserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFundraisersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fundraiser_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fundraiser_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryContributorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryContributorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contributor_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contributor_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryContributionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryContributionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contribution_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contribution_Filter>;
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  __typename?: 'Subscription';
  token?: Maybe<Token>;
  tokens: Array<Token>;
  whitelistedAccount?: Maybe<WhitelistedAccount>;
  whitelistedAccounts: Array<WhitelistedAccount>;
  greylistedAccount?: Maybe<GreylistedAccount>;
  greylistedAccounts: Array<GreylistedAccount>;
  transferRules: Array<TransferRules>;
  features: Array<Features>;
  transferRequest?: Maybe<TransferRequest>;
  transferRequests: Array<TransferRequest>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolders: Array<TokenHolder>;
  fundraiser?: Maybe<Fundraiser>;
  fundraisers: Array<Fundraiser>;
  contributor?: Maybe<Contributor>;
  contributors: Array<Contributor>;
  contribution?: Maybe<Contribution>;
  contributions: Array<Contribution>;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionWhitelistedAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionWhitelistedAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<WhitelistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<WhitelistedAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionGreylistedAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionGreylistedAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<GreylistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<GreylistedAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferRulesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferRules_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferRules_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeaturesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Features_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Features_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferRequestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferRequestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferRequest_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokenHolderArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolder_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolder_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFundraiserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFundraisersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fundraiser_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fundraiser_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionContributorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionContributorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contributor_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contributor_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionContributionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionContributionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contribution_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contribution_Filter>;
  block?: Maybe<Block_Height>;
};

export type Token = {
  __typename?: 'Token';
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  address: Scalars['Bytes'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  decimals: Scalars['Int'];
  supply: Scalars['BigInt'];
  maxSupply: Scalars['BigInt'];
  availableSupply: Scalars['BigInt'];
  stake: Scalars['BigInt'];
  nav?: Maybe<Scalars['Int']>;
  kyaHash?: Maybe<Scalars['Bytes']>;
  kyaUrl?: Maybe<Scalars['String']>;
  isFrozen: Scalars['Boolean'];
  isFrozenBy?: Maybe<Scalars['Bytes']>;
  whitelist: Array<WhitelistedAccount>;
  greylist: Array<GreylistedAccount>;
  holders: Array<TokenHolder>;
  transferRequests: Array<TransferRequest>;
  transfers: Array<Transfer>;
  fundraisers: Array<Fundraiser>;
  currentFundraiser?: Maybe<Fundraiser>;
  transferRules?: Maybe<TransferRules>;
  features?: Maybe<Features>;
};


export type TokenWhitelistArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<WhitelistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<WhitelistedAccount_Filter>;
};


export type TokenGreylistArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<GreylistedAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<GreylistedAccount_Filter>;
};


export type TokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolder_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolder_Filter>;
};


export type TokenTransferRequestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferRequest_Filter>;
};


export type TokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transfer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transfer_Filter>;
};


export type TokenFundraisersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fundraiser_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fundraiser_Filter>;
};

export type TokenHolder = {
  __typename?: 'TokenHolder';
  id: Scalars['ID'];
  token: Token;
  address: Scalars['Bytes'];
  balance: Scalars['BigInt'];
  createdAt: Scalars['Int'];
  updatedAt: Scalars['Int'];
  isFrozen: Scalars['Boolean'];
};

export type TokenHolder_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  balance?: Maybe<Scalars['BigInt']>;
  balance_not?: Maybe<Scalars['BigInt']>;
  balance_gt?: Maybe<Scalars['BigInt']>;
  balance_lt?: Maybe<Scalars['BigInt']>;
  balance_gte?: Maybe<Scalars['BigInt']>;
  balance_lte?: Maybe<Scalars['BigInt']>;
  balance_in?: Maybe<Array<Scalars['BigInt']>>;
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt?: Maybe<Scalars['Int']>;
  createdAt_not?: Maybe<Scalars['Int']>;
  createdAt_gt?: Maybe<Scalars['Int']>;
  createdAt_lt?: Maybe<Scalars['Int']>;
  createdAt_gte?: Maybe<Scalars['Int']>;
  createdAt_lte?: Maybe<Scalars['Int']>;
  createdAt_in?: Maybe<Array<Scalars['Int']>>;
  createdAt_not_in?: Maybe<Array<Scalars['Int']>>;
  updatedAt?: Maybe<Scalars['Int']>;
  updatedAt_not?: Maybe<Scalars['Int']>;
  updatedAt_gt?: Maybe<Scalars['Int']>;
  updatedAt_lt?: Maybe<Scalars['Int']>;
  updatedAt_gte?: Maybe<Scalars['Int']>;
  updatedAt_lte?: Maybe<Scalars['Int']>;
  updatedAt_in?: Maybe<Array<Scalars['Int']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  isFrozen?: Maybe<Scalars['Boolean']>;
  isFrozen_not?: Maybe<Scalars['Boolean']>;
  isFrozen_in?: Maybe<Array<Scalars['Boolean']>>;
  isFrozen_not_in?: Maybe<Array<Scalars['Boolean']>>;
};

export enum TokenHolder_OrderBy {
  Id = 'id',
  Token = 'token',
  Address = 'address',
  Balance = 'balance',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  IsFrozen = 'isFrozen'
}

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  supply?: Maybe<Scalars['BigInt']>;
  supply_not?: Maybe<Scalars['BigInt']>;
  supply_gt?: Maybe<Scalars['BigInt']>;
  supply_lt?: Maybe<Scalars['BigInt']>;
  supply_gte?: Maybe<Scalars['BigInt']>;
  supply_lte?: Maybe<Scalars['BigInt']>;
  supply_in?: Maybe<Array<Scalars['BigInt']>>;
  supply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  maxSupply?: Maybe<Scalars['BigInt']>;
  maxSupply_not?: Maybe<Scalars['BigInt']>;
  maxSupply_gt?: Maybe<Scalars['BigInt']>;
  maxSupply_lt?: Maybe<Scalars['BigInt']>;
  maxSupply_gte?: Maybe<Scalars['BigInt']>;
  maxSupply_lte?: Maybe<Scalars['BigInt']>;
  maxSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  maxSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  availableSupply?: Maybe<Scalars['BigInt']>;
  availableSupply_not?: Maybe<Scalars['BigInt']>;
  availableSupply_gt?: Maybe<Scalars['BigInt']>;
  availableSupply_lt?: Maybe<Scalars['BigInt']>;
  availableSupply_gte?: Maybe<Scalars['BigInt']>;
  availableSupply_lte?: Maybe<Scalars['BigInt']>;
  availableSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  availableSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stake?: Maybe<Scalars['BigInt']>;
  stake_not?: Maybe<Scalars['BigInt']>;
  stake_gt?: Maybe<Scalars['BigInt']>;
  stake_lt?: Maybe<Scalars['BigInt']>;
  stake_gte?: Maybe<Scalars['BigInt']>;
  stake_lte?: Maybe<Scalars['BigInt']>;
  stake_in?: Maybe<Array<Scalars['BigInt']>>;
  stake_not_in?: Maybe<Array<Scalars['BigInt']>>;
  nav?: Maybe<Scalars['Int']>;
  nav_not?: Maybe<Scalars['Int']>;
  nav_gt?: Maybe<Scalars['Int']>;
  nav_lt?: Maybe<Scalars['Int']>;
  nav_gte?: Maybe<Scalars['Int']>;
  nav_lte?: Maybe<Scalars['Int']>;
  nav_in?: Maybe<Array<Scalars['Int']>>;
  nav_not_in?: Maybe<Array<Scalars['Int']>>;
  kyaHash?: Maybe<Scalars['Bytes']>;
  kyaHash_not?: Maybe<Scalars['Bytes']>;
  kyaHash_in?: Maybe<Array<Scalars['Bytes']>>;
  kyaHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  kyaHash_contains?: Maybe<Scalars['Bytes']>;
  kyaHash_not_contains?: Maybe<Scalars['Bytes']>;
  kyaUrl?: Maybe<Scalars['String']>;
  kyaUrl_not?: Maybe<Scalars['String']>;
  kyaUrl_gt?: Maybe<Scalars['String']>;
  kyaUrl_lt?: Maybe<Scalars['String']>;
  kyaUrl_gte?: Maybe<Scalars['String']>;
  kyaUrl_lte?: Maybe<Scalars['String']>;
  kyaUrl_in?: Maybe<Array<Scalars['String']>>;
  kyaUrl_not_in?: Maybe<Array<Scalars['String']>>;
  kyaUrl_contains?: Maybe<Scalars['String']>;
  kyaUrl_not_contains?: Maybe<Scalars['String']>;
  kyaUrl_starts_with?: Maybe<Scalars['String']>;
  kyaUrl_not_starts_with?: Maybe<Scalars['String']>;
  kyaUrl_ends_with?: Maybe<Scalars['String']>;
  kyaUrl_not_ends_with?: Maybe<Scalars['String']>;
  isFrozen?: Maybe<Scalars['Boolean']>;
  isFrozen_not?: Maybe<Scalars['Boolean']>;
  isFrozen_in?: Maybe<Array<Scalars['Boolean']>>;
  isFrozen_not_in?: Maybe<Array<Scalars['Boolean']>>;
  isFrozenBy?: Maybe<Scalars['Bytes']>;
  isFrozenBy_not?: Maybe<Scalars['Bytes']>;
  isFrozenBy_in?: Maybe<Array<Scalars['Bytes']>>;
  isFrozenBy_not_in?: Maybe<Array<Scalars['Bytes']>>;
  isFrozenBy_contains?: Maybe<Scalars['Bytes']>;
  isFrozenBy_not_contains?: Maybe<Scalars['Bytes']>;
  currentFundraiser?: Maybe<Scalars['String']>;
  currentFundraiser_not?: Maybe<Scalars['String']>;
  currentFundraiser_gt?: Maybe<Scalars['String']>;
  currentFundraiser_lt?: Maybe<Scalars['String']>;
  currentFundraiser_gte?: Maybe<Scalars['String']>;
  currentFundraiser_lte?: Maybe<Scalars['String']>;
  currentFundraiser_in?: Maybe<Array<Scalars['String']>>;
  currentFundraiser_not_in?: Maybe<Array<Scalars['String']>>;
  currentFundraiser_contains?: Maybe<Scalars['String']>;
  currentFundraiser_not_contains?: Maybe<Scalars['String']>;
  currentFundraiser_starts_with?: Maybe<Scalars['String']>;
  currentFundraiser_not_starts_with?: Maybe<Scalars['String']>;
  currentFundraiser_ends_with?: Maybe<Scalars['String']>;
  currentFundraiser_not_ends_with?: Maybe<Scalars['String']>;
  transferRules?: Maybe<Scalars['String']>;
  transferRules_not?: Maybe<Scalars['String']>;
  transferRules_gt?: Maybe<Scalars['String']>;
  transferRules_lt?: Maybe<Scalars['String']>;
  transferRules_gte?: Maybe<Scalars['String']>;
  transferRules_lte?: Maybe<Scalars['String']>;
  transferRules_in?: Maybe<Array<Scalars['String']>>;
  transferRules_not_in?: Maybe<Array<Scalars['String']>>;
  transferRules_contains?: Maybe<Scalars['String']>;
  transferRules_not_contains?: Maybe<Scalars['String']>;
  transferRules_starts_with?: Maybe<Scalars['String']>;
  transferRules_not_starts_with?: Maybe<Scalars['String']>;
  transferRules_ends_with?: Maybe<Scalars['String']>;
  transferRules_not_ends_with?: Maybe<Scalars['String']>;
  features?: Maybe<Scalars['String']>;
  features_not?: Maybe<Scalars['String']>;
  features_gt?: Maybe<Scalars['String']>;
  features_lt?: Maybe<Scalars['String']>;
  features_gte?: Maybe<Scalars['String']>;
  features_lte?: Maybe<Scalars['String']>;
  features_in?: Maybe<Array<Scalars['String']>>;
  features_not_in?: Maybe<Array<Scalars['String']>>;
  features_contains?: Maybe<Scalars['String']>;
  features_not_contains?: Maybe<Scalars['String']>;
  features_starts_with?: Maybe<Scalars['String']>;
  features_not_starts_with?: Maybe<Scalars['String']>;
  features_ends_with?: Maybe<Scalars['String']>;
  features_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Id = 'id',
  Owner = 'owner',
  Address = 'address',
  Name = 'name',
  Symbol = 'symbol',
  Decimals = 'decimals',
  Supply = 'supply',
  MaxSupply = 'maxSupply',
  AvailableSupply = 'availableSupply',
  Stake = 'stake',
  Nav = 'nav',
  KyaHash = 'kyaHash',
  KyaUrl = 'kyaUrl',
  IsFrozen = 'isFrozen',
  IsFrozenBy = 'isFrozenBy',
  Whitelist = 'whitelist',
  Greylist = 'greylist',
  Holders = 'holders',
  TransferRequests = 'transferRequests',
  Transfers = 'transfers',
  Fundraisers = 'fundraisers',
  CurrentFundraiser = 'currentFundraiser',
  TransferRules = 'transferRules',
  Features = 'features'
}

export type Transfer = {
  __typename?: 'Transfer';
  id: Scalars['ID'];
  createdAt: Scalars['Int'];
  token: Token;
  from: TokenHolder;
  to: TokenHolder;
  value: Scalars['BigInt'];
};

export type TransferRequest = {
  __typename?: 'TransferRequest';
  id: Scalars['ID'];
  token: Token;
  requestId: Scalars['Int'];
  from: TokenHolder;
  to: TokenHolder;
  value: Scalars['BigInt'];
  status: TransferRequestStatus;
  createdAt: Scalars['Int'];
  updatedAt: Scalars['Int'];
};

export enum TransferRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied'
}

export type TransferRequest_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  requestId?: Maybe<Scalars['Int']>;
  requestId_not?: Maybe<Scalars['Int']>;
  requestId_gt?: Maybe<Scalars['Int']>;
  requestId_lt?: Maybe<Scalars['Int']>;
  requestId_gte?: Maybe<Scalars['Int']>;
  requestId_lte?: Maybe<Scalars['Int']>;
  requestId_in?: Maybe<Array<Scalars['Int']>>;
  requestId_not_in?: Maybe<Array<Scalars['Int']>>;
  from?: Maybe<Scalars['String']>;
  from_not?: Maybe<Scalars['String']>;
  from_gt?: Maybe<Scalars['String']>;
  from_lt?: Maybe<Scalars['String']>;
  from_gte?: Maybe<Scalars['String']>;
  from_lte?: Maybe<Scalars['String']>;
  from_in?: Maybe<Array<Scalars['String']>>;
  from_not_in?: Maybe<Array<Scalars['String']>>;
  from_contains?: Maybe<Scalars['String']>;
  from_not_contains?: Maybe<Scalars['String']>;
  from_starts_with?: Maybe<Scalars['String']>;
  from_not_starts_with?: Maybe<Scalars['String']>;
  from_ends_with?: Maybe<Scalars['String']>;
  from_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
  status?: Maybe<TransferRequestStatus>;
  status_not?: Maybe<TransferRequestStatus>;
  createdAt?: Maybe<Scalars['Int']>;
  createdAt_not?: Maybe<Scalars['Int']>;
  createdAt_gt?: Maybe<Scalars['Int']>;
  createdAt_lt?: Maybe<Scalars['Int']>;
  createdAt_gte?: Maybe<Scalars['Int']>;
  createdAt_lte?: Maybe<Scalars['Int']>;
  createdAt_in?: Maybe<Array<Scalars['Int']>>;
  createdAt_not_in?: Maybe<Array<Scalars['Int']>>;
  updatedAt?: Maybe<Scalars['Int']>;
  updatedAt_not?: Maybe<Scalars['Int']>;
  updatedAt_gt?: Maybe<Scalars['Int']>;
  updatedAt_lt?: Maybe<Scalars['Int']>;
  updatedAt_gte?: Maybe<Scalars['Int']>;
  updatedAt_lte?: Maybe<Scalars['Int']>;
  updatedAt_in?: Maybe<Array<Scalars['Int']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['Int']>>;
};

export enum TransferRequest_OrderBy {
  Id = 'id',
  Token = 'token',
  RequestId = 'requestId',
  From = 'from',
  To = 'to',
  Value = 'value',
  Status = 'status',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export type TransferRules = {
  __typename?: 'TransferRules';
  id: Scalars['ID'];
  token: Token;
};

export type TransferRules_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
};

export enum TransferRules_OrderBy {
  Id = 'id',
  Token = 'token'
}

export type Transfer_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  createdAt?: Maybe<Scalars['Int']>;
  createdAt_not?: Maybe<Scalars['Int']>;
  createdAt_gt?: Maybe<Scalars['Int']>;
  createdAt_lt?: Maybe<Scalars['Int']>;
  createdAt_gte?: Maybe<Scalars['Int']>;
  createdAt_lte?: Maybe<Scalars['Int']>;
  createdAt_in?: Maybe<Array<Scalars['Int']>>;
  createdAt_not_in?: Maybe<Array<Scalars['Int']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  from_not?: Maybe<Scalars['String']>;
  from_gt?: Maybe<Scalars['String']>;
  from_lt?: Maybe<Scalars['String']>;
  from_gte?: Maybe<Scalars['String']>;
  from_lte?: Maybe<Scalars['String']>;
  from_in?: Maybe<Array<Scalars['String']>>;
  from_not_in?: Maybe<Array<Scalars['String']>>;
  from_contains?: Maybe<Scalars['String']>;
  from_not_contains?: Maybe<Scalars['String']>;
  from_starts_with?: Maybe<Scalars['String']>;
  from_not_starts_with?: Maybe<Scalars['String']>;
  from_ends_with?: Maybe<Scalars['String']>;
  from_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Transfer_OrderBy {
  Id = 'id',
  CreatedAt = 'createdAt',
  Token = 'token',
  From = 'from',
  To = 'to',
  Value = 'value'
}

export type WhitelistedAccount = {
  __typename?: 'WhitelistedAccount';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  createdAt: Scalars['BigInt'];
  token?: Maybe<Token>;
};

export type WhitelistedAccount_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
};

export enum WhitelistedAccount_OrderBy {
  Id = 'id',
  Address = 'address',
  CreatedAt = 'createdAt',
  Token = 'token'
}

export type ContributorFragment = (
  { __typename?: 'Contributor' }
  & Pick<Contributor, 'address' | 'status' | 'amount'>
  & { contributions?: Maybe<Array<(
    { __typename?: 'Contribution' }
    & Pick<Contribution, 'timestamp' | 'type' | 'amount'>
  )>> }
);

export type FundraiserContributorsFragment = (
  { __typename?: 'Fundraiser' }
  & { contributors?: Maybe<Array<(
    { __typename?: 'Contributor' }
    & ContributorFragment
  )>> }
);

export type FundraiserInfoFragment = (
  { __typename?: 'Fundraiser' }
  & Pick<Fundraiser, 'startDate' | 'endDate' | 'softCap' | 'hardCap' | 'supply' | 'amountQualified' | 'amountPending' | 'amountRefunded' | 'amountWithdrawn' | 'status'>
);

export type FundraiserFragment = (
  { __typename?: 'Fundraiser' }
  & Pick<Fundraiser, 'id' | 'label' | 'baseCurrency' | 'tokenPrice' | 'affiliateManager' | 'contributorRestrictions' | 'minter' | 'contributionsLocked'>
  & { token: (
    { __typename?: 'Token' }
    & Pick<Token, 'id'>
  ) }
  & FundraiserInfoFragment
  & FundraiserContributorsFragment
);

export type FundraisersQueryVariables = Exact<{
  owner: Scalars['Bytes'];
}>;


export type FundraisersQuery = (
  { __typename?: 'Query' }
  & { fundraisers: Array<(
    { __typename?: 'Fundraiser' }
    & FundraiserFragment
  )> }
);

export type FundraiserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FundraiserQuery = (
  { __typename?: 'Query' }
  & { fundraiser?: Maybe<(
    { __typename?: 'Fundraiser' }
    & FundraiserFragment
  )> }
);

export type TokenAssetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TokenAssetQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'kyaHash' | 'kyaUrl'>
  )> }
);

export type TokenHolderFragment = (
  { __typename?: 'TokenHolder' }
  & Pick<TokenHolder, 'address' | 'balance' | 'createdAt' | 'updatedAt' | 'isFrozen'>
);

export type TokenHoldersQueryVariables = Exact<{
  token: Scalars['ID'];
}>;


export type TokenHoldersQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id'>
    & { features?: Maybe<(
      { __typename?: 'Features' }
      & Pick<Features, 'accountBurn' | 'accountFreeze'>
    )>, holders: Array<(
      { __typename?: 'TokenHolder' }
      & TokenHolderFragment
    )> }
  )> }
);

export type TokenStatusQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TokenStatusQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'isFrozen'>
    & { features?: Maybe<(
      { __typename?: 'Features' }
      & Pick<Features, 'tokenFreeze'>
    )> }
  )> }
);

export type TokenSupplyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TokenSupplyQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'address' | 'supply' | 'maxSupply' | 'availableSupply' | 'stake'>
  )> }
);

export type TokensQueryVariables = Exact<{ [key: string]: never; }>;


export type TokensQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'name'>
  )> }
);

export type TransferRequestFragment = (
  { __typename?: 'TransferRequest' }
  & Pick<TransferRequest, 'id' | 'requestId' | 'status' | 'createdAt' | 'updatedAt' | 'value'>
  & { from: (
    { __typename?: 'TokenHolder' }
    & Pick<TokenHolder, 'address'>
  ), to: (
    { __typename?: 'TokenHolder' }
    & Pick<TokenHolder, 'address'>
  ) }
);

export type TransferRequestsQueryVariables = Exact<{
  token: Scalars['ID'];
}>;


export type TransferRequestsQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id'>
    & { transferRequests: Array<(
      { __typename?: 'TransferRequest' }
      & TransferRequestFragment
    )> }
  )> }
);

export type TransferFragment = (
  { __typename?: 'Transfer' }
  & Pick<Transfer, 'id' | 'createdAt' | 'value'>
  & { from: (
    { __typename?: 'TokenHolder' }
    & Pick<TokenHolder, 'address'>
  ), to: (
    { __typename?: 'TokenHolder' }
    & Pick<TokenHolder, 'address'>
  ) }
);

export type TransfersQueryVariables = Exact<{
  token: Scalars['ID'];
}>;


export type TransfersQuery = (
  { __typename?: 'Query' }
  & { token?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'id'>
    & { transfers: Array<(
      { __typename?: 'Transfer' }
      & TransferFragment
    )> }
  )> }
);

export type WhitelistGreylistQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type WhitelistGreylistQuery = (
  { __typename?: 'Query' }
  & { whitelistedAccounts: Array<(
    { __typename?: 'WhitelistedAccount' }
    & Pick<WhitelistedAccount, 'address' | 'createdAt'>
  )>, greylistedAccounts: Array<(
    { __typename?: 'GreylistedAccount' }
    & Pick<GreylistedAccount, 'address' | 'createdAt'>
  )> }
);

export const FundraiserInfoFragmentDoc = gql`
    fragment FundraiserInfo on Fundraiser {
  startDate
  endDate
  softCap
  hardCap
  supply
  amountQualified
  amountPending
  amountRefunded
  amountWithdrawn
  status
}
    `;
export const ContributorFragmentDoc = gql`
    fragment Contributor on Contributor {
  address
  status
  amount
  contributions {
    timestamp
    type
    amount
  }
}
    `;
export const FundraiserContributorsFragmentDoc = gql`
    fragment FundraiserContributors on Fundraiser {
  contributors {
    ...Contributor
  }
}
    ${ContributorFragmentDoc}`;
export const FundraiserFragmentDoc = gql`
    fragment Fundraiser on Fundraiser {
  id
  label
  ...FundraiserInfo
  baseCurrency
  tokenPrice
  affiliateManager
  contributorRestrictions
  minter
  contributionsLocked
  ...FundraiserContributors
  token {
    id
  }
}
    ${FundraiserInfoFragmentDoc}
${FundraiserContributorsFragmentDoc}`;
export const TokenHolderFragmentDoc = gql`
    fragment TokenHolder on TokenHolder {
  address
  balance
  createdAt
  updatedAt
  isFrozen
}
    `;
export const TransferRequestFragmentDoc = gql`
    fragment TransferRequest on TransferRequest {
  id
  requestId
  status
  from {
    address
  }
  to {
    address
  }
  createdAt
  updatedAt
  value
}
    `;
export const TransferFragmentDoc = gql`
    fragment Transfer on Transfer {
  id
  from {
    address
  }
  to {
    address
  }
  createdAt
  value
}
    `;
export const FundraisersDocument = gql`
    query Fundraisers($owner: Bytes!) {
  fundraisers(where: {owner: $owner}) {
    ...Fundraiser
  }
}
    ${FundraiserFragmentDoc}`;

/**
 * __useFundraisersQuery__
 *
 * To run a query within a React component, call `useFundraisersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFundraisersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFundraisersQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useFundraisersQuery(baseOptions?: Apollo.QueryHookOptions<FundraisersQuery, FundraisersQueryVariables>) {
        return Apollo.useQuery<FundraisersQuery, FundraisersQueryVariables>(FundraisersDocument, baseOptions);
      }
export function useFundraisersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FundraisersQuery, FundraisersQueryVariables>) {
          return Apollo.useLazyQuery<FundraisersQuery, FundraisersQueryVariables>(FundraisersDocument, baseOptions);
        }
export type FundraisersQueryHookResult = ReturnType<typeof useFundraisersQuery>;
export type FundraisersLazyQueryHookResult = ReturnType<typeof useFundraisersLazyQuery>;
export type FundraisersQueryResult = Apollo.QueryResult<FundraisersQuery, FundraisersQueryVariables>;
export const FundraiserDocument = gql`
    query Fundraiser($id: ID!) {
  fundraiser(id: $id) {
    ...Fundraiser
  }
}
    ${FundraiserFragmentDoc}`;

/**
 * __useFundraiserQuery__
 *
 * To run a query within a React component, call `useFundraiserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFundraiserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFundraiserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFundraiserQuery(baseOptions?: Apollo.QueryHookOptions<FundraiserQuery, FundraiserQueryVariables>) {
        return Apollo.useQuery<FundraiserQuery, FundraiserQueryVariables>(FundraiserDocument, baseOptions);
      }
export function useFundraiserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FundraiserQuery, FundraiserQueryVariables>) {
          return Apollo.useLazyQuery<FundraiserQuery, FundraiserQueryVariables>(FundraiserDocument, baseOptions);
        }
export type FundraiserQueryHookResult = ReturnType<typeof useFundraiserQuery>;
export type FundraiserLazyQueryHookResult = ReturnType<typeof useFundraiserLazyQuery>;
export type FundraiserQueryResult = Apollo.QueryResult<FundraiserQuery, FundraiserQueryVariables>;
export const TokenAssetDocument = gql`
    query TokenAsset($id: ID!) {
  token(id: $id) {
    id
    kyaHash
    kyaUrl
  }
}
    `;

/**
 * __useTokenAssetQuery__
 *
 * To run a query within a React component, call `useTokenAssetQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenAssetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenAssetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenAssetQuery(baseOptions?: Apollo.QueryHookOptions<TokenAssetQuery, TokenAssetQueryVariables>) {
        return Apollo.useQuery<TokenAssetQuery, TokenAssetQueryVariables>(TokenAssetDocument, baseOptions);
      }
export function useTokenAssetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenAssetQuery, TokenAssetQueryVariables>) {
          return Apollo.useLazyQuery<TokenAssetQuery, TokenAssetQueryVariables>(TokenAssetDocument, baseOptions);
        }
export type TokenAssetQueryHookResult = ReturnType<typeof useTokenAssetQuery>;
export type TokenAssetLazyQueryHookResult = ReturnType<typeof useTokenAssetLazyQuery>;
export type TokenAssetQueryResult = Apollo.QueryResult<TokenAssetQuery, TokenAssetQueryVariables>;
export const TokenHoldersDocument = gql`
    query TokenHolders($token: ID!) {
  token(id: $token) {
    id
    features {
      accountBurn
      accountFreeze
    }
    holders {
      ...TokenHolder
    }
  }
}
    ${TokenHolderFragmentDoc}`;

/**
 * __useTokenHoldersQuery__
 *
 * To run a query within a React component, call `useTokenHoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenHoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenHoldersQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useTokenHoldersQuery(baseOptions?: Apollo.QueryHookOptions<TokenHoldersQuery, TokenHoldersQueryVariables>) {
        return Apollo.useQuery<TokenHoldersQuery, TokenHoldersQueryVariables>(TokenHoldersDocument, baseOptions);
      }
export function useTokenHoldersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenHoldersQuery, TokenHoldersQueryVariables>) {
          return Apollo.useLazyQuery<TokenHoldersQuery, TokenHoldersQueryVariables>(TokenHoldersDocument, baseOptions);
        }
export type TokenHoldersQueryHookResult = ReturnType<typeof useTokenHoldersQuery>;
export type TokenHoldersLazyQueryHookResult = ReturnType<typeof useTokenHoldersLazyQuery>;
export type TokenHoldersQueryResult = Apollo.QueryResult<TokenHoldersQuery, TokenHoldersQueryVariables>;
export const TokenStatusDocument = gql`
    query TokenStatus($id: ID!) {
  token(id: $id) {
    id
    isFrozen
    features {
      tokenFreeze
    }
  }
}
    `;

/**
 * __useTokenStatusQuery__
 *
 * To run a query within a React component, call `useTokenStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenStatusQuery(baseOptions?: Apollo.QueryHookOptions<TokenStatusQuery, TokenStatusQueryVariables>) {
        return Apollo.useQuery<TokenStatusQuery, TokenStatusQueryVariables>(TokenStatusDocument, baseOptions);
      }
export function useTokenStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenStatusQuery, TokenStatusQueryVariables>) {
          return Apollo.useLazyQuery<TokenStatusQuery, TokenStatusQueryVariables>(TokenStatusDocument, baseOptions);
        }
export type TokenStatusQueryHookResult = ReturnType<typeof useTokenStatusQuery>;
export type TokenStatusLazyQueryHookResult = ReturnType<typeof useTokenStatusLazyQuery>;
export type TokenStatusQueryResult = Apollo.QueryResult<TokenStatusQuery, TokenStatusQueryVariables>;
export const TokenSupplyDocument = gql`
    query TokenSupply($id: ID!) {
  token(id: $id) {
    id
    address
    supply
    maxSupply
    availableSupply
    stake
  }
}
    `;

/**
 * __useTokenSupplyQuery__
 *
 * To run a query within a React component, call `useTokenSupplyQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenSupplyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenSupplyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenSupplyQuery(baseOptions?: Apollo.QueryHookOptions<TokenSupplyQuery, TokenSupplyQueryVariables>) {
        return Apollo.useQuery<TokenSupplyQuery, TokenSupplyQueryVariables>(TokenSupplyDocument, baseOptions);
      }
export function useTokenSupplyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenSupplyQuery, TokenSupplyQueryVariables>) {
          return Apollo.useLazyQuery<TokenSupplyQuery, TokenSupplyQueryVariables>(TokenSupplyDocument, baseOptions);
        }
export type TokenSupplyQueryHookResult = ReturnType<typeof useTokenSupplyQuery>;
export type TokenSupplyLazyQueryHookResult = ReturnType<typeof useTokenSupplyLazyQuery>;
export type TokenSupplyQueryResult = Apollo.QueryResult<TokenSupplyQuery, TokenSupplyQueryVariables>;
export const TokensDocument = gql`
    query Tokens {
  tokens {
    id
    name
  }
}
    `;

/**
 * __useTokensQuery__
 *
 * To run a query within a React component, call `useTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useTokensQuery(baseOptions?: Apollo.QueryHookOptions<TokensQuery, TokensQueryVariables>) {
        return Apollo.useQuery<TokensQuery, TokensQueryVariables>(TokensDocument, baseOptions);
      }
export function useTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensQuery, TokensQueryVariables>) {
          return Apollo.useLazyQuery<TokensQuery, TokensQueryVariables>(TokensDocument, baseOptions);
        }
export type TokensQueryHookResult = ReturnType<typeof useTokensQuery>;
export type TokensLazyQueryHookResult = ReturnType<typeof useTokensLazyQuery>;
export type TokensQueryResult = Apollo.QueryResult<TokensQuery, TokensQueryVariables>;
export const TransferRequestsDocument = gql`
    query TransferRequests($token: ID!) {
  token(id: $token) {
    id
    transferRequests {
      ...TransferRequest
    }
  }
}
    ${TransferRequestFragmentDoc}`;

/**
 * __useTransferRequestsQuery__
 *
 * To run a query within a React component, call `useTransferRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransferRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransferRequestsQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useTransferRequestsQuery(baseOptions?: Apollo.QueryHookOptions<TransferRequestsQuery, TransferRequestsQueryVariables>) {
        return Apollo.useQuery<TransferRequestsQuery, TransferRequestsQueryVariables>(TransferRequestsDocument, baseOptions);
      }
export function useTransferRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransferRequestsQuery, TransferRequestsQueryVariables>) {
          return Apollo.useLazyQuery<TransferRequestsQuery, TransferRequestsQueryVariables>(TransferRequestsDocument, baseOptions);
        }
export type TransferRequestsQueryHookResult = ReturnType<typeof useTransferRequestsQuery>;
export type TransferRequestsLazyQueryHookResult = ReturnType<typeof useTransferRequestsLazyQuery>;
export type TransferRequestsQueryResult = Apollo.QueryResult<TransferRequestsQuery, TransferRequestsQueryVariables>;
export const TransfersDocument = gql`
    query Transfers($token: ID!) {
  token(id: $token) {
    id
    transfers {
      ...Transfer
    }
  }
}
    ${TransferFragmentDoc}`;

/**
 * __useTransfersQuery__
 *
 * To run a query within a React component, call `useTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransfersQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useTransfersQuery(baseOptions?: Apollo.QueryHookOptions<TransfersQuery, TransfersQueryVariables>) {
        return Apollo.useQuery<TransfersQuery, TransfersQueryVariables>(TransfersDocument, baseOptions);
      }
export function useTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransfersQuery, TransfersQueryVariables>) {
          return Apollo.useLazyQuery<TransfersQuery, TransfersQueryVariables>(TransfersDocument, baseOptions);
        }
export type TransfersQueryHookResult = ReturnType<typeof useTransfersQuery>;
export type TransfersLazyQueryHookResult = ReturnType<typeof useTransfersLazyQuery>;
export type TransfersQueryResult = Apollo.QueryResult<TransfersQuery, TransfersQueryVariables>;
export const WhitelistGreylistDocument = gql`
    query WhitelistGreylist($token: String!) {
  whitelistedAccounts(where: {token: $token}) {
    address
    createdAt
  }
  greylistedAccounts(where: {token: $token}) {
    address
    createdAt
  }
}
    `;

/**
 * __useWhitelistGreylistQuery__
 *
 * To run a query within a React component, call `useWhitelistGreylistQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhitelistGreylistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhitelistGreylistQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useWhitelistGreylistQuery(baseOptions?: Apollo.QueryHookOptions<WhitelistGreylistQuery, WhitelistGreylistQueryVariables>) {
        return Apollo.useQuery<WhitelistGreylistQuery, WhitelistGreylistQueryVariables>(WhitelistGreylistDocument, baseOptions);
      }
export function useWhitelistGreylistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhitelistGreylistQuery, WhitelistGreylistQueryVariables>) {
          return Apollo.useLazyQuery<WhitelistGreylistQuery, WhitelistGreylistQueryVariables>(WhitelistGreylistDocument, baseOptions);
        }
export type WhitelistGreylistQueryHookResult = ReturnType<typeof useWhitelistGreylistQuery>;
export type WhitelistGreylistLazyQueryHookResult = ReturnType<typeof useWhitelistGreylistLazyQuery>;
export type WhitelistGreylistQueryResult = Apollo.QueryResult<WhitelistGreylistQuery, WhitelistGreylistQueryVariables>;