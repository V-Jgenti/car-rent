import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SeedsService],
})
export class SeedsModule {}
