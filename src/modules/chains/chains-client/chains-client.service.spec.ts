import { Test, TestingModule } from '@nestjs/testing';
import { ChainsClientService } from './chains-client.service';

describe('ChainsClientService', () => {
  let service: ChainsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainsClientService],
    }).compile();

    service = module.get<ChainsClientService>(ChainsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
