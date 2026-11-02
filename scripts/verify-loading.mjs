import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const url = process.env.TEST_URL || 'http://localhost:4173';
try {
  const first = await browser.newPage({ reducedMotion: 'reduce' });
  await first.route('**/characters/**', (route) => route.abort());
  await first.goto(url);
  await first.getByRole('button', { name: 'Mais de 99999', exact: true }).click();
  await first.locator('.hero').waitFor();
  await first.close();

  const retry = await browser.newPage({ reducedMotion: 'reduce' });
  let failHero = true;
  await retry.route('**/hero-cutout.webp', (route) => failHero ? route.fulfill({ status: 404, body: '' }) : route.continue());
  await retry.goto(url);
  await retry.getByRole('button', { name: 'Mais de 99999', exact: true }).click();
  await retry.getByRole('button', { name: /Tentar carregar novamente/ }).waitFor();
  assert.equal(await retry.locator('.hero').count(), 0);
  failHero = false;
  await retry.getByRole('button', { name: /Tentar carregar novamente/ }).click();
  await retry.locator('.hero').waitFor();
  await retry.close();
  console.log('OK: imagens das seções seguintes não bloqueiam a entrada; erro no retrato oferece uma nova tentativa funcional.');
} finally {
  await browser.close();
}
