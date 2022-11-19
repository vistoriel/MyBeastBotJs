import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

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
        models: []
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
