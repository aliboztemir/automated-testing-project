const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchPage = require('../pages/SearchPage');
const HelperClass = require('../utils/HelperClass.js');

test('Verify Search Box functionality', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const helper = new HelperClass(page);

    // Step 1: Navigate to the home page
    await homePage.navigateToHomePage();
    await helper.takeScreenshot('homepage-loaded', testInfo);

    // Step 2: Navigate to the Search Box
    await homePage.navigateToSearchBox();
    await helper.takeScreenshot('navigate-tosearchbox', testInfo);

    // Step 3: Navigate to the first category
    await searchPage.navigateToFirstCategory();
    await helper.takeScreenshot('navigate-first-item', testInfo);

    // Step 4: Get the focused category name
    const categoryName = await searchPage.getFocusedCategoryName();

    // Step 5: Enter the category and verify the Search Box value
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await helper.takeScreenshot('searchbox-text', testInfo);
    await searchPage.verifySearchBoxValue(categoryName);
});
