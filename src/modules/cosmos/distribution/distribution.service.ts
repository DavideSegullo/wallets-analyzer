import { Injectable } from '@nestjs/common';
import { DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { QueryDelegationTotalRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import { from, map, Observable, switchMap } from 'rxjs';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';

@Injectable()
export class DistributionService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  validatorCommission(validatorAddress: string): Observable<DecCoin[]> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) =>
        from(connection.validatorCommission(validatorAddress)).pipe(
          map((response) =>
            response.commission ? response.commission.commission : [],
          ),
        ),
      ),
    );
  }

  delegationTotalRewards(
    delegatorAddress: string,
  ): Observable<QueryDelegationTotalRewardsResponse> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) =>
        from(connection.delegationTotalRewards(delegatorAddress)),
      ),
    );
  }
}
