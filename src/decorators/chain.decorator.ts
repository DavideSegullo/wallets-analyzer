import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractChainName } from 'src/utils';

export const Chain = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.params && request.params.chain) {
      return extractChainName(request.params.chain);
    }
  },
);
