import { Coin } from '@cosmjs/stargate';
import { Injectable } from '@nestjs/common';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { ChainRpcService } from 'src/modules/chains/chain-rpc/chain-rpc.service';

@Injectable()
export class LockupService {
  constructor(private readonly chainsClient: ChainRpcService) {}

  lockedCoins(owner: string): Observable<Coin[]> {
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
