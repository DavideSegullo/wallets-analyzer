import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';

@Injectable()
export class LockupService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  accountLockedCoins(owner: string): Observable<Coin[]> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) =>
        from(connection.accountLockedCoins(owner)).pipe(
          catchError(() => {
            return of([]);
          }),
        ),
      ),
    );
  }
}
