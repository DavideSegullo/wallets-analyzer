import { HttpModule } from '@nestjs/axios';
import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { extractChainName } from 'src/utils';
import { HttpMultiNodeService } from './http-multi-node/http-multi-node.service';
import { ChainRpcService } from './chain-rpc/chain-rpc.service';

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
    HttpMultiNodeService,
    ChainRpcService,
  ],
  exports: ['ANALYZER_CHAIN', HttpMultiNodeService, ChainRpcService],
})
export class ChainsModule {}
