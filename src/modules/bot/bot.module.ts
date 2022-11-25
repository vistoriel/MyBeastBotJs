import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { TelegrafModule } from 'nestjs-telegraf'
import { ApiModule } from '../api/api.module'
import { DatabaseModule } from '../database/database.module'
import { BeastModel } from '../database/models/beast.model'
import { InfoWidget } from './widgets/info/info.widget'
import { SpawnWidget } from './widgets/spawn/spawn.widget'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
      inject: [ConfigService]
    }),
    ApiModule,
    DatabaseModule,
    SequelizeModule.forFeature([BeastModel])
  ],
  controllers: [],
  providers: [
    InfoWidget, 
    SpawnWidget
  ]
})
export class BotModule {}
