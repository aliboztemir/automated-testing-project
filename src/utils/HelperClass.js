const fs = require('fs');
const path = require('path');

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

  async takeScreenshot(stepName, testInfo) {
    const screenshotsDir = path.join(__dirname, '../../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `${screenshotsDir}/${stepName}-${timestamp}.png`;
  
    // Ekran görüntüsünü kaydet
    await this.page.screenshot({ path: screenshotPath });
  
    // Playwright raporuna ekle
    await testInfo.attach(stepName, {
      path: screenshotPath,
      contentType: 'image/png',
    });
  }
}

module.exports = HelperClass;
