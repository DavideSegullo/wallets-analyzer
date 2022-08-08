import { Module } from '@nestjs/common';
import { OsmosisModule } from '../osmosis/osmosis.module';
import { SnapshotService } from './snapshot/snapshot.service';

@Module({
  imports: [OsmosisModule],
  providers: [SnapshotService],
})
export class SnapshotsModule {}
