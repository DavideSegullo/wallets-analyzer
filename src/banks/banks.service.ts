import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { DecCoin } from 'osmojs/types/proto/cosmos/base/v1beta1/coin';
import { QueryDelegationTotalRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { AnalyzerClient } from 'src/banks/analyzer-client';

@Injectable()
export class BanksService {
  client: AnalyzerClient;

  async connect(rpcUrl: string) {
    this.client = await AnalyzerClient.connect(rpcUrl);
  }

  getAddressesInfo(addresses: string[]) {
    const joins = addresses.map((address) =>
      forkJoin([
        this.getBalances(address),
        this.getBalanceStaked(address),
        this.delegationTotalRewards(address),
        this.accountLockedCoins(address),
      ]).pipe(
        map(([balances, staked, stakingRewards, lockedCoins]) => ({
          address,
          balances,
          staked,
          stakingRewards,
          lockedCoins,
        })),
      ),
    );

    return forkJoin(joins);
  }

  getValidatorAddressesInfo(addresses: string[]) {
    const joins = addresses.map((address) =>
      forkJoin([this.validatorCommission(address)]).pipe(
        map(([commissions]) => ({
          address,
          commissions,
        })),
      ),
    );

    return forkJoin(joins);
  }

  getBalances(address: string): Observable<readonly Coin[]> {
    return from(this.client.getAllBalances(address));
  }

  getBalanceStaked(address: string): Observable<Coin> {
    return from(this.client.getBalanceStaked(address));
  }

  validatorCommission(validatorAddress: string): Observable<DecCoin[]> {
    return from(this.client.validatorCommission(validatorAddress)).pipe(
      map((response) =>
        response.commission ? response.commission.commission : [],
      ),
    );
  }

  delegationTotalRewards(
    delegatorAddress: string,
  ): Observable<QueryDelegationTotalRewardsResponse> {
    return from(this.client.delegationTotalRewards(delegatorAddress));
  }

  accountLockedCoins(owner: string): Observable<Coin[]> {
    return from(this.client.accountLockedCoins(owner)).pipe(
      catchError(() => {
        return of([]);
      }),
    );
  }

  disconnect() {
    this.client.disconnect();
  }
}
