import { Injectable, OnModuleInit } from '@nestjs/common';
import { CsgoRollCrashService } from './csgoroll-crash.service';

@Injectable()
export class WorkerInitService implements OnModuleInit {
  constructor(private readonly csgorollcrashService: CsgoRollCrashService) {}

  onModuleInit() {
    console.log('>>> Starting workers...');
    this.csgorollcrashService.subscribe();
  }
}
