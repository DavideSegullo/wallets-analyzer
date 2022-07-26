import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { DecCoin } from 'osmojs/types/proto/cosmos/base/v1beta1/coin';
import { QueryDelegationTotalRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import {
  catchError,
  combineLatest,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { AnalyzerClient } from 'src/banks/analyzer-client';
import BigNumber from 'bignumber.js';
import { gammToPoolAmount } from 'src/utils';
import { HttpService } from '@nestjs/axios';
import { ChainData, OsmosisPool } from 'src/types';

@Injectable()
export class BanksService {
  client: AnalyzerClient;
  restUrl: string;

  constructor(private readonly httpService: HttpService) {}

  async connect(rpcUrl: string, restUrl: string) {
    this.client = await AnalyzerClient.connect(rpcUrl);

    this.restUrl = restUrl;
  }

  getAddressesInfo(addresses: string[]) {
    const joins = addresses.map((address) =>
      forkJoin([
        this.getBalances(address),
        this.getBalanceStaked(address),
        this.delegationTotalRewards(address),
        this.accountLockedCoins(address).pipe(
          switchMap((lockedCoins) => {
            if (lockedCoins.length > 0) {
              return this.poolsFromLockedCoins(lockedCoins).pipe(
                map((pools) => {
                  return pools.map((pool) => {
                    const coins = pool.poolAssets.map((asset) => {
                      const totalPoolGamm = new BigNumber(
                        pool.totalShares.amount,
                      );
                      const totalTokenGamm = new BigNumber(asset.token.amount);

                      let bondedAmount = new BigNumber('0');

                      const bondedBalances = lockedCoins.filter(
                        (coin) => coin.denom === `gamm/pool/${pool.id}`,
                      );

                      for (const bondedBalance of bondedBalances) {
                        bondedAmount = bondedAmount.plus(bondedBalance.amount);
                      }

                      const userTotalAmount = gammToPoolAmount(
                        bondedAmount,
                        totalPoolGamm,
                        totalTokenGamm,
                        '1e-6',
                      );

                      return {
                        denom: asset.token.denom,
                        amount: userTotalAmount,
                      };
                    });

                    return {
                      ...pool,
                      userLockedCoins: coins,
                    };
                  });
                }),
              );
            }

            return of([]);
          }),
        ),
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

    return joins.length > 0 ? forkJoin(joins) : of([]);
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

    return joins.length > 0 ? forkJoin(joins) : of([]);
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
      catchError((error) => {
        console.error(error);
        return throwError(error);
      }),
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

  poolsFromLockedCoins(lockedCoins: Coin[]) {
    const observables = lockedCoins.map((lockedCoin) => {
      const poolId = lockedCoin.denom.replace('gamm/pool/', '');

      return this.pool(poolId);
    });

    return forkJoin(observables);
  }

  pool(poolId: string): Observable<OsmosisPool> {
    return this.httpService
      .get<ChainData<'pool', OsmosisPool>>(
        `${this.restUrl}/osmosis/gamm/v1beta1/pools/${poolId}`,
      )
      .pipe(map((response) => response.data.pool));
  }

  disconnect() {
    this.client.disconnect();
  }
}
