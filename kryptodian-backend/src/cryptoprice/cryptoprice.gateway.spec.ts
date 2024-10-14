import { Test, TestingModule } from '@nestjs/testing';
import { CryptopriceGateway } from './cryptoprice.gateway';

describe('CryptopriceGateway', () => {
  let gateway: CryptopriceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptopriceGateway],
    }).compile();

    gateway = module.get<CryptopriceGateway>(CryptopriceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
