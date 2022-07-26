import {
  StargateClient,
  AuthExtension,
  BankExtension,
  GovExtension,
  StakingExtension,
  DistributionExtension,
  TxExtension,
  setupDistributionExtension,
  setupAuthExtension,
  setupBankExtension,
  setupGovExtension,
  setupStakingExtension,
  setupTxExtension,
  QueryClient,
  HttpEndpoint,
  StargateClientOptions,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import {
  QueryDelegationTotalRewardsResponse,
  QueryValidatorCommissionResponse,
} from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import Long from 'long';
import {
  LockupExtension,
  GammExtension,
  setupOsmosisLockupExtension,
  setupOsmosisGammExtension,
} from 'src/osmosis/query';

export class AnalyzerClient extends StargateClient {
  public static async connect(
    endpoint: string | HttpEndpoint,
    options: StargateClientOptions = {},
  ): Promise<AnalyzerClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);

    return new AnalyzerClient(tmClient, options);
  }

  protected getQueryClient():
    | (QueryClient &
        AuthExtension &
        BankExtension &
        StakingExtension &
        TxExtension &
        GovExtension &
        DistributionExtension &
        LockupExtension &
        GammExtension)
    | undefined {
    return QueryClient.withExtensions(
      this.getTmClient(),
      setupDistributionExtension,
      setupAuthExtension,
      setupBankExtension,
      setupGovExtension,
      setupStakingExtension,
      setupTxExtension,
      setupOsmosisLockupExtension,
      setupOsmosisGammExtension,
    );
  }

  protected forceGetQueryClient(): QueryClient &
    AuthExtension &
    BankExtension &
    StakingExtension &
    TxExtension &
    GovExtension &
    DistributionExtension &
    LockupExtension &
    GammExtension {
    if (!this.getQueryClient()) {
      throw new Error(
        'Query client not available. You cannot use online functionality in offline mode.',
      );
    }

    return this.getQueryClient();
  }

  public delegationTotalRewards(
    delegatorAddress: string,
  ): Promise<QueryDelegationTotalRewardsResponse> {
    return this.forceGetQueryClient().distribution.delegationTotalRewards(
      delegatorAddress,
    );
  }

  public validatorCommission(
    validatorAddress: string,
  ): Promise<QueryValidatorCommissionResponse> {
    return this.forceGetQueryClient().distribution.validatorCommission(
      validatorAddress,
    );
  }

  public pool(poolId: string) {
    return this.forceGetQueryClient().gamm.pool({
      poolId: Long.fromString(poolId),
    });
  }

  public accountLockedCoins(owner: string) {
    return this.forceGetQueryClient().lockup.accountLockedCoins({ owner });
  }
}
