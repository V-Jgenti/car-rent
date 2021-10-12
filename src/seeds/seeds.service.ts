import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as faker from 'faker';

@Injectable()
export class SeedsService implements OnModuleInit {
  constructor(private dbService: DatabaseService) {}

  async seed(): Promise<void> {
    const cars = await this.dbService.executeQuery(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='cars'`,
    );
    const rents = await this.dbService.executeQuery(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='rent'`,
    );
    const tarifs = await this.dbService.executeQuery(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='tarif'`,
    );

    const [car] = cars;

    if (!car) {
      await this.dbService.executeQuery(
        `CREATE TABLE "cars" (
        id SERIAL NOT NULL PRIMARY KEY,
        manufacturer VARCHAR(255),
        model VARCHAR(255),
        carnumber VARCHAR(255)
    )`,
      );
    } else {
      const model: string = faker.vehicle.model();
      const manufacturer: string = faker.vehicle.manufacturer();
      const carNumber = faker.vehicle.vin();
      console.log(typeof carNumber);
      const values = [`('${model}', '${manufacturer}', '${carNumber}')`];
      await this.dbService.executeQuery(`INSERT INTO 
      cars (manufacturer, model, carnumber) VALUES ${values}`);
    }

    const [tarif] = tarifs;

    if (!tarif) {
      await this.dbService.executeQuery(`CREATE TABLE "tarif" (
        id SERIAL NOT NULL PRIMARY KEY,
        price_per_day integer NOT NULL DEFAULT 1000,
        distance_per_day integer NOT NULL DEFAULT 500
        )`);
    } else {
      const values = [`(${1000}, ${500})`];
      await this.dbService.executeQuery(`INSERT INTO 
      tarif (price_per_day, distance_per_day) VALUES ${values}`);
    }

    const [rent] = rents;

    if (!rent) {
      await this.dbService.executeQuery(
        `CREATE TABLE "rent" (
    id SERIAL NOT NULL PRIMARY KEY,
    car_id integer not null references "cars" (id) ,
    tariff_id integer not null references "tarif" (id),
    start_date date NOT NULL,
    end_date date NOT NULL,
    cost money NOT NULL
  )`,
      );
    }
  }

  async onModuleInit(): Promise<void> {
    await this.seed();
  }
}
