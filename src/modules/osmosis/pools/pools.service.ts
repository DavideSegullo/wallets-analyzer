import {
  ChainData,
  ChainPaginationParams,
  ChainPaginationResponse,
  RawOsmosisPool,
} from 'src/types';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpMultiNodeService } from 'src/modules/chains/http-multi-node/http-multi-node.service';

@Injectable()
export class PoolsService {
  constructor(private readonly httpService: HttpMultiNodeService) {}

  pool(poolId: string): Observable<RawOsmosisPool> {
    return this.httpService
      .getRetry<ChainData<'pool', RawOsmosisPool>>(
        `/osmosis/gamm/v1beta1/pools/${poolId}`,
      )
      .pipe(map((response) => response.data.pool));
  }

  pools(
    params: ChainPaginationParams = { 'pagination.limit': '1000' },
  ): Observable<RawOsmosisPool[]> {
    return this.httpService
      .getRetry<ChainPaginationResponse<'pools', RawOsmosisPool[]>>(
        `/osmosis/gamm/v1beta1/pools`,
        { params },
      )
      .pipe(map((response) => response.data.pools));
  }
}
