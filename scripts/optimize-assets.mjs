import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('assets/source', { recursive: true });
await mkdir('assets/archive', { recursive: true });
const exists = async (path) => stat(path).then(() => true).catch(() => false);

// As fontes ficam fora de public para não duplicar recursos na distribuição.
if (!(await exists('assets/source/hero-cutout.png'))) await copyFile('public/photos/hero-cutout.png', 'assets/source/hero-cutout.png');
if (!(await exists('assets/source/buque-para-sogra.gif'))) await copyFile('public/media/buque-para-sogra.gif', 'assets/source/buque-para-sogra.gif');

await sharp('assets/source/hero-cutout.png').webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile('public/photos/hero-cutout.webp');
await sharp('assets/source/buque-para-sogra.gif', { animated: true }).webp({ quality: 84, effort: 6 }).toFile('public/media/buque-para-sogra.webp');

for (const name of await readdir('public/characters')) {
  if (!name.endsWith('.webp') || name.endsWith('-thumb.webp')) continue;
  await sharp(`public/characters/${name}`).resize({ width: 240, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/characters/${name.replace('.webp', '-thumb.webp')}`);
}

const originalAnimation = await sharp('assets/source/buque-para-sogra.gif', { animated: true }).metadata();
const animation = await sharp('public/media/buque-para-sogra.webp', { animated: true }).metadata();
const duration = (metadata) => metadata.delay.reduce((sum, delay) => sum + delay, 0);
// O encoder pode unir quadros idênticos; duração e repetição precisam permanecer.
if (duration(originalAnimation) !== duration(animation) || originalAnimation.loop !== animation.loop || originalAnimation.width !== animation.width || originalAnimation.pageHeight !== animation.pageHeight) throw new Error('A animação mudou de duração ou dimensões.');
if (!(await sharp('public/photos/hero-cutout.webp').metadata()).hasAlpha) throw new Error('O recorte precisa manter a transparência.');

const compare = async (source, optimized) => ({ source, optimized, before: (await stat(source)).size, after: (await stat(optimized)).size });
const report = {
  hero: await compare('assets/source/hero-cutout.png', 'public/photos/hero-cutout.webp'),
  bouquet: { ...await compare('assets/source/buque-para-sogra.gif', 'public/media/buque-para-sogra.webp'), originalFrames: originalAnimation.pages, frames: animation.pages, durationMs: duration(animation) },
};
await writeFile('assets/optimization-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
