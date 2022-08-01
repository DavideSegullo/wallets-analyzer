import {
  ChainData,
  ChainPaginationParams,
  ChainPaginationResponse,
  OsmosisPool,
} from 'src/types';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpMultiNodeService } from 'src/modules/chains/http-multi-node/http-multi-node.service';

@Injectable()
export class PoolsService {
  constructor(private readonly httpService: HttpMultiNodeService) {}

  pool(poolId: string): Observable<OsmosisPool> {
    return this.httpService
      .getRetry<ChainData<'pool', OsmosisPool>>(
        `/osmosis/gamm/v1beta1/pools/${poolId}`,
      )
      .pipe(map((response) => response.data.pool));
  }

  pools(
    params: ChainPaginationParams = { 'pagination.limit': '1000' },
  ): Observable<OsmosisPool[]> {
    return this.httpService
      .getRetry<ChainPaginationResponse<'pools', OsmosisPool[]>>(
        `/osmosis/gamm/v1beta1/pools`,
        { params },
      )
      .pipe(map((response) => response.data.pools));
  }
}
