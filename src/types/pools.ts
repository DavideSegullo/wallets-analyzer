import { Coin } from '@cosmjs/stargate';

export interface PoolParams {
  swapFee: string;
  exitFee: string;
  smoothWeightChangeParams: string | null;
}

export interface OsmosisPoolAsset {
  token: Coin;
  weight: string;
}

export interface OsmosisPool {
  address: string;
  id: string;
  poolParams: PoolParams;
  future_pool_governor: string;
  totalShares: Coin;
  poolAssets: OsmosisPoolAsset[];
  totalWeight: string;
}
