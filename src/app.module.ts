import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BotModule } from './modules/bot/bot.module'
import { ApiModule } from './modules/api/api.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BotModule,
    ApiModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
