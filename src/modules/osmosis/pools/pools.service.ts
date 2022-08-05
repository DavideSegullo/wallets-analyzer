import {
  ChainData,
  ChainPaginationParams,
  ChainPaginationResponse,
  RawOsmosisPool,
} from 'src/types';
import { Injectable } from '@nestjs/common';
import { from, map, Observable, switchMap } from 'rxjs';
import { HttpMultiNodeService } from 'src/modules/chains/http-multi-node/http-multi-node.service';
import { Pool, PoolDocument, PoolMeta } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PoolsService {
  constructor(
    @InjectModel(Pool.name) private poolModel: Model<PoolDocument>,
    private readonly httpService: HttpMultiNodeService,
  ) {}

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

  savePools() {
    return this.pools().pipe(
      map((pools) =>
        pools.map<Pool>((pool) => {
          const poolMeta: PoolMeta = {
            id: pool.id,
            address: pool.address,
            poolParams: pool.poolParams,
            futurePoolGovernor: pool.future_pool_governor,
          };

          return {
            poolMeta,
            totalShares: pool.totalShares,
            poolAssets: pool.poolAssets,
            totalWeight: pool.totalWeight,
          };
        }),
      ),
      switchMap((pools) => from(this.poolModel.insertMany(pools))),
    );
  }
}
