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
  switchMap,
  tap,
} from 'rxjs';
import { AnalyzerQueryClient } from 'src/query-client/query-client';
import BigNumber from 'bignumber.js';
import { gammToPoolAmount } from 'src/utils';
import { HttpService } from '@nestjs/axios';
import { AssetsGammCoins, ChainData, RawOsmosisPool } from 'src/types';

@Injectable()
export class BanksService {
  client: AnalyzerQueryClient;
  restUrl: string;
  pools: RawOsmosisPool[] = [];

  constructor(private readonly httpService: HttpService) {}

  async connect(rpcUrl: string, restUrl: string) {
    this.client = await AnalyzerQueryClient.connect(rpcUrl);

    this.restUrl = restUrl;
  }

  getAddressesInfo(addresses: string[]) {
    const joins = addresses.map((address) =>
      forkJoin([
        this.getBalances(address).pipe(
          switchMap((allBalances) => {
            const gammBalances = allBalances.filter((balance) =>
              balance.denom.startsWith('gamm/pool/'),
            );

            const balances = allBalances.filter(
              (balance) => !balance.denom.startsWith('gamm/pool/'),
            );

            return forkJoin([
              of(balances),
              this.getAssetsFromGamm(gammBalances),
            ]);
          }),
        ),
        this.getBalanceStaked(address),
        this.delegationTotalRewards(address),
        this.accountLockedCoins(address).pipe(
          switchMap((lockedCoins) => this.getAssetsFromGamm(lockedCoins)),
        ),
      ]).pipe(
        map(
          ([
            [balances, gammBalances],
            staked,
            stakingRewards,
            lockedCoins,
          ]) => ({
            address,
            balances,
            gammBalances,
            staked,
            stakingRewards,
            lockedCoins,
          }),
        ),
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

  getAssetsFromGamm(
    gammCoins: Coin[] | readonly Coin[],
  ): Observable<AssetsGammCoins[]> {
    if (gammCoins.length > 0) {
      return this.poolsFromLockedCoins(gammCoins).pipe(
        map((pools) => {
          return pools.map((pool) => {
            let bondedShare = new BigNumber(0);

            const coins = pool.poolAssets.map((asset) => {
              const totalPoolGamm = new BigNumber(pool.totalShares.amount);
              const totalTokenGamm = new BigNumber(asset.token.amount);

              let bondedAmount = new BigNumber('0');

              const bondedBalances = gammCoins.filter(
                (coin) => coin.denom === `gamm/pool/${pool.id}`,
              );

              for (const bondedBalance of bondedBalances) {
                bondedAmount = bondedAmount.plus(bondedBalance.amount);
              }

              bondedShare = bondedShare.plus(bondedAmount);

              const userTotalAmount = gammToPoolAmount(
                bondedAmount,
                totalPoolGamm,
                totalTokenGamm,
                '1e0',
              );

              return {
                denom: asset.token.denom,
                amount: userTotalAmount,
              };
            });

            return {
              poolId: pool.id,
              bondedShare: bondedShare.div(pool.totalShares.amount).toString(),
              userLockedCoins: coins,
            };
          });
        }),
      );
    }

    return of([]);
  }

  poolsFromLockedCoins(lockedCoins: Coin[] | readonly Coin[]) {
    const observables = lockedCoins.map((lockedCoin) => {
      const poolId = lockedCoin.denom.replace('gamm/pool/', '');

      return this.pool(poolId);
    });

    return forkJoin(observables);
  }

  pool(poolId: string): Observable<RawOsmosisPool> {
    const poolCache = this.pools.find((pool) => pool.id === poolId);

    if (!poolCache) {
      return this.httpService
        .get<ChainData<'pool', RawOsmosisPool>>(
          `${this.restUrl}/osmosis/gamm/v1beta1/pools/${poolId}`,
        )
        .pipe(
          map((response) => response.data.pool),
          tap((pool) => {
            this.pools.push(pool);
          }),
        );
    }

    return of(poolCache);
  }

  disconnect() {
    this.client.disconnect();
  }
}
