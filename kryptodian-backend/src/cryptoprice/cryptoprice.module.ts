import { Module } from '@nestjs/common';
import { CryptoPriceClient } from './cryptoprice.client';

@Module({
    providers: [CryptoPriceClient],
})
export class CryptopriceModule {}
