import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

interface WhereType {
  storeFreq: string;
  asset?: string;
}

@Injectable()
export class BalanceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(
    filter,
    page: number = 1,
    limit: number = 10,
    asset?: string,
  ) {
    const whereParams: WhereType = {
      storeFreq: filter,
    };

    if (asset) {
      whereParams.asset = asset as any;
    }

    return this.prisma.balancehistory.findMany({
      skip: page,
      take: limit,
      where: whereParams,
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
