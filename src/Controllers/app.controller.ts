import { Controller, Get } from '@nestjs/common';
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
    return this.binanceService.getBalance();
  }
}
