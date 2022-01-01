import { Controller, Get, Param, Query } from '@nestjs/common';
import { BinanceService } from 'src/Models/Binance/binance.service';
import { AppService } from '../Models/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly binanceService: BinanceService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/binance')
  GetBalance() {
    return this.binanceService.getBalanceBianance();
  }
  @Get('/binance-history')
  GetBalanceHistory(
    @Query('filter') filter: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.binanceService.getBalanceHistory(
      filter,
      parseInt(page.toString()),
      parseInt(limit.toString()),
    );
  }
}
