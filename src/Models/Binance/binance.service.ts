import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BalanceHistoryRepository } from 'src/database/repository/balancehistory.repository';
const Binance = require('node-binance-api');

@Injectable()
export class BinanceService {
  binance;

  constructor(
    private readonly balanceHistoryRepository: BalanceHistoryRepository,
  ) {
    this.binance = new Binance().options({
      APIKEY: process.env.BINANCE_API_KEY,
      APISECRET: process.env.BINANCE_SECRET_KEY,
    });
  }

  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called when the current second is 45');
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
          if (assetBalance.available > 0.00001) {
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

  async storeValuesInDb() {
    const data = {
      asset: 'LRC',
      balance: '1484.17752970',
      priceUSD: '2.11',
      priceBRL: '11.86',
      balanceUSD: '3126.87',
      balanceBRL: '17607.38',
    };

    await this.balanceHistoryRepository.insertHistoryInput(data);
  }

  async getBalance(): Promise<Object> {
    await this.storeValuesInDb();
    return this.getAccountAvailableBalance();
  }
}
