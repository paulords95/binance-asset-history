import { Module } from '@nestjs/common';
import { AppController } from './Controllers/app.controller';
import { AppService } from './Models/app.service';
import { BinanceService } from './Models/Binance/binance.service';
import { ConfigModule } from '@nestjs/config';
import { BalanceHistoryRepository } from './database/repository/balancehistory.repository';
import { PrismaService } from './database/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    BinanceService,
    BalanceHistoryRepository,
    PrismaService,
  ],
})
export class AppModule {}
