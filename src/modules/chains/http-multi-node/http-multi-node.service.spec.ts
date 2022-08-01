import { Test, TestingModule } from '@nestjs/testing';
import { HttpMultiNodeService } from './http-multi-node.service';

describe('HttpMultiNodeService', () => {
  let service: HttpMultiNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpMultiNodeService],
    }).compile();

    service = module.get<HttpMultiNodeService>(HttpMultiNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
