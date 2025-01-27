
# Automated Testing Project

This project contains automated tests for the Titanos TV application. The tests ensure the functionalities of the application, such as navigation, live stream metrics validation, and streaming file monitoring, are working as expected. The project uses **Playwright** as the main testing framework and provides reports using Playwright's built-in HTML reporter and optionally Allure.

---

## Project Folder Structure

The folder structure for the project is as follows:

```
automated-testing-project

├── allure-report
├── allure-results
├── playwright-report
│   └── index.html
├── src
│   ├── pages
│   │   ├── AppsPage.js
│   │   ├── ChannelsPage.js
│   │   ├── HomePage.js
│   │   └── SearchPage.js
│   ├── tests
│   │   ├── addFavouriteApp.test.js
│   │   ├── deleteFavouriteApp.test.js
│   │   ├── liveStreamValidation.test.js
│   │   └── searchBox.test.js
│   └── utils
│       └── HelperClass.js
├── test-results
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

---

## Prerequisites

1. **Node.js** (v16 or later): Ensure Node.js is installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
2. **Playwright**: Installed automatically with project dependencies.
3. **Allure Commandline** (optional for advanced reporting): If needed, refer to [Allure CLI Installation](https://docs.qameta.io/allure/).

---

## Installation

1. Navigate to the project directory where the code is located.
2. Install the dependencies by running:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

---

## Running Tests

### Run All Tests
To execute all tests in the project:
```bash
npx playwright test
```

### Run a Specific Test
To run a particular test file:
```bash
npx playwright test tests/<test-file>.spec.js
```

### Adjust Test Timeout
You can increase the default timeout for tests by updating the timeout property in the `playwright.config.js` file:
```javascript
use: {
  timeout: 60000, // Set timeout to 60 seconds
},
```

---

## Viewing Reports

### Playwright HTML Report
Playwright generates an HTML report by default. After running the tests, view the report using:
```bash
npx playwright show-report
```

### Allure Report (Optional)

1. Install Allure CLI if you haven't already:
   ```bash
   npm install -g allure-commandline --save-dev
   ```
2. Configure Allure as an additional reporter in `playwright.config.js`:
   ```javascript
   reporter: [['html'], ['allure-playwright']],
   ```
3. Generate the report:
   ```bash
   allure generate allure-results --clean
   ```
4. Open the report:
   ```bash
   allure open
   ```

---

## Test Scenarios

### 1. Live Stream Metrics Validation
Validates metrics such as resolution, bandwidth, buffering time, and playback status. Verifies Current time is increasing to ensure the live stream is progressing.

#### Steps:
1. Navigate to the Titanos TV home page.
2. Access the Channels menu and open it in a new tab.
3. Validate metrics:
   - **Resolution**: Matches the expected resolution.
   - **Bandwidth**: Values meet the required thresholds.
   - **Buffering Time**: Minimal buffering is confirmed.
   - **Current Time**: Progression is verified to ensure live playback.

### 2. m3u8 File Monitoring
Monitors `.m3u8` streaming files during the live stream. Ensures the number of files increases consistently over time.

#### Steps:
1. Navigate to the Channels menu.
2. Monitor the network traffic for `.m3u8` files.
3. Validate:
   - `.m3u8` file requests are detected consistently.
   - The count of files increases at regular intervals.

### 3. Add Favourite App
Adds a new app to the favourites list if it's not already included.

#### Steps:
1. Navigate to the Titanos TV home page.
2. Open the Apps menu and go to the Video Apps section.
3. Add the first unfavourite app to the favourites list.
4. Verify that the app has been added.

### 4. Delete Favourite App
Removes an app from the favourites list while ensuring specific apps cannot be deleted.

#### Steps:
1. Navigate to the Titanos TV home page.
2. Focus on the first app and verify it cannot be deleted (e.g., "Watch TV").
3. Navigate to another app in the favourites list and delete it.
4. Verify that the app is successfully removed.

### 5. Search Box Validation
Validates the functionality of the search box by ensuring that selected category names are populated correctly.

#### Steps:
1. Navigate to the Titanos TV home page.
2. Access the Search Box menu.
3. Select a category and open it.
4. Verify that the search box is populated with the selected category's name.

---

## Utilities and Helpers

The project includes a `HelperClass` to simplify repetitive actions such as navigating menus using keyboard actions. This ensures cleaner and more maintainable test scripts.

#### Example:
```javascript
class HelperClass {
  constructor(page) {
    this.page = page;
  }

  async pressKeyWithDelay(key, delay = 500) {
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(delay);
  }

  async navigateSequence(sequence, delay = 500) {
    for (const key of sequence) {
      await this.pressKeyWithDelay(key, delay);
    }
  }
}

module.exports = HelperClass;
```

---

## Configuration Details

### Playwright Configuration (`playwright.config.js`)

Key settings:
- **Headless Mode**: Disabled for debugging.
- **Retry Logic**: Retries tests twice if they fail in CI environments.
- **HTML Report**: Default reporting tool enabled.

#### Example Configuration:
```javascript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['allure-playwright']],
  use: {
    headless: false,
    trace: 'on-first-retry',
  },
});
```

---

## Notes

- Ensure your system meets the prerequisites for smooth execution.
- All tests are run locally, and results are stored in the `test-results` directory.
- For further customization or issues, refer to the Playwright documentation: [Playwright Docs](https://playwright.dev/).
