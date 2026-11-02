import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const label = process.argv[2] || 'current';
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error('Use um nome simples para o relatório.');
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const resources = () => page.evaluate(() => performance.getEntriesByType('resource').map((entry) => ({ name: new URL(entry.name).pathname, bytes: entry.transferSize, decoded: entry.decodedBodySize })));
  const summarize = (items) => ({ requests: items.length, bytes: items.reduce((sum, entry) => sum + entry.bytes, 0) });
  await page.goto(process.env.TEST_URL || 'http://localhost:4173');
  await page.getByRole('button', { name: 'Mais de 99999', exact: true }).waitFor();
  await page.waitForTimeout(500);
  const quiz = await resources();
  await page.getByRole('button', { name: 'Mais de 99999', exact: true }).click();
  await page.locator('.hero').waitFor();
  await page.waitForTimeout(3500);
  const hero = await resources();
  const report = { quiz: summarize(quiz), hero: summarize(hero), resources: hero };
  await writeFile(`test-results/performance-${label}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ label, quiz: report.quiz, hero: report.hero }, null, 2));
} finally {
  await browser.close();
}
