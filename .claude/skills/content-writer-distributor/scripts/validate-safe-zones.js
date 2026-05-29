#!/usr/bin/env node
/**
 * Instagram Safe Zone Validator
 *
 * Usage:
 *   node validate-safe-zones.js <file.html> <format>
 *   format = feed | reel | story
 *
 * Output:
 *   - <file>-annotated.png next to input (overlay of safe/unsafe bands + violations)
 *   - exit 0 if all text/CTA elements fit inside safe zone
 *   - exit 1 if any element's bounding box intersects an unsafe band
 *
 * Checked selectors (extend as needed): anything with text that is NOT purely decorative.
 */

const path = require('path');
const fs = require('fs');

// Resolve playwright from common install paths
function requirePlaywright() {
  const candidates = [
    path.join(__dirname, 'node_modules', 'playwright'),
    '/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Outreach/Instagram/carousels/feature-series/node_modules/playwright',
    '/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Outreach/LinkedIn/Images/generator/node_modules/playwright',
  ];
  for (const p of candidates) {
    try { return require(p); } catch (_) {}
  }
  try { return require('playwright'); } catch (_) {}
  throw new Error('playwright not found. Install: npm i playwright in this scripts/ folder.');
}

const FORMATS = {
  feed:  { w: 1080, h: 1350, top: 135, bottom: 135, left: 64,  right: 64  },
  reel:  { w: 1080, h: 1920, top: 269, bottom: 768, left: 64,  right: 64  },
  story: { w: 1080, h: 1920, top: 269, bottom: 384, left: 64,  right: 64  },
};

// CSS selectors considered "critical" — must live inside safe zone.
const CRITICAL_SELECTORS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  '.headline', '.hook-title', '.slide-title', '.slide-body',
  '.tag', '.stat-num', '.stat-label', '.body-text',
  '.brand', '.brand-tagline', '.brand-footer',
  '.pill', '.cta', '.button', '.slide-counter',
  '.big-quote', '.point', '.source',
];

async function main() {
  const [, , htmlPath, formatArg] = process.argv;
  if (!htmlPath || !formatArg) {
    console.error('Usage: validate-safe-zones.js <file.html> <feed|reel|story>');
    process.exit(2);
  }
  const fmt = FORMATS[formatArg];
  if (!fmt) {
    console.error(`Unknown format: ${formatArg}. Use feed | reel | story.`);
    process.exit(2);
  }
  const absHtml = path.resolve(htmlPath);
  if (!fs.existsSync(absHtml)) {
    console.error(`File not found: ${absHtml}`);
    process.exit(2);
  }

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: fmt.w, height: fmt.h },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('file://' + absHtml, { waitUntil: 'networkidle' });

  const safe = {
    x1: fmt.left,
    y1: fmt.top,
    x2: fmt.w - fmt.right,
    y2: fmt.h - fmt.bottom,
  };

  // Collect bounding boxes for critical elements
  const violations = await page.evaluate(
    ({ selectors, safe }) => {
      const hits = [];
      const sel = selectors.join(',');
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const outside =
          r.left < safe.x1 || r.top < safe.y1 ||
          r.right > safe.x2 || r.bottom > safe.y2;
        if (outside) {
          hits.push({
            tag: el.tagName.toLowerCase(),
            cls: el.className || '',
            text: (el.innerText || '').slice(0, 60).replace(/\s+/g, ' '),
            box: { x: r.left, y: r.top, w: r.width, h: r.height },
          });
        }
      });
      return hits;
    },
    { selectors: CRITICAL_SELECTORS, safe }
  );

  // Inject annotation overlay and screenshot
  await page.evaluate(
    ({ fmt, safe, violations }) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; pointer-events: none; z-index: 999999;
      `;
      // Keep-out (unsafe) bands: shaded area, no text label
      const bands = [
        { t: 0, l: 0, w: fmt.w, h: fmt.top },
        { t: fmt.h - fmt.bottom, l: 0, w: fmt.w, h: fmt.bottom },
        { t: fmt.top, l: 0, w: fmt.left, h: fmt.h - fmt.top - fmt.bottom },
        { t: fmt.top, l: fmt.w - fmt.right, w: fmt.right, h: fmt.h - fmt.top - fmt.bottom },
      ];
      bands.forEach(b => {
        const d = document.createElement('div');
        d.style.cssText = `
          position: absolute; left:${b.l}px; top:${b.t}px;
          width:${b.w}px; height:${b.h}px;
          background: rgba(255,0,0,0.22);
          border: 2px dashed rgba(255,0,0,0.9);
        `;
        overlay.appendChild(d);
      });
      // Safe zone outline: green
      const sbox = document.createElement('div');
      sbox.style.cssText = `
        position: absolute; left:${safe.x1}px; top:${safe.y1}px;
        width:${safe.x2 - safe.x1}px; height:${safe.y2 - safe.y1}px;
        border: 3px solid rgba(0,220,80,0.95);
        box-shadow: 0 0 0 9999px rgba(0,0,0,0) inset;
      `;
      overlay.appendChild(sbox);
      // Mark each violation
      violations.forEach(v => {
        const d = document.createElement('div');
        d.style.cssText = `
          position: absolute; left:${v.box.x}px; top:${v.box.y}px;
          width:${v.box.w}px; height:${v.box.h}px;
          outline: 4px solid #ff2b2b; background: rgba(255,43,43,0.18);
        `;
        overlay.appendChild(d);
      });
      document.body.appendChild(overlay);
    },
    { fmt, safe, violations }
  );

  const outPath = absHtml.replace(/\.html?$/i, '') + `-safezone-${formatArg}.png`;
  await page.screenshot({ path: outPath, fullPage: false });

  await browser.close();

  console.log(`\nSafe-zone check: ${formatArg} (${fmt.w}x${fmt.h})`);
  console.log(`Safe box: x=${safe.x1}-${safe.x2}, y=${safe.y1}-${safe.y2}`);
  console.log(`Annotated: ${outPath}`);

  if (violations.length === 0) {
    console.log(`PASS — all ${CRITICAL_SELECTORS.length} critical selectors fit inside safe zone.`);
    process.exit(0);
  } else {
    console.log(`FAIL — ${violations.length} element(s) cross unsafe bands:`);
    violations.forEach(v => {
      console.log(`  - <${v.tag}${v.cls ? ' class="' + v.cls + '"' : ''}>  box=(${Math.round(v.box.x)},${Math.round(v.box.y)} ${Math.round(v.box.w)}x${Math.round(v.box.h)})  "${v.text}"`);
    });
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(3); });
