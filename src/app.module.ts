import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { level, levels, format, transports } from './logger/index';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      level: level(),
      levels,
      format,
      transports,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
