// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace Overlayv2Types {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type Account = {
  id: Scalars['ID'];
  positions: Array<Position>;
  builds: Array<Build>;
  unwinds: Array<Unwind>;
  liquidates: Array<Liquidate>;
};


export type AccountpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
};


export type AccountbuildsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Build_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Build_filter>;
};


export type AccountunwindsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unwind_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Unwind_filter>;
};


export type AccountliquidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Liquidate_filter>;
};

export type Account_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  positions_?: InputMaybe<Position_filter>;
  builds_?: InputMaybe<Build_filter>;
  unwinds_?: InputMaybe<Unwind_filter>;
  liquidates_?: InputMaybe<Liquidate_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Account_filter>>>;
};

export type Account_orderBy =
  | 'id'
  | 'positions'
  | 'builds'
  | 'unwinds'
  | 'liquidates';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Build = {
  id: Scalars['ID'];
  owner: Account;
  position: Position;
  currentOi: Scalars['BigInt'];
  currentDebt: Scalars['BigInt'];
  isLong: Scalars['Boolean'];
  price: Scalars['BigInt'];
  collateral: Scalars['BigInt'];
  value: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Build_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<Account_filter>;
  position?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_filter>;
  currentOi?: InputMaybe<Scalars['BigInt']>;
  currentOi_not?: InputMaybe<Scalars['BigInt']>;
  currentOi_gt?: InputMaybe<Scalars['BigInt']>;
  currentOi_lt?: InputMaybe<Scalars['BigInt']>;
  currentOi_gte?: InputMaybe<Scalars['BigInt']>;
  currentOi_lte?: InputMaybe<Scalars['BigInt']>;
  currentOi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentOi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_not?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isLong?: InputMaybe<Scalars['Boolean']>;
  isLong_not?: InputMaybe<Scalars['Boolean']>;
  isLong_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLong_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral?: InputMaybe<Scalars['BigInt']>;
  collateral_not?: InputMaybe<Scalars['BigInt']>;
  collateral_gt?: InputMaybe<Scalars['BigInt']>;
  collateral_lt?: InputMaybe<Scalars['BigInt']>;
  collateral_gte?: InputMaybe<Scalars['BigInt']>;
  collateral_lte?: InputMaybe<Scalars['BigInt']>;
  collateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Build_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Build_filter>>>;
};

export type Build_orderBy =
  | 'id'
  | 'owner'
  | 'owner__id'
  | 'position'
  | 'position__id'
  | 'position__positionId'
  | 'position__initialOi'
  | 'position__initialDebt'
  | 'position__initialCollateral'
  | 'position__initialNotional'
  | 'position__leverage'
  | 'position__fractionUnwound'
  | 'position__isLong'
  | 'position__entryPrice'
  | 'position__isLiquidated'
  | 'position__currentOi'
  | 'position__currentDebt'
  | 'position__mint'
  | 'position__createdAtTimestamp'
  | 'position__createdAtBlockNumber'
  | 'position__numberOfUniwnds'
  | 'currentOi'
  | 'currentDebt'
  | 'isLong'
  | 'price'
  | 'collateral'
  | 'value'
  | 'timestamp'
  | 'transaction'
  | 'transaction__id'
  | 'transaction__blockNumber'
  | 'transaction__timestamp'
  | 'transaction__gasLimit'
  | 'transaction__gasPrice';

export type Factory = {
  id: Scalars['ID'];
  marketCount: Scalars['BigInt'];
  txCount: Scalars['BigInt'];
  totalVolumeOVL: Scalars['BigDecimal'];
  totalFeesOVL: Scalars['BigDecimal'];
  totalValueLockedOVL: Scalars['BigDecimal'];
  feeRecipient: Scalars['ID'];
  owner: Scalars['ID'];
  markets: Array<Market>;
};


export type FactorymarketsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Market_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Market_filter>;
};

export type Factory_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  marketCount?: InputMaybe<Scalars['BigInt']>;
  marketCount_not?: InputMaybe<Scalars['BigInt']>;
  marketCount_gt?: InputMaybe<Scalars['BigInt']>;
  marketCount_lt?: InputMaybe<Scalars['BigInt']>;
  marketCount_gte?: InputMaybe<Scalars['BigInt']>;
  marketCount_lte?: InputMaybe<Scalars['BigInt']>;
  marketCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marketCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount?: InputMaybe<Scalars['BigInt']>;
  txCount_not?: InputMaybe<Scalars['BigInt']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']>;
  txCount_lt?: InputMaybe<Scalars['BigInt']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVolumeOVL?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolumeOVL_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolumeOVL_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesOVL?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_not?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesOVL_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesOVL_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedOVL?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_not?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalValueLockedOVL_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedOVL_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeRecipient?: InputMaybe<Scalars['ID']>;
  feeRecipient_not?: InputMaybe<Scalars['ID']>;
  feeRecipient_gt?: InputMaybe<Scalars['ID']>;
  feeRecipient_lt?: InputMaybe<Scalars['ID']>;
  feeRecipient_gte?: InputMaybe<Scalars['ID']>;
  feeRecipient_lte?: InputMaybe<Scalars['ID']>;
  feeRecipient_in?: InputMaybe<Array<Scalars['ID']>>;
  feeRecipient_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['ID']>;
  owner_not?: InputMaybe<Scalars['ID']>;
  owner_gt?: InputMaybe<Scalars['ID']>;
  owner_lt?: InputMaybe<Scalars['ID']>;
  owner_gte?: InputMaybe<Scalars['ID']>;
  owner_lte?: InputMaybe<Scalars['ID']>;
  owner_in?: InputMaybe<Array<Scalars['ID']>>;
  owner_not_in?: InputMaybe<Array<Scalars['ID']>>;
  markets_?: InputMaybe<Market_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Factory_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Factory_filter>>>;
};

export type Factory_orderBy =
  | 'id'
  | 'marketCount'
  | 'txCount'
  | 'totalVolumeOVL'
  | 'totalFeesOVL'
  | 'totalValueLockedOVL'
  | 'feeRecipient'
  | 'owner'
  | 'markets';

export type Liquidate = {
  id: Scalars['ID'];
  owner: Account;
  sender: Account;
  position: Position;
  currentOi: Scalars['BigInt'];
  currentDebt: Scalars['BigInt'];
  isLong: Scalars['Boolean'];
  price: Scalars['BigInt'];
  mint: Scalars['BigInt'];
  collateral: Scalars['BigInt'];
  value: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Liquidate_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<Account_filter>;
  sender?: InputMaybe<Scalars['String']>;
  sender_not?: InputMaybe<Scalars['String']>;
  sender_gt?: InputMaybe<Scalars['String']>;
  sender_lt?: InputMaybe<Scalars['String']>;
  sender_gte?: InputMaybe<Scalars['String']>;
  sender_lte?: InputMaybe<Scalars['String']>;
  sender_in?: InputMaybe<Array<Scalars['String']>>;
  sender_not_in?: InputMaybe<Array<Scalars['String']>>;
  sender_contains?: InputMaybe<Scalars['String']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']>;
  sender_not_contains?: InputMaybe<Scalars['String']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']>;
  sender_starts_with?: InputMaybe<Scalars['String']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender_not_starts_with?: InputMaybe<Scalars['String']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender_ends_with?: InputMaybe<Scalars['String']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sender_?: InputMaybe<Account_filter>;
  position?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_filter>;
  currentOi?: InputMaybe<Scalars['BigInt']>;
  currentOi_not?: InputMaybe<Scalars['BigInt']>;
  currentOi_gt?: InputMaybe<Scalars['BigInt']>;
  currentOi_lt?: InputMaybe<Scalars['BigInt']>;
  currentOi_gte?: InputMaybe<Scalars['BigInt']>;
  currentOi_lte?: InputMaybe<Scalars['BigInt']>;
  currentOi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentOi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_not?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isLong?: InputMaybe<Scalars['Boolean']>;
  isLong_not?: InputMaybe<Scalars['Boolean']>;
  isLong_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLong_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint?: InputMaybe<Scalars['BigInt']>;
  mint_not?: InputMaybe<Scalars['BigInt']>;
  mint_gt?: InputMaybe<Scalars['BigInt']>;
  mint_lt?: InputMaybe<Scalars['BigInt']>;
  mint_gte?: InputMaybe<Scalars['BigInt']>;
  mint_lte?: InputMaybe<Scalars['BigInt']>;
  mint_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral?: InputMaybe<Scalars['BigInt']>;
  collateral_not?: InputMaybe<Scalars['BigInt']>;
  collateral_gt?: InputMaybe<Scalars['BigInt']>;
  collateral_lt?: InputMaybe<Scalars['BigInt']>;
  collateral_gte?: InputMaybe<Scalars['BigInt']>;
  collateral_lte?: InputMaybe<Scalars['BigInt']>;
  collateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Liquidate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Liquidate_filter>>>;
};

export type Liquidate_orderBy =
  | 'id'
  | 'owner'
  | 'owner__id'
  | 'sender'
  | 'sender__id'
  | 'position'
  | 'position__id'
  | 'position__positionId'
  | 'position__initialOi'
  | 'position__initialDebt'
  | 'position__initialCollateral'
  | 'position__initialNotional'
  | 'position__leverage'
  | 'position__fractionUnwound'
  | 'position__isLong'
  | 'position__entryPrice'
  | 'position__isLiquidated'
  | 'position__currentOi'
  | 'position__currentDebt'
  | 'position__mint'
  | 'position__createdAtTimestamp'
  | 'position__createdAtBlockNumber'
  | 'position__numberOfUniwnds'
  | 'currentOi'
  | 'currentDebt'
  | 'isLong'
  | 'price'
  | 'mint'
  | 'collateral'
  | 'value'
  | 'timestamp'
  | 'transaction'
  | 'transaction__id'
  | 'transaction__blockNumber'
  | 'transaction__timestamp'
  | 'transaction__gasLimit'
  | 'transaction__gasPrice';

export type Market = {
  id: Scalars['ID'];
  feedAddress: Scalars['String'];
  factory: Factory;
  createdAtTimestamp: Scalars['BigInt'];
  createdAtBlockNumber: Scalars['BigInt'];
  k: Scalars['BigInt'];
  lmbda: Scalars['BigInt'];
  delta: Scalars['BigInt'];
  capPayoff: Scalars['BigInt'];
  capNotional: Scalars['BigInt'];
  capLeverage: Scalars['BigInt'];
  circuitBreakerWindow: Scalars['BigInt'];
  circuitBreakerMintTarget: Scalars['BigInt'];
  maintenanceMarginFraction: Scalars['BigInt'];
  maintenanceMarginBurnRate: Scalars['BigInt'];
  liquidationFeeRate: Scalars['BigInt'];
  tradingFeeRate: Scalars['BigInt'];
  minCollateral: Scalars['BigInt'];
  priceDriftUpperLimit: Scalars['BigInt'];
  averageBlockTime: Scalars['BigInt'];
  oiLong: Scalars['BigInt'];
  oiShort: Scalars['BigInt'];
  positions: Array<Position>;
  isShutdown: Scalars['Boolean'];
};


export type MarketpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
};

export type Market_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  feedAddress?: InputMaybe<Scalars['String']>;
  feedAddress_not?: InputMaybe<Scalars['String']>;
  feedAddress_gt?: InputMaybe<Scalars['String']>;
  feedAddress_lt?: InputMaybe<Scalars['String']>;
  feedAddress_gte?: InputMaybe<Scalars['String']>;
  feedAddress_lte?: InputMaybe<Scalars['String']>;
  feedAddress_in?: InputMaybe<Array<Scalars['String']>>;
  feedAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedAddress_contains?: InputMaybe<Scalars['String']>;
  feedAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  feedAddress_not_contains?: InputMaybe<Scalars['String']>;
  feedAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedAddress_starts_with?: InputMaybe<Scalars['String']>;
  feedAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  feedAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedAddress_ends_with?: InputMaybe<Scalars['String']>;
  feedAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  feedAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory?: InputMaybe<Scalars['String']>;
  factory_not?: InputMaybe<Scalars['String']>;
  factory_gt?: InputMaybe<Scalars['String']>;
  factory_lt?: InputMaybe<Scalars['String']>;
  factory_gte?: InputMaybe<Scalars['String']>;
  factory_lte?: InputMaybe<Scalars['String']>;
  factory_in?: InputMaybe<Array<Scalars['String']>>;
  factory_not_in?: InputMaybe<Array<Scalars['String']>>;
  factory_contains?: InputMaybe<Scalars['String']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_not_contains?: InputMaybe<Scalars['String']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  factory_starts_with?: InputMaybe<Scalars['String']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_starts_with?: InputMaybe<Scalars['String']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  factory_ends_with?: InputMaybe<Scalars['String']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  factory_?: InputMaybe<Factory_filter>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  k?: InputMaybe<Scalars['BigInt']>;
  k_not?: InputMaybe<Scalars['BigInt']>;
  k_gt?: InputMaybe<Scalars['BigInt']>;
  k_lt?: InputMaybe<Scalars['BigInt']>;
  k_gte?: InputMaybe<Scalars['BigInt']>;
  k_lte?: InputMaybe<Scalars['BigInt']>;
  k_in?: InputMaybe<Array<Scalars['BigInt']>>;
  k_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lmbda?: InputMaybe<Scalars['BigInt']>;
  lmbda_not?: InputMaybe<Scalars['BigInt']>;
  lmbda_gt?: InputMaybe<Scalars['BigInt']>;
  lmbda_lt?: InputMaybe<Scalars['BigInt']>;
  lmbda_gte?: InputMaybe<Scalars['BigInt']>;
  lmbda_lte?: InputMaybe<Scalars['BigInt']>;
  lmbda_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lmbda_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  delta?: InputMaybe<Scalars['BigInt']>;
  delta_not?: InputMaybe<Scalars['BigInt']>;
  delta_gt?: InputMaybe<Scalars['BigInt']>;
  delta_lt?: InputMaybe<Scalars['BigInt']>;
  delta_gte?: InputMaybe<Scalars['BigInt']>;
  delta_lte?: InputMaybe<Scalars['BigInt']>;
  delta_in?: InputMaybe<Array<Scalars['BigInt']>>;
  delta_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capPayoff?: InputMaybe<Scalars['BigInt']>;
  capPayoff_not?: InputMaybe<Scalars['BigInt']>;
  capPayoff_gt?: InputMaybe<Scalars['BigInt']>;
  capPayoff_lt?: InputMaybe<Scalars['BigInt']>;
  capPayoff_gte?: InputMaybe<Scalars['BigInt']>;
  capPayoff_lte?: InputMaybe<Scalars['BigInt']>;
  capPayoff_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capPayoff_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capNotional?: InputMaybe<Scalars['BigInt']>;
  capNotional_not?: InputMaybe<Scalars['BigInt']>;
  capNotional_gt?: InputMaybe<Scalars['BigInt']>;
  capNotional_lt?: InputMaybe<Scalars['BigInt']>;
  capNotional_gte?: InputMaybe<Scalars['BigInt']>;
  capNotional_lte?: InputMaybe<Scalars['BigInt']>;
  capNotional_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capNotional_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capLeverage?: InputMaybe<Scalars['BigInt']>;
  capLeverage_not?: InputMaybe<Scalars['BigInt']>;
  capLeverage_gt?: InputMaybe<Scalars['BigInt']>;
  capLeverage_lt?: InputMaybe<Scalars['BigInt']>;
  capLeverage_gte?: InputMaybe<Scalars['BigInt']>;
  capLeverage_lte?: InputMaybe<Scalars['BigInt']>;
  capLeverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capLeverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  circuitBreakerWindow?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_not?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_gt?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_lt?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_gte?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_lte?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerWindow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  circuitBreakerWindow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  circuitBreakerMintTarget?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_not?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_gt?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_lt?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_gte?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_lte?: InputMaybe<Scalars['BigInt']>;
  circuitBreakerMintTarget_in?: InputMaybe<Array<Scalars['BigInt']>>;
  circuitBreakerMintTarget_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maintenanceMarginFraction?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_not?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_gt?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_lt?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_gte?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_lte?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginFraction_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maintenanceMarginFraction_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maintenanceMarginBurnRate?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_not?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_gt?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_lt?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_gte?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_lte?: InputMaybe<Scalars['BigInt']>;
  maintenanceMarginBurnRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maintenanceMarginBurnRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidationFeeRate?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_not?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_gt?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_lt?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_gte?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_lte?: InputMaybe<Scalars['BigInt']>;
  liquidationFeeRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidationFeeRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradingFeeRate?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_not?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_gt?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_lt?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_gte?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_lte?: InputMaybe<Scalars['BigInt']>;
  tradingFeeRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradingFeeRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minCollateral?: InputMaybe<Scalars['BigInt']>;
  minCollateral_not?: InputMaybe<Scalars['BigInt']>;
  minCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  minCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  minCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  minCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  minCollateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  priceDriftUpperLimit?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_not?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_gt?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_lt?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_gte?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_lte?: InputMaybe<Scalars['BigInt']>;
  priceDriftUpperLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  priceDriftUpperLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  averageBlockTime?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_not?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_gt?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_lt?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_gte?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_lte?: InputMaybe<Scalars['BigInt']>;
  averageBlockTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  averageBlockTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oiLong?: InputMaybe<Scalars['BigInt']>;
  oiLong_not?: InputMaybe<Scalars['BigInt']>;
  oiLong_gt?: InputMaybe<Scalars['BigInt']>;
  oiLong_lt?: InputMaybe<Scalars['BigInt']>;
  oiLong_gte?: InputMaybe<Scalars['BigInt']>;
  oiLong_lte?: InputMaybe<Scalars['BigInt']>;
  oiLong_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oiLong_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oiShort?: InputMaybe<Scalars['BigInt']>;
  oiShort_not?: InputMaybe<Scalars['BigInt']>;
  oiShort_gt?: InputMaybe<Scalars['BigInt']>;
  oiShort_lt?: InputMaybe<Scalars['BigInt']>;
  oiShort_gte?: InputMaybe<Scalars['BigInt']>;
  oiShort_lte?: InputMaybe<Scalars['BigInt']>;
  oiShort_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oiShort_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  positions_?: InputMaybe<Position_filter>;
  isShutdown?: InputMaybe<Scalars['Boolean']>;
  isShutdown_not?: InputMaybe<Scalars['Boolean']>;
  isShutdown_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isShutdown_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Market_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Market_filter>>>;
};

export type Market_orderBy =
  | 'id'
  | 'feedAddress'
  | 'factory'
  | 'factory__id'
  | 'factory__marketCount'
  | 'factory__txCount'
  | 'factory__totalVolumeOVL'
  | 'factory__totalFeesOVL'
  | 'factory__totalValueLockedOVL'
  | 'factory__feeRecipient'
  | 'factory__owner'
  | 'createdAtTimestamp'
  | 'createdAtBlockNumber'
  | 'k'
  | 'lmbda'
  | 'delta'
  | 'capPayoff'
  | 'capNotional'
  | 'capLeverage'
  | 'circuitBreakerWindow'
  | 'circuitBreakerMintTarget'
  | 'maintenanceMarginFraction'
  | 'maintenanceMarginBurnRate'
  | 'liquidationFeeRate'
  | 'tradingFeeRate'
  | 'minCollateral'
  | 'priceDriftUpperLimit'
  | 'averageBlockTime'
  | 'oiLong'
  | 'oiShort'
  | 'positions'
  | 'isShutdown';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Position = {
  id: Scalars['ID'];
  positionId: Scalars['String'];
  owner: Account;
  market: Market;
  initialOi: Scalars['BigInt'];
  initialDebt: Scalars['BigInt'];
  initialCollateral: Scalars['BigInt'];
  initialNotional: Scalars['BigInt'];
  leverage: Scalars['BigDecimal'];
  fractionUnwound: Scalars['BigInt'];
  isLong: Scalars['Boolean'];
  entryPrice: Scalars['BigInt'];
  isLiquidated: Scalars['Boolean'];
  currentOi: Scalars['BigInt'];
  currentDebt: Scalars['BigInt'];
  mint: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  createdAtBlockNumber: Scalars['BigInt'];
  numberOfUniwnds: Scalars['BigInt'];
  builds: Array<Build>;
  liquidates: Array<Liquidate>;
  unwinds: Array<Unwind>;
};


export type PositionbuildsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Build_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Build_filter>;
};


export type PositionliquidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Liquidate_filter>;
};


export type PositionunwindsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unwind_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Unwind_filter>;
};

export type Position_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  positionId?: InputMaybe<Scalars['String']>;
  positionId_not?: InputMaybe<Scalars['String']>;
  positionId_gt?: InputMaybe<Scalars['String']>;
  positionId_lt?: InputMaybe<Scalars['String']>;
  positionId_gte?: InputMaybe<Scalars['String']>;
  positionId_lte?: InputMaybe<Scalars['String']>;
  positionId_in?: InputMaybe<Array<Scalars['String']>>;
  positionId_not_in?: InputMaybe<Array<Scalars['String']>>;
  positionId_contains?: InputMaybe<Scalars['String']>;
  positionId_contains_nocase?: InputMaybe<Scalars['String']>;
  positionId_not_contains?: InputMaybe<Scalars['String']>;
  positionId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  positionId_starts_with?: InputMaybe<Scalars['String']>;
  positionId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  positionId_not_starts_with?: InputMaybe<Scalars['String']>;
  positionId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  positionId_ends_with?: InputMaybe<Scalars['String']>;
  positionId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  positionId_not_ends_with?: InputMaybe<Scalars['String']>;
  positionId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<Account_filter>;
  market?: InputMaybe<Scalars['String']>;
  market_not?: InputMaybe<Scalars['String']>;
  market_gt?: InputMaybe<Scalars['String']>;
  market_lt?: InputMaybe<Scalars['String']>;
  market_gte?: InputMaybe<Scalars['String']>;
  market_lte?: InputMaybe<Scalars['String']>;
  market_in?: InputMaybe<Array<Scalars['String']>>;
  market_not_in?: InputMaybe<Array<Scalars['String']>>;
  market_contains?: InputMaybe<Scalars['String']>;
  market_contains_nocase?: InputMaybe<Scalars['String']>;
  market_not_contains?: InputMaybe<Scalars['String']>;
  market_not_contains_nocase?: InputMaybe<Scalars['String']>;
  market_starts_with?: InputMaybe<Scalars['String']>;
  market_starts_with_nocase?: InputMaybe<Scalars['String']>;
  market_not_starts_with?: InputMaybe<Scalars['String']>;
  market_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  market_ends_with?: InputMaybe<Scalars['String']>;
  market_ends_with_nocase?: InputMaybe<Scalars['String']>;
  market_not_ends_with?: InputMaybe<Scalars['String']>;
  market_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  market_?: InputMaybe<Market_filter>;
  initialOi?: InputMaybe<Scalars['BigInt']>;
  initialOi_not?: InputMaybe<Scalars['BigInt']>;
  initialOi_gt?: InputMaybe<Scalars['BigInt']>;
  initialOi_lt?: InputMaybe<Scalars['BigInt']>;
  initialOi_gte?: InputMaybe<Scalars['BigInt']>;
  initialOi_lte?: InputMaybe<Scalars['BigInt']>;
  initialOi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialOi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialDebt?: InputMaybe<Scalars['BigInt']>;
  initialDebt_not?: InputMaybe<Scalars['BigInt']>;
  initialDebt_gt?: InputMaybe<Scalars['BigInt']>;
  initialDebt_lt?: InputMaybe<Scalars['BigInt']>;
  initialDebt_gte?: InputMaybe<Scalars['BigInt']>;
  initialDebt_lte?: InputMaybe<Scalars['BigInt']>;
  initialDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialCollateral?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_not?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  initialCollateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialNotional?: InputMaybe<Scalars['BigInt']>;
  initialNotional_not?: InputMaybe<Scalars['BigInt']>;
  initialNotional_gt?: InputMaybe<Scalars['BigInt']>;
  initialNotional_lt?: InputMaybe<Scalars['BigInt']>;
  initialNotional_gte?: InputMaybe<Scalars['BigInt']>;
  initialNotional_lte?: InputMaybe<Scalars['BigInt']>;
  initialNotional_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialNotional_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  leverage?: InputMaybe<Scalars['BigDecimal']>;
  leverage_not?: InputMaybe<Scalars['BigDecimal']>;
  leverage_gt?: InputMaybe<Scalars['BigDecimal']>;
  leverage_lt?: InputMaybe<Scalars['BigDecimal']>;
  leverage_gte?: InputMaybe<Scalars['BigDecimal']>;
  leverage_lte?: InputMaybe<Scalars['BigDecimal']>;
  leverage_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  leverage_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fractionUnwound?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_not?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_gt?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_lt?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_gte?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_lte?: InputMaybe<Scalars['BigInt']>;
  fractionUnwound_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fractionUnwound_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isLong?: InputMaybe<Scalars['Boolean']>;
  isLong_not?: InputMaybe<Scalars['Boolean']>;
  isLong_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLong_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  entryPrice?: InputMaybe<Scalars['BigInt']>;
  entryPrice_not?: InputMaybe<Scalars['BigInt']>;
  entryPrice_gt?: InputMaybe<Scalars['BigInt']>;
  entryPrice_lt?: InputMaybe<Scalars['BigInt']>;
  entryPrice_gte?: InputMaybe<Scalars['BigInt']>;
  entryPrice_lte?: InputMaybe<Scalars['BigInt']>;
  entryPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  entryPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isLiquidated?: InputMaybe<Scalars['Boolean']>;
  isLiquidated_not?: InputMaybe<Scalars['Boolean']>;
  isLiquidated_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLiquidated_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  currentOi?: InputMaybe<Scalars['BigInt']>;
  currentOi_not?: InputMaybe<Scalars['BigInt']>;
  currentOi_gt?: InputMaybe<Scalars['BigInt']>;
  currentOi_lt?: InputMaybe<Scalars['BigInt']>;
  currentOi_gte?: InputMaybe<Scalars['BigInt']>;
  currentOi_lte?: InputMaybe<Scalars['BigInt']>;
  currentOi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentOi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_not?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint?: InputMaybe<Scalars['BigInt']>;
  mint_not?: InputMaybe<Scalars['BigInt']>;
  mint_gt?: InputMaybe<Scalars['BigInt']>;
  mint_lt?: InputMaybe<Scalars['BigInt']>;
  mint_gte?: InputMaybe<Scalars['BigInt']>;
  mint_lte?: InputMaybe<Scalars['BigInt']>;
  mint_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  numberOfUniwnds?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_not?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_gt?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_lt?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_gte?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_lte?: InputMaybe<Scalars['BigInt']>;
  numberOfUniwnds_in?: InputMaybe<Array<Scalars['BigInt']>>;
  numberOfUniwnds_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  builds_?: InputMaybe<Build_filter>;
  liquidates_?: InputMaybe<Liquidate_filter>;
  unwinds_?: InputMaybe<Unwind_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Position_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Position_filter>>>;
};

export type Position_orderBy =
  | 'id'
  | 'positionId'
  | 'owner'
  | 'owner__id'
  | 'market'
  | 'market__id'
  | 'market__feedAddress'
  | 'market__createdAtTimestamp'
  | 'market__createdAtBlockNumber'
  | 'market__k'
  | 'market__lmbda'
  | 'market__delta'
  | 'market__capPayoff'
  | 'market__capNotional'
  | 'market__capLeverage'
  | 'market__circuitBreakerWindow'
  | 'market__circuitBreakerMintTarget'
  | 'market__maintenanceMarginFraction'
  | 'market__maintenanceMarginBurnRate'
  | 'market__liquidationFeeRate'
  | 'market__tradingFeeRate'
  | 'market__minCollateral'
  | 'market__priceDriftUpperLimit'
  | 'market__averageBlockTime'
  | 'market__oiLong'
  | 'market__oiShort'
  | 'market__isShutdown'
  | 'initialOi'
  | 'initialDebt'
  | 'initialCollateral'
  | 'initialNotional'
  | 'leverage'
  | 'fractionUnwound'
  | 'isLong'
  | 'entryPrice'
  | 'isLiquidated'
  | 'currentOi'
  | 'currentDebt'
  | 'mint'
  | 'createdAtTimestamp'
  | 'createdAtBlockNumber'
  | 'numberOfUniwnds'
  | 'builds'
  | 'liquidates'
  | 'unwinds';

export type Query = {
  factory?: Maybe<Factory>;
  factories: Array<Factory>;
  market?: Maybe<Market>;
  markets: Array<Market>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  build?: Maybe<Build>;
  builds: Array<Build>;
  unwind?: Maybe<Unwind>;
  unwinds: Array<Unwind>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryfactoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfactoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Factory_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Factory_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymarketArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymarketsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Market_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Market_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybuildArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybuildsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Build_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Build_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryunwindArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryunwindsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unwind_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Unwind_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryliquidateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryliquidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Liquidate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  factory?: Maybe<Factory>;
  factories: Array<Factory>;
  market?: Maybe<Market>;
  markets: Array<Market>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  build?: Maybe<Build>;
  builds: Array<Build>;
  unwind?: Maybe<Unwind>;
  unwinds: Array<Unwind>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionfactoryArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfactoriesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Factory_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Factory_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmarketArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmarketsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Market_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Market_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpositionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Position_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransactionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transaction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbuildArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbuildsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Build_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Build_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionunwindArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionunwindsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unwind_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Unwind_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionliquidateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionliquidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Liquidate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Transaction = {
  id: Scalars['ID'];
  blockNumber: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  builds: Array<Build>;
  unwinds: Array<Unwind>;
  liquidates: Array<Liquidate>;
};


export type TransactionbuildsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Build_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Build_filter>;
};


export type TransactionunwindsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unwind_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Unwind_filter>;
};


export type TransactionliquidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Liquidate_filter>;
};

export type Transaction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  builds_?: InputMaybe<Build_filter>;
  unwinds_?: InputMaybe<Unwind_filter>;
  liquidates_?: InputMaybe<Liquidate_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transaction_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Transaction_filter>>>;
};

export type Transaction_orderBy =
  | 'id'
  | 'blockNumber'
  | 'timestamp'
  | 'gasLimit'
  | 'gasPrice'
  | 'builds'
  | 'unwinds'
  | 'liquidates';

export type Unwind = {
  id: Scalars['ID'];
  owner: Account;
  position: Position;
  unwindNumber: Scalars['BigInt'];
  currentOi: Scalars['BigInt'];
  currentDebt: Scalars['BigInt'];
  isLong: Scalars['Boolean'];
  price: Scalars['BigInt'];
  fraction: Scalars['BigInt'];
  transferAmount: Scalars['BigInt'];
  pnl: Scalars['BigInt'];
  size: Scalars['BigInt'];
  mint: Scalars['BigInt'];
  collateral: Scalars['BigInt'];
  value: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Unwind_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<Account_filter>;
  position?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_filter>;
  unwindNumber?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_not?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_gt?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_lt?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_gte?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_lte?: InputMaybe<Scalars['BigInt']>;
  unwindNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unwindNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentOi?: InputMaybe<Scalars['BigInt']>;
  currentOi_not?: InputMaybe<Scalars['BigInt']>;
  currentOi_gt?: InputMaybe<Scalars['BigInt']>;
  currentOi_lt?: InputMaybe<Scalars['BigInt']>;
  currentOi_gte?: InputMaybe<Scalars['BigInt']>;
  currentOi_lte?: InputMaybe<Scalars['BigInt']>;
  currentOi_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentOi_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_not?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lt?: InputMaybe<Scalars['BigInt']>;
  currentDebt_gte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_lte?: InputMaybe<Scalars['BigInt']>;
  currentDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isLong?: InputMaybe<Scalars['Boolean']>;
  isLong_not?: InputMaybe<Scalars['Boolean']>;
  isLong_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLong_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fraction?: InputMaybe<Scalars['BigInt']>;
  fraction_not?: InputMaybe<Scalars['BigInt']>;
  fraction_gt?: InputMaybe<Scalars['BigInt']>;
  fraction_lt?: InputMaybe<Scalars['BigInt']>;
  fraction_gte?: InputMaybe<Scalars['BigInt']>;
  fraction_lte?: InputMaybe<Scalars['BigInt']>;
  fraction_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fraction_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transferAmount?: InputMaybe<Scalars['BigInt']>;
  transferAmount_not?: InputMaybe<Scalars['BigInt']>;
  transferAmount_gt?: InputMaybe<Scalars['BigInt']>;
  transferAmount_lt?: InputMaybe<Scalars['BigInt']>;
  transferAmount_gte?: InputMaybe<Scalars['BigInt']>;
  transferAmount_lte?: InputMaybe<Scalars['BigInt']>;
  transferAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pnl?: InputMaybe<Scalars['BigInt']>;
  pnl_not?: InputMaybe<Scalars['BigInt']>;
  pnl_gt?: InputMaybe<Scalars['BigInt']>;
  pnl_lt?: InputMaybe<Scalars['BigInt']>;
  pnl_gte?: InputMaybe<Scalars['BigInt']>;
  pnl_lte?: InputMaybe<Scalars['BigInt']>;
  pnl_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pnl_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  size?: InputMaybe<Scalars['BigInt']>;
  size_not?: InputMaybe<Scalars['BigInt']>;
  size_gt?: InputMaybe<Scalars['BigInt']>;
  size_lt?: InputMaybe<Scalars['BigInt']>;
  size_gte?: InputMaybe<Scalars['BigInt']>;
  size_lte?: InputMaybe<Scalars['BigInt']>;
  size_in?: InputMaybe<Array<Scalars['BigInt']>>;
  size_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint?: InputMaybe<Scalars['BigInt']>;
  mint_not?: InputMaybe<Scalars['BigInt']>;
  mint_gt?: InputMaybe<Scalars['BigInt']>;
  mint_lt?: InputMaybe<Scalars['BigInt']>;
  mint_gte?: InputMaybe<Scalars['BigInt']>;
  mint_lte?: InputMaybe<Scalars['BigInt']>;
  mint_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mint_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral?: InputMaybe<Scalars['BigInt']>;
  collateral_not?: InputMaybe<Scalars['BigInt']>;
  collateral_gt?: InputMaybe<Scalars['BigInt']>;
  collateral_lt?: InputMaybe<Scalars['BigInt']>;
  collateral_gte?: InputMaybe<Scalars['BigInt']>;
  collateral_lte?: InputMaybe<Scalars['BigInt']>;
  collateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Unwind_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Unwind_filter>>>;
};

export type Unwind_orderBy =
  | 'id'
  | 'owner'
  | 'owner__id'
  | 'position'
  | 'position__id'
  | 'position__positionId'
  | 'position__initialOi'
  | 'position__initialDebt'
  | 'position__initialCollateral'
  | 'position__initialNotional'
  | 'position__leverage'
  | 'position__fractionUnwound'
  | 'position__isLong'
  | 'position__entryPrice'
  | 'position__isLiquidated'
  | 'position__currentOi'
  | 'position__currentDebt'
  | 'position__mint'
  | 'position__createdAtTimestamp'
  | 'position__createdAtBlockNumber'
  | 'position__numberOfUniwnds'
  | 'unwindNumber'
  | 'currentOi'
  | 'currentDebt'
  | 'isLong'
  | 'price'
  | 'fraction'
  | 'transferAmount'
  | 'pnl'
  | 'size'
  | 'mint'
  | 'collateral'
  | 'value'
  | 'timestamp'
  | 'transaction'
  | 'transaction__id'
  | 'transaction__blockNumber'
  | 'transaction__timestamp'
  | 'transaction__gasLimit'
  | 'transaction__gasPrice';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  factory: InContextSdkMethod<Query['factory'], QueryfactoryArgs, MeshContext>,
  /** null **/
  factories: InContextSdkMethod<Query['factories'], QueryfactoriesArgs, MeshContext>,
  /** null **/
  market: InContextSdkMethod<Query['market'], QuerymarketArgs, MeshContext>,
  /** null **/
  markets: InContextSdkMethod<Query['markets'], QuerymarketsArgs, MeshContext>,
  /** null **/
  position: InContextSdkMethod<Query['position'], QuerypositionArgs, MeshContext>,
  /** null **/
  positions: InContextSdkMethod<Query['positions'], QuerypositionsArgs, MeshContext>,
  /** null **/
  transaction: InContextSdkMethod<Query['transaction'], QuerytransactionArgs, MeshContext>,
  /** null **/
  transactions: InContextSdkMethod<Query['transactions'], QuerytransactionsArgs, MeshContext>,
  /** null **/
  build: InContextSdkMethod<Query['build'], QuerybuildArgs, MeshContext>,
  /** null **/
  builds: InContextSdkMethod<Query['builds'], QuerybuildsArgs, MeshContext>,
  /** null **/
  unwind: InContextSdkMethod<Query['unwind'], QueryunwindArgs, MeshContext>,
  /** null **/
  unwinds: InContextSdkMethod<Query['unwinds'], QueryunwindsArgs, MeshContext>,
  /** null **/
  liquidate: InContextSdkMethod<Query['liquidate'], QueryliquidateArgs, MeshContext>,
  /** null **/
  liquidates: InContextSdkMethod<Query['liquidates'], QueryliquidatesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Query['account'], QueryaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Query['accounts'], QueryaccountsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  factory: InContextSdkMethod<Subscription['factory'], SubscriptionfactoryArgs, MeshContext>,
  /** null **/
  factories: InContextSdkMethod<Subscription['factories'], SubscriptionfactoriesArgs, MeshContext>,
  /** null **/
  market: InContextSdkMethod<Subscription['market'], SubscriptionmarketArgs, MeshContext>,
  /** null **/
  markets: InContextSdkMethod<Subscription['markets'], SubscriptionmarketsArgs, MeshContext>,
  /** null **/
  position: InContextSdkMethod<Subscription['position'], SubscriptionpositionArgs, MeshContext>,
  /** null **/
  positions: InContextSdkMethod<Subscription['positions'], SubscriptionpositionsArgs, MeshContext>,
  /** null **/
  transaction: InContextSdkMethod<Subscription['transaction'], SubscriptiontransactionArgs, MeshContext>,
  /** null **/
  transactions: InContextSdkMethod<Subscription['transactions'], SubscriptiontransactionsArgs, MeshContext>,
  /** null **/
  build: InContextSdkMethod<Subscription['build'], SubscriptionbuildArgs, MeshContext>,
  /** null **/
  builds: InContextSdkMethod<Subscription['builds'], SubscriptionbuildsArgs, MeshContext>,
  /** null **/
  unwind: InContextSdkMethod<Subscription['unwind'], SubscriptionunwindArgs, MeshContext>,
  /** null **/
  unwinds: InContextSdkMethod<Subscription['unwinds'], SubscriptionunwindsArgs, MeshContext>,
  /** null **/
  liquidate: InContextSdkMethod<Subscription['liquidate'], SubscriptionliquidateArgs, MeshContext>,
  /** null **/
  liquidates: InContextSdkMethod<Subscription['liquidates'], SubscriptionliquidatesArgs, MeshContext>,
  /** null **/
  account: InContextSdkMethod<Subscription['account'], SubscriptionaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Subscription['accounts'], SubscriptionaccountsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["overlayv2"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
