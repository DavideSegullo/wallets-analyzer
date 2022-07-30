import { Module } from '@nestjs/common';
import { BankService } from './bank/bank.service';
import { StakingService } from './staking/staking.service';
import { DistributionService } from './distribution/distribution.service';

@Module({
  providers: [BankService, StakingService, DistributionService]
})
export class CosmosModule {}
