import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BalanceHistoryRepository } from './repository/balancehistory.repository';
import { CsgoRollCrashRepository } from './repository/csgoroll-crash.repository';

@Module({
  providers: [PrismaService, BalanceHistoryRepository, CsgoRollCrashRepository],
  exports: [BalanceHistoryRepository, CsgoRollCrashRepository],
})
export class DatabaseModule {}
