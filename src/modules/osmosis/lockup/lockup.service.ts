import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { catchError, from, Observable, of } from 'rxjs';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';

@Injectable()
export class LockupService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  accountLockedCoins(owner: string): Observable<Coin[]> {
    return from(this.chainsClient.queryClient.accountLockedCoins(owner)).pipe(
      catchError(() => {
        return of([]);
      }),
    );
  }
}
