import { Coin, createProtobufRpcClient, QueryClient } from '@cosmjs/stargate';
import { osmosis } from 'osmojs';
import { assert } from '@cosmjs/utils';

export interface LockupExtension {
  readonly lockup: {
    readonly accountLockedCoins: (request: {
      owner: string;
    }) => Promise<Coin[]>;
  };
}

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
