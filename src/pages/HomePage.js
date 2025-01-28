const { expect } = require('@playwright/test');
const HelperClass = require('../utils/HelperClass');

class HomePage {
    constructor(page) {
        this.page = page;
        this.favouriteAppsContainer = page.locator('#favourite-apps');
        this.transitionDelay = 1000;
        this.helper = new HelperClass(page);
    }

    async navigateToHomePage() {
        await this.page.goto('https://dev01.titanos.tv');
        await this.page.waitForLoadState('networkidle');
    }

    async getFavouriteAppsTestIds() {
        // Retrieve the first-level divs in the favourite apps container
        const firstLevelDivs = await this.favouriteAppsContainer.locator('> div').all();
        const appTestIds = await Promise.all(
            firstLevelDivs.map(async (div) => await div.getAttribute('data-testid'))
        );
        return appTestIds.filter((testId) => testId !== null); // Filter out null test IDs
    }

    async navigateToAppsMenu() {
        console.log('Navigating to Apps menu...');
        const navigationSequence = ['ArrowUp', 'ArrowUp', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Enter'];
        await this.helper.navigateSequence(navigationSequence);
        await this.page.waitForSelector('[data-testid="mini-banner"]', { state: 'visible', timeout: 3000 });
        console.log('Apps page loaded..');
    }

    async waitVisibleFavoriteApps() {
        console.log('Waiting for Favourite Apps to be visible...');
        try {
            await this.page.waitForSelector('#favourite-apps', {
                state: 'visible',
                timeout: 3000,
            });
            console.log('Favourite Apps are visible.');
        } catch (error) {
            console.error('Favourite Apps did not become visible within the timeout.');
            throw error;
        }
    }

    async focusOnFirstFavouriteApp() {
        const focusedApp = await this.favouriteAppsContainer.locator('[data-focused="focused"]').first();
        const appTestId = await focusedApp.getAttribute('data-testid');
        console.log(`Focused on app: ${appTestId}`);
        return { app: focusedApp, testId: appTestId };
    }

    async longPressEnterOnApp(app) {
        console.log(`Long pressing Enter on '${await app.getAttribute('data-testid')}'...`);
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(2000); // Long press duration
        await this.page.keyboard.up('Enter');
    }

    async isDeleteButtonDisabled(app) {
        const deleteButton = app.locator('[data-testid="editmode-remove-app"]');
        const deleteButtonState = await deleteButton.getAttribute('data-focused');
        return deleteButtonState === 'disabled';
    }

    async deleteFocusedApp() {
        console.log('Navigating to the delete icon...');
        this.helper.pressKeyWithDelay('ArrowDown', 500);

        console.log('Confirming delete...');
        this.helper.pressKeyWithDelay('Enter', 2000);
    }

    async verifyAppDeleted(appTestId) {
        console.log(`Verifying app '${appTestId}' has been deleted...`);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
        await expect(this.favouriteAppsContainer.locator(`[data-testid="${appTestId}"]`))
            .toHaveCount(0, { timeout: 500 });
        console.log(`App '${appTestId}' has been successfully deleted.`);
    }

    async navigateToSearchBox() {
        console.log('Navigating to Search Box...');
        for (let i = 0; i < 2; i++) {
            await this.page.keyboard.press('ArrowUp');
            await this.page.waitForTimeout(this.transitionDelay);
        }
        await this.page.keyboard.press('ArrowLeft');
        await this.page.waitForTimeout(this.transitionDelay);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(this.transitionDelay);
        console.log('Search Box page loaded.');
    }

    async navigateToChannelsMenu() {
        console.log('Navigating to the Channels menu...');
        for (let i = 0; i < 2; i++) {
            await this.page.keyboard.press('ArrowUp');
            await this.page.waitForTimeout(1000); // Wait for transition animation
        }
        for (let i = 0; i < 2; i++) {
            await this.page.keyboard.press('ArrowRight');
            await this.page.waitForTimeout(1000); // Wait for transition animation
        }
        console.log('Channels menu is highlighted.');
        await this.page.keyboard.press('Enter');
    }
}

module.exports = HomePage;
