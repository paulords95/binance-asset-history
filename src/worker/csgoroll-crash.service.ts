import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CsgoRollCrashRepository } from 'src/database/repository/csgoroll-crash.repository';

puppeteer.use(StealthPlugin());

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
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });

    const page = await browser.newPage();

    await page.goto('https://www.csgoroll.com/en/crash', {
      waitUntil: 'networkidle2',
    });

    async function monitor(selector, callback, prevValue) {
      const newVal = await page.evaluate(async () => {
        const el = document.querySelector('.games > div > span');
        return el.textContent;
      });
      if (newVal !== prevValue) {
        callback(newVal);
      }
      await new Promise((_) => setTimeout(_, 1000));
      monitor(selector, callback, newVal);
    }

    monitor(
      '.games > div > span',
      (value) => {
        const crashObj = {
          crashValue: parseFloat(parseFloat(value).toFixed(2)),
        };
        this.csgoRollCrashRepository.insertDataInput(crashObj);
      },
      '',
    );
  }
}
