import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BalanceHistoryRepository } from 'src/database/repository/balancehistory.repository';
const Binance = require('node-binance-api');

@Injectable()
export class BinanceService {
  binance;
  count = 0;
  constructor(
    private readonly balanceHistoryRepository: BalanceHistoryRepository,
  ) {
    this.binance = new Binance().options({
      APIKEY: process.env.BINANCE_API_KEY,
      APISECRET: process.env.BINANCE_SECRET_KEY,
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronMinute() {
    await this.storeValuesInDb('EVERY_MINUTE');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron5Minutes() {
    await this.storeValuesInDb('EVERY_5_MINUTES');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCronHour() {
    await this.storeValuesInDb('EVERY_HOUR');
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCronDay() {
    await this.storeValuesInDb('EVERY_DAY_AT_NOON');
  }

  getAccountAvailableBalance() {
    const balanceAvailable = [];
    return new Promise(async (resolve, reject) => {
      const ticker = await this.binance.prices();
      await this.binance.useServerTime();
      await this.binance.balance((error, balances) => {
        if (error) return reject(error);
        for (const balance of Object.entries(balances)) {
          const name = balance[0] as string;
          const assetBalance = balance[1] as any;
          if (assetBalance.available > 0.0001) {
            const assetObj = {
              asset: name,
              balance: assetBalance.available,
              priceUSD: parseFloat(ticker.LRCUSDT).toFixed(2).toString(),
              priceBRL: (ticker.LRCUSDT * ticker.USDTBRL).toFixed(2).toString(),
              balanceUSD: (
                parseFloat(ticker.LRCUSDT) * assetBalance.available
              ).toFixed(2),
              balanceBRL: (
                ticker.LRCUSDT *
                ticker.USDTBRL *
                assetBalance.available
              ).toFixed(2),
            };

            balanceAvailable.push(assetObj);
          }
        }
        resolve(balanceAvailable);
      });
    });
  }

  async storeValuesInDb(freq) {
    const values = await this.getAccountAvailableBalance();

    for (const value of values as any) {
      value.storeFreq = freq;

      await this.balanceHistoryRepository.insertHistoryInput(value);
    }
  }

  async getBalanceBianance(): Promise<Object> {
    return this.getAccountAvailableBalance();
  }

  async getBalanceHistory(): Promise<Object> {
    return this.balanceHistoryRepository.getBalance();
  }
}
