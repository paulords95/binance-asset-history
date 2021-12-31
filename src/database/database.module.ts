import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BalanceHistoryRepository } from './repository/balancehistory.repository';

@Module({
  providers: [PrismaService, BalanceHistoryRepository],
  exports: [BalanceHistoryRepository],
})
export class DatabaseModule {}
