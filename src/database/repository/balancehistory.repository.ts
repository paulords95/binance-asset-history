import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Injectable()
export class BalanceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance() {
    return this.prisma.balancehistory.findMany();
  }

  async insertHistoryInput(data) {
    await this.prisma.balancehistory.create({
      data,
    });
  }
}
