import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioController } from './portfolio/portfolio.controller';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AuthModule } from './auth/auth.module';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { Profile } from './profile/entities/profile.entity';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { ProfileModule } from './profile/profile.module';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [User, Profile, Portfolio],
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
    JwtModule,
    PortfolioModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController, PortfolioController, ProfileController],
  providers: [AppService, PortfolioService, ProfileService],
})
export class AppModule { 
  constructor(private dataSource: DataSource) {}
}
