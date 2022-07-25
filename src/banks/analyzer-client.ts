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
        DistributionExtension)
    | undefined {
    return QueryClient.withExtensions(
      this.getTmClient(),
      setupDistributionExtension,
      setupAuthExtension,
      setupBankExtension,
      setupGovExtension,
      setupStakingExtension,
      setupTxExtension,
    );
  }

  protected forceGetQueryClient(): QueryClient &
    AuthExtension &
    BankExtension &
    StakingExtension &
    TxExtension &
    GovExtension &
    DistributionExtension {
    if (!this.getQueryClient()) {
      throw new Error(
        'Query client not available. You cannot use online functionality in offline mode.',
      );
    }

    return this.getQueryClient();
  }

  public delegationTotalRewards(delegatorAddress: string) {
    return this.forceGetQueryClient().distribution.delegationTotalRewards(
      delegatorAddress,
    );
  }
}
