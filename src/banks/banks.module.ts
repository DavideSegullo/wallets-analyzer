import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';

@Module({
  providers: [BanksService],
})
export class BanksModule {}
