import { Coin } from '@cosmjs/stargate';

export interface RawPoolParams {
  swapFee: string;
  exitFee: string;
  smoothWeightChangeParams: string | null;
}

export interface RawOsmosisPoolAsset {
  token: Coin;
  weight: string;
}

export interface RawOsmosisPool {
  address: string;
  id: string;
  poolParams: RawPoolParams;
  future_pool_governor: string;
  totalShares: Coin;
  poolAssets: RawOsmosisPoolAsset[];
  totalWeight: string;
}
