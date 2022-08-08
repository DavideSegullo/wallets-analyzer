import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SnapshotService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  handleCron(exec: () => void, time = '10 * * * * *') {
    const job = new CronJob(time, () => {
      exec();
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}`, job);

    job.start();
  }
}
