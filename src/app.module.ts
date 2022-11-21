import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BotModule } from './modules/bot/bot.module'
import { BeastService } from './modules/database/beast.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BotModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
