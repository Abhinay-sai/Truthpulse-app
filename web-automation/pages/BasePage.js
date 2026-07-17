const fs = require('fs');
const path = require('path');
const { until } = require('selenium-webdriver');

class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.baseUrl = process.env.BASE_URL || 'https://localhost/';
    }

    async navigateTo(path = '') {
        const fullUrl = new URL(path, this.baseUrl).toString();
        await this.driver.get(fullUrl);
    }

    async takeScreenshot(filename) {
        if (!this.driver) return;
        const image = await this.driver.takeScreenshot();
        const dir = path.join(__dirname, '..', 'Test Results', 'Screenshots');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, `${filename}.png`), image, 'base64');
    }
}

module.exports = BasePage;
