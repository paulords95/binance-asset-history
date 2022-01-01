import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Injectable()
export class BalanceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(filter) {
    return this.prisma.balancehistory.findMany({
      where: {
        storeFreq: filter,
      },
    });
  }

  async insertHistoryInput(data) {
    await this.prisma.balancehistory.create({
      data,
    });
  }
}
