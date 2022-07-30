import { Coin, createProtobufRpcClient, QueryClient } from '@cosmjs/stargate';
import { osmosis } from 'osmojs';
import { assert } from '@cosmjs/utils';
import Long from 'long';

export interface LockupExtension {
  readonly lockup: {
    readonly accountLockedCoins: (request: {
      owner: string;
    }) => Promise<Coin[]>;
  };
}

export interface GammExtension {
  readonly gamm: {
    readonly pool: (request: { poolId: Long }) => Promise<any>;
  };
}

export const setupOsmosisGammExtension = (base: QueryClient): GammExtension => {
  const rpc = createProtobufRpcClient(base);

  const QueryClientImpl = osmosis.gamm.v1beta1.QueryClientImpl;
  const queryService = new QueryClientImpl(rpc);

  return {
    gamm: {
      pool: async (request: { poolId: Long }) => {
        const { pool } = await queryService.pool(request);

        assert(pool);

        return pool;
      },
    },
  };
};

export const setupOsmosisLockupExtension = (
  base: QueryClient,
): LockupExtension => {
  const rpc = createProtobufRpcClient(base);

  const QueryClientImpl = osmosis.lockup.QueryClientImpl;
  const queryService = new QueryClientImpl(rpc);

  return {
    lockup: {
      accountLockedCoins: async (request: { owner: string }) => {
        const { coins } = await queryService.accountLockedCoins(request);

        assert(coins);

        return coins;
      },
    },
  };
};
