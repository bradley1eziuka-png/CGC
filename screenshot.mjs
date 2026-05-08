import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir);

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Find next N
const existing = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.png')).length : 0;
const N = existing + 1;
const outPath = join(dir, `screenshot-${N}${label}.png`);

const CHROME = '/Users/bradleyeziuka/.cache/puppeteer/chrome/mac_arm-148.0.7778.97/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved: ${outPath}`);
