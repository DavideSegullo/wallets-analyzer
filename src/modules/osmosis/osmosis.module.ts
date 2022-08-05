import { Module } from '@nestjs/common';
import { PoolsService } from './pools/pools.service';
import { LockupService } from './lockup/lockup.service';
import { ChainsModule } from 'src/modules/chains/chains.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Pool, PoolSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pool.name, schema: PoolSchema }]),
    ChainsModule,
  ],
  providers: [PoolsService, LockupService],
  exports: [PoolsService, LockupService],
})
export class OsmosisModule {}
