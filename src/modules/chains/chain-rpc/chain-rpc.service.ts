import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { AnalyzerQueryClient } from 'src/query-client/query-client';
import { ChainConfig } from 'src/types';

@Injectable()
export class ChainRpcService {
  public queryClient: Observable<AnalyzerQueryClient>;
  public rpcUrls: string[] = [];

  constructor(
    @Inject('ANALYZER_CHAIN') chain: ChainConfig,
    public readonly httpClient: HttpService,
  ) {
    this.rpcUrls = chain.apis.rpc.map((node) => node.address);

    this.connect();
  }

  private async connect() {
    const connectionRetry = new BehaviorSubject<number>(0);

    this.queryClient = connectionRetry.pipe(
      switchMap((attempt) => {
        return from(AnalyzerQueryClient.connect(this.rpcUrls[attempt])).pipe(
          tap(() => {
            connectionRetry.complete();
          }),
        );
      }),
      retry({
        count: this.rpcUrls.length,
        delay: (_, retryCount) => {
          connectionRetry.next(retryCount);

          return of(retryCount);
        },
        resetOnSuccess: true,
      }),
    );
  }
}
