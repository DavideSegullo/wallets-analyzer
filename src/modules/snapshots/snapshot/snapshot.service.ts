import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PoolsService } from 'src/modules/osmosis/pools/pools.service';

@Injectable()
export class SnapshotService {
  constructor(private poolsService: PoolsService) {}

  /* handleCron(exec: () => void, time = '45 * * * * *') {
    const job = new CronJob(time, () => {
      exec();
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}`, job);

    job.start();
  } */

  @Cron(CronExpression.EVERY_10_SECONDS)
  savePools() {
    console.log(this.poolsService);
    /* this.handleCron(() => {
      console.log('cioao');
    }); */
  }
}
