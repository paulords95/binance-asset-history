import { Injectable } from '@nestjs/common';
import { CsgoRollCrashRepository } from 'src/database/repository/csgoroll-crash.repository';

@Injectable()
export class CsgorollService {
  binance;
  count = 0;
  constructor(
    private readonly csgoRollCrashRepository: CsgoRollCrashRepository,
  ) {}

  async getCsgoRollCrashHistory(
    greaterThan: number,
    lesserThan: number,
    page: number,
    limit: number,
  ): Promise<Object> {
    const data = await this.csgoRollCrashRepository.getDataHistory(
      greaterThan,
      lesserThan,
      page,
      limit,
    );
    return data;
  }
}
