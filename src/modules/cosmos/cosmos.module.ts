import { Module } from '@nestjs/common';
import { BankService } from './bank/bank.service';
import { StakingService } from './staking/staking.service';
import { DistributionService } from './distribution/distribution.service';
import { ChainsModule } from 'src/modules/chains/chains.module';

@Module({
  imports: [ChainsModule],
  providers: [BankService, StakingService, DistributionService],
  exports: [BankService, StakingService, DistributionService],
})
export class CosmosModule {}
