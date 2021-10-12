import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DatabaseService } from '../database/database.service';
import { RentDto } from './dto/rent.dto';

@Injectable()
export class RentService {
  constructor(private readonly dbService: DatabaseService) {}
  //calc days difference
  daysDifference(start: Date, end: Date) {
    const startDate = dayjs(start, 'YYYY-MM-DD');
    const endDate = dayjs(end, 'YYYY-MM-DD');
    return endDate.diff(startDate, 'day');
  }
  //calculate discount
  discount(days: number, cost: number): number {
    let discount: number;
    if (days >= 15) {
      discount = 0.15;
    } else if (days >= 6) {
      discount = 0.1;
    } else if (days >= 3) {
      discount = 0.05;
    }
    return cost - cost * discount;
  }
  //create rent order record
  async create(rentData: RentDto): Promise<RentDto[]> {
    try {
      const keys = Object.keys(rentData);
      keys.forEach((prop) => {
        if (typeof rentData[prop] === 'string') {
          rentData[prop] = `${dayjs(rentData[prop]).format('YYYY-MM-DD')}`;
        }
      });
      const days: number = this.daysDifference(
        rentData.start_date,
        rentData.end_date,
      );
      if (days > 30) {
        throw {
          isMaximumRentErr: true,
          message: 'Maximum rent available for 30 days',
        };
      }
      const [tarif] = await this.dbService.executeQuery(
        `SELECT price_per_day, distance_per_day FROM "tarif" WHERE id=${rentData.tariff_id}`,
      );
      const cost: number = this.discount(days, tarif.price_per_day);
      const rent = await this.dbService.executeQuery(
        `INSERT INTO "rent" (car_id, tariff_id, start_date, end_date, cost) VALUES 
        (${rentData.car_id}, ${rentData.tariff_id}, '${rentData.start_date}', '${rentData.end_date}', ${cost})`,
      );
      return rent;
    } catch (error) {
      throw error;
    }
  }
}
