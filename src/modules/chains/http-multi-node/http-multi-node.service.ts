import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { BehaviorSubject, Observable, of, retry, switchMap, tap } from 'rxjs';
import { ChainConfig } from 'src/types';
import { extractChainName } from 'src/utils';

@Injectable()
export class HttpMultiNodeService {
  private readonly logger = new Logger(HttpMultiNodeService.name);

  static restUrls: string[] = [];

  constructor(
    @Inject('ANALYZER_CHAIN') chain: ChainConfig,
    private readonly httpClient: HttpService,
  ) {
    HttpMultiNodeService.restUrls = chain.apis.rest.map((node) => node.address);
  }

  static setChain(chainName: string) {
    const chain = extractChainName(chainName);

    HttpMultiNodeService.restUrls = chain.apis.rest.map((node) => node.address);
  }

  getRetry<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    const connectionRetry = new BehaviorSubject<number>(0);

    return connectionRetry.pipe(
      switchMap((attempt) => {
        return this.httpClient
          .get<T>(`${HttpMultiNodeService.restUrls[attempt]}${url}`, config)
          .pipe(
            tap(() => {
              connectionRetry.complete();
            }),
          );
      }),
      retry({
        count: HttpMultiNodeService.restUrls.length,
        delay: (_, retryCount) => {
          connectionRetry.next(retryCount);

          return of(retryCount);
        },
        resetOnSuccess: true,
      }),
    );
  }
}
