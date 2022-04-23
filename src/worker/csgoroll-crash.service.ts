import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CsgoRollCrashRepository } from 'src/database/repository/csgoroll-crash.repository';

puppeteer.use(StealthPlugin());

declare global {
  interface Window {
    puppeteerMutationListener?: any;
  }
}

@Injectable()
export class CsgoRollCrashService {
  constructor(
    private readonly csgoRollCrashRepository: CsgoRollCrashRepository,
  ) {}

  async subscribe() {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
      ],
    });

    const page = await browser.newPage();

    await page.goto('https://www.csgoroll.com/en/crash', {
      waitUntil: 'networkidle2',
    });

    let prevValue = '';

    setInterval(async () => {
      const newVal = await page.evaluate(async () => {
        const el = document.querySelector('.games > div > span');
        return el.textContent;
      });

      if (prevValue !== newVal) {
        prevValue = newVal;

        const crashObj = {
          crashValue: parseFloat(parseFloat(newVal).toFixed(2)),
        };

        this.csgoRollCrashRepository.insertDataInput(crashObj);
      }
    }, 5000);
  }
}
