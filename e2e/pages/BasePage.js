const { By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async navigate(url) {
        await this.driver.get(url);
    }

    async findElement(locator, timeout = 10000) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    async click(locator, timeout = 10000) {
        const element = await this.findElement(locator, timeout);
        await this.driver.wait(until.elementIsVisible(element), timeout);
        await element.click();
    }

    async typeText(locator, text, timeout = 10000) {
        const element = await this.findElement(locator, timeout);
        await this.driver.wait(until.elementIsVisible(element), timeout);
        await element.sendKeys(text);
    }

    async getText(locator, timeout = 10000) {
        const element = await this.findElement(locator, timeout);
        await this.driver.wait(until.elementIsVisible(element), timeout);
        return await element.getText();
    }

    async takeScreenshot(filename) {
        const image = await this.driver.takeScreenshot();
        const dir = path.join(__dirname, '..', 'Test Results', 'screenshots');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, `${filename}.png`), image, 'base64');
    }
}

module.exports = BasePage;
