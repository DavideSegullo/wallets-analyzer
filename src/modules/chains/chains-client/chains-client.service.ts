import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AnalyzerQueryClient } from 'src/query-client/query-client';
import { ChainConfig } from 'src/types';

@Injectable()
export class ChainsClientService {
  public queryClient: Observable<AnalyzerQueryClient>;

  constructor(
    @Inject('ANALYZER_CHAIN') chain: ChainConfig,
    public readonly httpClient: HttpService,
  ) {
    const rpcUrl = chain.apis.rpc[0].address;
    const restUrl = chain.apis.rest[0].address;

    this.connect(rpcUrl);

    this.httpClient.axiosRef.defaults.baseURL = restUrl;
  }

  private async connect(rpcUrl: string) {
    this.queryClient = from(AnalyzerQueryClient.connect(rpcUrl));
  }
}
