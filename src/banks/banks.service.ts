import { Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { AnalyzerClient } from 'src/banks/analyzer-client';

@Injectable()
export class BanksService {
  client: AnalyzerClient;

  async connect(rpcUrl: string) {
    this.client = await AnalyzerClient.connect(rpcUrl);
  }

  getBalances(address: string) {
    return of(this.client.getAllBalances(address));
  }

  getBalanceStaked(address: string) {
    return of(this.client.getBalanceStaked(address));
  }

  delegationTotalRewards(delegatorAddress: string) {
    return of(this.client.delegationTotalRewards(delegatorAddress));
  }

  disconnect() {
    this.client.disconnect();
  }
}
