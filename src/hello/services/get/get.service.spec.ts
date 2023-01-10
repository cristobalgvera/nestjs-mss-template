import { Test, TestingModule } from '@nestjs/testing';
import { GetService } from './get.service';

describe('GetService', () => {
  let service: GetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetService],
    }).compile();

    service = module.get<GetService>(GetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
