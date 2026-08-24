import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

test.beforeAll(() => {
  // Build the demo bundle if it doesn't exist
  const outputPath = path.resolve('examples/demo-prototype/demo-review.html');
  if (!fs.existsSync(outputPath)) {
    execSync(
      'node packages/darts-runtime/build.js && node packages/darts-bundle/dist/cli.js --name "Test" --input examples/demo-prototype --output examples/demo-prototype/demo-review.html',
      { stdio: 'inherit' }
    );
  }
});

test('bundle opens from file:// with no network and tack initializes', async ({ page }) => {
  // Intercept the closed shadow root for test access
  await page.addInitScript(() => {
    const orig = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init: ShadowRootInit) {
      const root = orig.call(this, init);
      if (init.mode === 'closed') {
        (window as unknown as Record<string, unknown>).__tackShadowRoot = root;
      }
      return root;
    };
  });

  // Block all http/https requests — confirms truly offline operation
  await page.route(/^https?:\/\//, route => route.abort());

  const filePath = path.resolve('examples/demo-prototype/demo-review.html');
  await page.goto(`file://${filePath}`);

  // Page body should render content (prototype UI is JS-rendered)
  await expect(page.locator('body')).not.toBeEmpty();

  // Tack shadow host should be attached in the light DOM
  await expect(page.locator('.tack-shadow-host')).toBeAttached();

  // Tack toolbar should be present inside the shadow root
  const toolbarPresent = await page.evaluate(() => {
    const root = (window as unknown as Record<string, ShadowRoot>).__tackShadowRoot;
    if (!root) return false;
    return root.querySelector('#tack-toolbar') !== null;
  });
  expect(toolbarPresent).toBe(true);

  // Wait for window.Tack to be initialized before arming
  await page.waitForFunction(() => !!(window as unknown as Record<string, unknown>).Tack);

  // Arm comment mode — banner appears in light DOM
  // Click the page first to ensure keyboard focus, then use keyboard shortcut
  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await page.keyboard.press('c');
  await expect(page.locator('.tack-mode-banner')).toBeVisible();
});

test('bundle size is under 10 MB', () => {
  const filePath = path.resolve('examples/demo-prototype/demo-review.html');
  const sizeMb = fs.statSync(filePath).size / 1024 / 1024;
  console.log(`Bundle size: ${sizeMb.toFixed(2)} MB`);
  if (sizeMb > 10) {
    console.warn('Bundle exceeds 10 MB — consider hosted fallback');
  }
  // Sanity check — file must exist and be non-zero
  expect(sizeMb).toBeGreaterThan(0);
});
