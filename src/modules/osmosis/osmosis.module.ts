import { Module } from '@nestjs/common';
import { PoolsService } from './pools/pools.service';
import { LockupService } from './lockup/lockup.service';

@Module({
  providers: [PoolsService, LockupService],
  exports: [PoolsService],
})
export class OsmosisModule {}
