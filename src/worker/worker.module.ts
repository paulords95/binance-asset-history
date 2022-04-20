import { Module } from '@nestjs/common';
import { CsgoRollCrashRepository } from 'src/database/repository/csgoroll-crash.repository';
import { CsgoRollCrashService } from './csgoroll-crash.service';
import { WorkerInitService } from './worker-init.service';

@Module({
  imports: [CsgoRollCrashRepository],
  providers: [WorkerInitService, CsgoRollCrashService],
  exports: [CsgoRollCrashService, WorkerInitService],
})
export class WorkerModule {}
