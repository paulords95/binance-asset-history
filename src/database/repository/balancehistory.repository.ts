import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Injectable()
export class BalanceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(filter, page: number = 1, limit: number = 10) {
    return this.prisma.balancehistory.findMany({
      skip: page,
      take: limit,
      where: {
        storeFreq: filter,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async insertHistoryInput(data) {
    await this.prisma.balancehistory.create({
      data,
    });
  }
}
