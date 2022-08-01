import { from, Observable, switchMap } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { ChainRpcService } from 'src/modules/chains/chain-rpc/chain-rpc.service';
import { Coin } from '@cosmjs/stargate';

@Injectable()
export class StakingService {
  constructor(private readonly chainsClient: ChainRpcService) {}

  getBalanceStaked(address: string): Observable<Coin> {
    return this.chainsClient.queryClient.pipe(
      switchMap((connection) => from(connection.getBalanceStaked(address))),
    );
  }
}
