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

  formatUSDPrice(token) {}

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
            const pricesObjUSD = {};
            const pricesObjBRL = {};
            let dollarBRLPrice = 0 as number;

            for (const tick of Object.entries(ticker)) {
              if (tick[0].includes(name) && tick[0].includes('USD')) {
                pricesObjUSD[name] = tick[1];
              }

              if (tick[0].includes(name) && tick[0].includes('BRL')) {
                pricesObjBRL[name] = tick[1];
              }

              if (tick[0] === 'USDTBRL') {
                dollarBRLPrice = tick[1] as number;
              }
            }
            const assetObj = {
              asset: name,
              balance: assetBalance.available,
              priceUSD: parseFloat(pricesObjUSD[name]).toFixed(2).toString(),
              priceBRL: (pricesObjUSD[name] * dollarBRLPrice)
                .toFixed(2)
                .toString(),
              balanceUSD: (
                parseFloat(pricesObjUSD[name]) * assetBalance.available
              ).toFixed(2),
              balanceBRL: (
                pricesObjUSD[name] *
                dollarBRLPrice *
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
    const totalBalance = {
      USD: 0,
      BRL: 0,
    };

    for (const value of values as any) {
      totalBalance.USD = totalBalance.USD + parseFloat(value.balanceUSD);
      totalBalance.BRL = totalBalance.BRL + parseFloat(value.balanceBRL);
    }

    for (const value of values as any) {
      value.storeFreq = freq;
      value.totalBalanceUSD = totalBalance.USD.toFixed(2);
      value.totalBalanceBRL = totalBalance.BRL.toFixed(2);
      await this.balanceHistoryRepository.insertHistoryInput(value);
    }
  }

  async getBalanceBianance(): Promise<Object> {
    return this.getAccountAvailableBalance();
  }

  async getBalanceHistory(
    filter: string,
    page: number,
    limit: number,
    asset?: string,
  ): Promise<Object> {
    const data = await this.balanceHistoryRepository.getBalance(
      filter,
      page,
      limit,
      asset,
    );
    let formatedObj;

    formatedObj = data;
    for (const item of formatedObj) {
      item.localDate = item.data.toLocaleDateString();
      item.localHour = item.data.toLocaleTimeString();
    }
    return formatedObj;
  }
}
