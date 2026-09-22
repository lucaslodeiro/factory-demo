import {test as base, expect, chromium} from '@playwright/test';
export {expect};
export {origin} from '../../playwright.config';
export const test = base.extend<{}, {browser: import('@playwright/test').Browser}>({
 browser: [async ({}, use) => {
  const endpoint = process.env.FACTORY_BROWSER_CDP_URL;
  const browser = endpoint ? await chromium.connectOverCDP(endpoint) : await chromium.launch();
  try { await use(browser); } finally { if (!endpoint) await browser.close(); }
 }, {scope: 'worker'}],
});
