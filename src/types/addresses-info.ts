import { Coin } from '@cosmjs/stargate';
import { DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { QueryDelegationTotalRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import { OsmosisPool } from './pools';

export interface ChainMap {
  [key: string]: {
    addresses: string[];
    validatorAddresses: string[];
  };
}

export interface AddressLockedCoins extends Partial<OsmosisPool> {
  userLockedCoins: Coin[];
}

export interface AddressInfo {
  address: string;
  balances: readonly Coin[];
  staked: Coin;
  stakingRewards: QueryDelegationTotalRewardsResponse;
  lockedCoins: AddressLockedCoins[];
}

export interface ValidatorInfo {
  address: string;
  commissions: DecCoin[];
}

export interface AddressesInfo {
  [key: string]: {
    addresses: AddressInfo[];
    validatorAddresses: ValidatorInfo[];
  };
}
