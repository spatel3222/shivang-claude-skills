#!/usr/bin/env node
/**
 * Render an HTML file to a PNG at Instagram dimensions.
 * Usage: node render-ig.js <file.html> <feed|reel|story>
 */
const path = require('path');
const fs = require('fs');

function requirePlaywright() {
  const candidates = [
    path.join(__dirname, 'node_modules', 'playwright'),
    '/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Outreach/Instagram/carousels/feature-series/node_modules/playwright',
    '/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Outreach/LinkedIn/Images/generator/node_modules/playwright',
  ];
  for (const p of candidates) { try { return require(p); } catch (_) {} }
  return require('playwright');
}

const DIMS = {
  feed:  { w: 1080, h: 1350 },
  reel:  { w: 1080, h: 1920 },
  story: { w: 1080, h: 1920 },
};

(async () => {
  const [, , htmlPath, fmt = 'feed'] = process.argv;
  if (!htmlPath) { console.error('Usage: render-ig.js <file.html> <feed|reel|story>'); process.exit(2); }
  const d = DIMS[fmt]; if (!d) { console.error('Bad format'); process.exit(2); }
  const abs = path.resolve(htmlPath);
  const out = abs.replace(/\.html?$/i, '') + '.png';
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: d.w, height: d.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + abs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out, type: 'png', fullPage: false });
  await browser.close();
  console.log('rendered ->', out);
})();
