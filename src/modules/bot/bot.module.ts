import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelegrafModule } from 'nestjs-telegraf';
import { ApiModule } from '@api/api.module';
import { DatabaseModule } from '@database/database.module';
import { BeastModel } from '@database/models';
import { DuelWidget, InfoWidget, SpawnWidget } from './widgets';
import { SessionService } from '../middlewares/chat-session/session.service';
import { MiddlewaresModule } from '../middlewares/middlewares.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService, sessionService: SessionService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        middlewares: [sessionService.middleware()]
      }),
      imports: [DatabaseModule, MiddlewaresModule],
      inject: [ConfigService, SessionService],
    }),
    ApiModule,
    DatabaseModule,
    SequelizeModule.forFeature([BeastModel]),
  ],
  controllers: [],
  providers: [InfoWidget, SpawnWidget, DuelWidget],
})
export class BotModule {}
