import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Portfolio } from './entities/portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([Portfolio]),
        JwtModule,
        HttpModule
    ],  controllers: [PortfolioController],
    providers: [
        PortfolioService,
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [TypeOrmModule, PortfolioService],
})

export class PortfolioModule { }
