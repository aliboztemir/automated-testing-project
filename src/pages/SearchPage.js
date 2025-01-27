const HelperClass = require('../utils/HelperClass'); 

class SearchPage {
    constructor(page) {
        this.page = page;
        this.searchBox = page.locator('input[data-testid="search-input"]');
        this.focusedCategory = page.locator('[id^="focusable-movie-"][data-focused="focused"]');
        this.helper = new HelperClass(page);
    }

    async navigateToFirstCategory() {
        console.log('Navigating to the first category...');
        await this.helper.pressKeyWithDelay('ArrowDown');
    }

    async getFocusedCategoryName() {
        const categoryName = await this.focusedCategory.locator('.sc-giBObj.frVBcC').textContent();
        console.log(`Focused category name: ${categoryName.trim()}`);
        return categoryName.trim();
    }

    async verifySearchBoxValue(expectedValue) {
        const searchBoxValue = await this.searchBox.inputValue();
        if (searchBoxValue !== expectedValue) {
            throw new Error(`Search Box value "${searchBoxValue}" does not match expected "${expectedValue}".`);
        }
        console.log(`Search Box value verified: ${searchBoxValue}`);
    }
}

module.exports = SearchPage;
