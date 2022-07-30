import { Test, TestingModule } from '@nestjs/testing';
import { LockupService } from './lockup.service';

describe('LockupService', () => {
  let service: LockupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LockupService],
    }).compile();

    service = module.get<LockupService>(LockupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
