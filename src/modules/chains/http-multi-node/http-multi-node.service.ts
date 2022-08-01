import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { BehaviorSubject, Observable, of, retry, switchMap, tap } from 'rxjs';
import { ChainConfig } from 'src/types';

@Injectable()
export class HttpMultiNodeService {
  public restUrls: string[] = [];

  constructor(
    @Inject('ANALYZER_CHAIN') chain: ChainConfig,
    private readonly httpClient: HttpService,
  ) {
    this.restUrls = chain.apis.rest.map((node) => node.address);
  }

  getRetry<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    const connectionRetry = new BehaviorSubject<number>(0);

    return connectionRetry.pipe(
      switchMap((attempt) => {
        return this.httpClient
          .get<T>(`${this.restUrls[attempt]}${url}`, config)
          .pipe(
            tap(() => {
              connectionRetry.complete();
            }),
          );
      }),
      retry({
        count: this.restUrls.length,
        delay: (_, retryCount) => {
          connectionRetry.next(retryCount);

          return of(retryCount);
        },
        resetOnSuccess: true,
      }),
    );
  }
}
