import { Module } from '@nestjs/common';
import { CosmosModule } from 'src/modules/cosmos/cosmos.module';
import { OsmosisModule } from 'src/modules/osmosis/osmosis.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [CosmosModule, OsmosisModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
