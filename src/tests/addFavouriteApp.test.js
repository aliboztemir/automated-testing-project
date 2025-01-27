const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const AppsPage = require('../pages/AppsPage');
const HelperClass = require('../utils/HelperClass.js'); 

test.only('Navigate to Apps menu and add a favourite app', async ({ page }, testInfo) => {
  const homePage = new HomePage(page);
  const appsPage = new AppsPage(page);
  const helper = new HelperClass(page);

  // Step 1: Navigate to the home page
  await homePage.navigateToHomePage();
  await helper.takeScreenshot('homepage-loaded', testInfo);

  // Step 2: Retrieve current favourite apps
  const filteredTestIds = await homePage.getFavouriteAppsTestIds();
  console.log(`Current favourite apps: ${filteredTestIds}`);

  // Step 3: Navigate to the Apps menu
  await homePage.navigateToAppsMenu();
  await helper.takeScreenshot('navigate To Apps Menu', testInfo);

  // Step 4: Navigate to the Video Apps section
  await appsPage.navigateToVideoApps();

  // Step 5: Add the first app that is not already in favourites
  const newAppTestId = await appsPage.addFirstUnfavouriteApp(filteredTestIds);
  if (!newAppTestId) {
    console.log('No apps available to add to favourites.');
    return;
  }

  console.log(`New app added to favourites: ${newAppTestId}`);

  // Step 6: Confirm the app is added
  await appsPage.confirmAppAdded();
  await homePage.waitVisibleFavoriteApps();

  // Step 7: Verify the app is in the favourites list
  const newFilteredTestIds = await homePage.getFavouriteAppsTestIds();
  console.log(`Updated favourite apps: ${newFilteredTestIds}`);

  // Check that the new app is in the favourites list
  expect(newFilteredTestIds.length).toBeGreaterThan(filteredTestIds.length);
  expect(newFilteredTestIds).toContain(newAppTestId); // New assertion for the added app
});


