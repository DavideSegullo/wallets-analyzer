import { NestFactory } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import { AppModule } from './app.module';
import { HttpMultiNodeService } from './modules/chains/http-multi-node/http-multi-node.service';
import { OsmosisModule } from './modules/osmosis/osmosis.module';
import { PoolsService } from './modules/osmosis/pools/pools.service';
import { SnapshotService } from './modules/snapshots/snapshot/snapshot.service';
import { SnapshotsModule } from './modules/snapshots/snapshots.module';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    const snapshotService = app
      .select(SnapshotsModule)
      .get(SnapshotService, { strict: true });

    const poolsService = await app.select(OsmosisModule).resolve(PoolsService);

    snapshotService.handleCron(async () => {
      HttpMultiNodeService.setChain('osmosis');

      await lastValueFrom(poolsService.savePools());
    });

    await app.close();
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
