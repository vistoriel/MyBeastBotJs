import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { BeastModel } from './models/beast.model';
import { BeastService } from './services/beast.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('BD_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        models: [BeastModel],
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([BeastModel]),
  ],
  controllers: [],
  providers: [BeastService],
  exports: [BeastService],
})
export class DatabaseModule {}
