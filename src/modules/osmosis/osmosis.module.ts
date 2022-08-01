import { Module } from '@nestjs/common';
import { PoolsService } from './pools/pools.service';
import { LockupService } from './lockup/lockup.service';
import { ChainsModule } from 'src/modules/chains/chains.module';

@Module({
  imports: [ChainsModule],
  providers: [PoolsService, LockupService],
  exports: [PoolsService, LockupService],
})
export class OsmosisModule {}
