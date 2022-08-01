import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { from, Observable, switchMap } from 'rxjs';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';

@Injectable()
export class BankService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  getBalances(address: string): Observable<readonly Coin[]> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) => from(connection.getAllBalances(address))),
    );
  }

  getBalanceStaked(address: string): Observable<Coin> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) => from(connection.getBalanceStaked(address))),
    );
  }
}
