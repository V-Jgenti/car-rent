import {
  Body,
  Controller,
  Post,
  LoggerService,
  Inject,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RentService } from './rent.service';
import { RentDto } from './dto/rent.dto';

@Controller('rent')
export class RentController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly rentService: RentService,
  ) {}

  @Post()
  async createRent(@Body() createReservation: RentDto, @Res() res: any) {
    try {
      const rent = await this.rentService.create(createReservation);
      console.log(rent);
      res.status(HttpStatus.OK).send(rent);
    } catch (error) {
      this.logger.error('error occuired in createRent controller', error);
      if (error.isMaximumRentErr) {
        res.send(error.message);
      }
      res.send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
