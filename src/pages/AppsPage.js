const HelperClass = require('../utils/HelperClass'); 

class AppsPage {
    constructor(page) {
        this.page = page;
        this.videosContainer = page.locator('div[data-testid="list-item-app_list-1"] > div');
        this.helper = new HelperClass(page);
    }

    async navigateToVideoApps() {
        console.log('Navigating to Video Apps...');
        
        const navigationSequence = ['ArrowDown', 'ArrowDown', 'ArrowDown'];
        await this.helper.navigateSequence(navigationSequence);
    }

    async addFirstUnfavouriteApp(filteredTestIds) {
        let appFound = false;
        let addedTestId = null;

        while (!appFound) {
            const focusedElement = await this.videosContainer.locator('[data-focused="focused"]');
            const testId = await focusedElement.getAttribute('data-testid');

            if (testId && !filteredTestIds.includes(testId)) {
                console.log(`"${testId}" is not in favourites. Adding it...`);
                await focusedElement.press('Enter');
                appFound = true;
                addedTestId = testId; // Store the newly added app's testId
            } else {
                console.log(`"${testId}" is already in favourites. Moving to the next app...`);
                this.helper.pressKeyWithDelay('ArrowRight', 500);
            }
            await this.page.waitForTimeout(500);
        }

        return addedTestId; // Return the added app's testId
    }

    async confirmAppAdded() {
        console.log('Confirming app addition...');
        const navigationSequence = ['ArrowDown', 'ArrowRight', 'Enter'];
        await this.helper.navigateSequence(navigationSequence);
    }
}

module.exports = AppsPage;