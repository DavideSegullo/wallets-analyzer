import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { catchError, forkJoin, from, map, Observable, of } from 'rxjs';
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

  getBalances(address: string) {
    return from(this.client.getAllBalances(address));
  }

  getBalanceStaked(address: string) {
    return from(this.client.getBalanceStaked(address));
  }

  delegationTotalRewards(delegatorAddress: string) {
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
