import { Module } from '@nestjs/common';
import { SessionService } from './chat-session/session.service';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [SessionService],
  exports: [SessionService],
})
export class MiddlewaresModule {}
