import { Controller, Get, Param, Query } from '@nestjs/common';
import { BinanceService } from 'src/Models/Binance/binance.service';
import { CsgorollService } from 'src/Models/csgoroll/csgoroll.service';
import { AppService } from '../Models/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly binanceService: BinanceService,
    private readonly csgorollService: CsgorollService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/csgoroll/crash')
  GetCrashResult(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('greaterThan') greaterThan: string,
    @Query('lesserThan') lesserThan: string,
  ) {
    return this.csgorollService.getCsgoRollCrashHistory(
      parseFloat(parseFloat(greaterThan).toFixed(2)),
      parseFloat(parseFloat(lesserThan).toFixed(2)),
      parseInt(page.toString()),
      parseInt(limit.toString()),
    );
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
    @Query('asset') asset: string,
  ) {
    return this.binanceService.getBalanceHistory(
      filter,
      parseInt(page.toString()),
      parseInt(limit.toString()),
      asset,
    );
  }
}
