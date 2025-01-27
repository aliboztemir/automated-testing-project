const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ChannelsPage = require('../pages/ChannelsPage');
const HelperClass = require('../utils/HelperClass.js');

test('Live stream metrics validation', async ({ page, context }, testInfo) => {
  const homePage = new HomePage(page);

  // 1. Navigate to the Titanos TV homepage
  await homePage.navigateToHomePage();

  // 2. Navigate to the Channels menu
  await homePage.navigateToChannelsMenu();

  // 3. Wait for the new tab to open
  console.log('Switching to the new tab...');
  const newPage = await context.waitForEvent('page');
  const channelsPage = new ChannelsPage(newPage);
  await channelsPage.waitForChannelsPageLoad();

  // 4. Validate live stream metrics
  await channelsPage.validateMetrics();

  // 5. Validate that the Current Time value increases over time
  await channelsPage.validateCurrentTime();

  console.log('All metrics validated successfully!');
});

test('Validate m3u8 streaming files count increases', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  const m3u8Requests = [];
  const monitoringDuration = 24000; // Total monitoring duration (ms)
  const checkInterval = 6000; // Check interval (ms)

  // Navigate to the live streaming "Channels" page
  await page.goto('https://dev01.titanos.tv/channels');
  await page.waitForLoadState('networkidle');
  await helper.takeScreenshot('channelspage-loaded', testInfo);

  // Listen for network requests containing '.m3u8'
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('.m3u8')) {
      const timestamp = Date.now();
      m3u8Requests.push({ url, timestamp });
      console.log(`m3u8 file detected: ${url} at ${timestamp}`);
    }
  });

  // Monitor network traffic and validate request count increases
  let previousCount = 0;
  const iterations = monitoringDuration / checkInterval;

  console.log(`Monitoring network traffic for ${monitoringDuration / 1000} seconds...`);
  for (let i = 0; i < iterations; i++) {
    await page.waitForTimeout(checkInterval);

    const currentCount = m3u8Requests.length;
    console.log(`Iteration ${i + 1}: Total m3u8 files = ${currentCount}`);

    // Validate request count increases
    expect(currentCount).toBeGreaterThan(previousCount);
    previousCount = currentCount;
  }

  console.log('m3u8 streaming files count increased as expected over time!');
});