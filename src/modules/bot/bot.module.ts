import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'
import { DatabaseModule } from '../database/database.module'
import { InfoWidget } from './widgets/info/info.widget'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
      inject: [ConfigService]
    }),
    DatabaseModule
  ],
  controllers: [],
  providers: [InfoWidget],
})
export class BotModule {}
