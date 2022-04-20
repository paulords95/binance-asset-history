import { Module } from '@nestjs/common';
import { AppController } from './Controllers/app.controller';
import { AppService } from './Models/app.service';
import { BinanceService } from './Models/Binance/binance.service';
import { ConfigModule } from '@nestjs/config';
import { BalanceHistoryRepository } from './database/repository/balancehistory.repository';
import { PrismaService } from './database/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerModule } from './worker/worker.module';
import { WorkerInitService } from './worker/worker-init.service';
import { CsgoRollCrashService } from './worker/csgoroll-crash.service';
import { CsgoRollCrashRepository } from './database/repository/csgoroll-crash.repository';
import { CsgorollService } from './Models/csgoroll/csgoroll.service';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    BinanceService,
    BalanceHistoryRepository,
    PrismaService,
    WorkerModule,
    WorkerInitService,
    CsgoRollCrashService,
    CsgoRollCrashRepository,
    CsgorollService,
  ],
})
export class AppModule {}
