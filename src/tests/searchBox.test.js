const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchPage = require('../pages/SearchPage');

test('Verify Search Box functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    // Step 1: Navigate to the home page
    await homePage.navigateToHomePage();

    // Step 2: Navigate to the Search Box
    await homePage.navigateToSearchBox();

    // Step 3: Navigate to the first category
    await searchPage.navigateToFirstCategory();

    // Step 4: Get the focused category name
    const categoryName = await searchPage.getFocusedCategoryName();

    // Step 5: Enter the category and verify the Search Box value
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await searchPage.verifySearchBoxValue(categoryName);
});
