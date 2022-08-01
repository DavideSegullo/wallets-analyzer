import { from, Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';
import { Coin } from '@cosmjs/stargate';

@Injectable()
export class StakingService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  getBalanceStaked(address: string): Observable<Coin> {
    return from(this.chainsClient.queryClient.getBalanceStaked(address));
  }
}
