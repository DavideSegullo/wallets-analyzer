import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';

@Module({
  imports: [HttpModule],
  providers: [BanksService],
})
export class BanksModule {}
