const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');

test('Verify favorite apps can be deleted and Watch TV cannot be deleted', async ({ page }) => {
    const homePage = new HomePage(page);

    // Step 1: Navigate to home page
    await homePage.navigateToHomePage();

    // Step 2: Focus on the first favourite app
    const { app: firstApp, testId: firstAppTestId } = await homePage.focusOnFirstFavouriteApp();

    // Step 3: Try to delete the first app (expected to be "Watch TV")
    await homePage.longPressEnterOnApp(firstApp);

    // Step 4: Verify "Watch TV" cannot be deleted
    const isDeleteDisabled = await homePage.isDeleteButtonDisabled(firstApp);
    expect(isDeleteDisabled).toBeTruthy();
    console.log(`Verified that '${firstAppTestId}' (Watch TV) cannot be deleted.`);

    // Step 5: Focus on the second favourite app
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    const { app: secondApp, testId: secondAppTestId } = await homePage.focusOnFirstFavouriteApp();

    // Step 6: Delete the second app
    await homePage.longPressEnterOnApp(secondApp);
    await homePage.deleteFocusedApp();

    // Step 7: Verify the second app is deleted
    await homePage.verifyAppDeleted(secondAppTestId);
});
