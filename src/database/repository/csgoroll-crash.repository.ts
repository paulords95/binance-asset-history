import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

@Injectable()
export class CsgoRollCrashRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDataHistory(
    greaterThan: number,
    lesserThan: number,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.prisma.csgorollCrashHistory.findMany({
      skip: page,
      take: limit,
      where: {
        crashValue: {
          gte: greaterThan,
          lte: lesserThan,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async insertDataInput(data) {
    await this.prisma.csgorollCrashHistory.create({
      data,
    });
  }
}
