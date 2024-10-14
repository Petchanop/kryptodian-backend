import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        JwtModule,
        UserModule,
    ],
    controllers: [ProfileController],
    providers: [
        ProfileService,
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [TypeOrmModule, ProfileService],
})

export class ProfileModule { }
