import { Test, TestingModule } from '@nestjs/testing';
import { ChainRpcService } from './chain-rpc.service';

describe('ChainRpcService', () => {
  let service: ChainRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainRpcService],
    }).compile();

    service = module.get<ChainRpcService>(ChainRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
