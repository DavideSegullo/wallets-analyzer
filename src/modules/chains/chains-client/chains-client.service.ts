import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AnalyzerQueryClient } from 'src/query-client/query-client';
import { ChainConfig } from 'src/types';

@Injectable()
export class ChainsClientService {
  public client: AnalyzerQueryClient;

  constructor(
    @Inject('ANALYZER_CHAIN') chain: ChainConfig,
    private readonly httpService: HttpService,
  ) {
    const rpcUrl = chain.apis.rpc[0].address;
    const restUrl = chain.apis.rest[0].address;

    this.connect(rpcUrl);

    this.httpService.axiosRef.defaults.baseURL = restUrl;
  }

  async connect(rpcUrl: string) {
    this.client = await AnalyzerQueryClient.connect(rpcUrl);
  }
}
