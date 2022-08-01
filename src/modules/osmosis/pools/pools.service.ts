import {
  ChainData,
  ChainPaginationParams,
  ChainPaginationResponse,
  OsmosisPool,
} from 'src/types';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ChainsClientService } from 'src/modules/chains/chains-client/chains-client.service';

@Injectable()
export class PoolsService {
  constructor(private readonly chainsClient: ChainsClientService) {}

  pool(poolId: string): Observable<OsmosisPool> {
    return this.chainsClient.httpClient
      .get<ChainData<'pool', OsmosisPool>>(
        `/osmosis/gamm/v1beta1/pools/${poolId}`,
      )
      .pipe(map((response) => response.data.pool));
  }

  pools(
    params: ChainPaginationParams = { 'pagination.limit': '1000' },
  ): Observable<OsmosisPool[]> {
    return this.chainsClient.httpClient
      .get<ChainPaginationResponse<'pools', OsmosisPool[]>>(
        `/osmosis/gamm/v1beta1/pools`,
        { params },
      )
      .pipe(map((response) => response.data.pools));
  }
}
