import { HttpModule } from '@nestjs/axios';
import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { extractChainName } from 'src/utils';
import { ChainsClientService } from './chains-client/chains-client.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'ANALYZER_CHAIN',
      useFactory: (request) => {
        return extractChainName(request);
      },
      inject: [REQUEST],
      scope: Scope.REQUEST,
    },
    ChainsClientService,
  ],
  exports: ['ANALYZER_CHAIN', ChainsClientService],
})
export class ChainsModule {}
