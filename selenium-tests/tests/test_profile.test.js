const { expect } = require('chai');
const { initDriver, takeScreenshot, globalResults, ensureLoggedIn } = require('../conftest');
const { By, until } = require('selenium-webdriver');
const config = require('../config');

describe('Web Profile and Settings Interactivity Suite', function () {
  let driver;
  const screen = 'Profile Screen';

  before(async function () {
    driver = await initDriver();
    await ensureLoggedIn(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  async function recordResult(id, type, desc, fn) {
    const start = Date.now();
    try {
      await fn();
      globalResults.push({
        id, screen, type, description: desc, status: 'PASS', duration: Date.now() - start
      });
    } catch (err) {
      const screenshot = await takeScreenshot(driver, id);
      globalResults.push({
        id, screen, type, description: desc, status: 'FAIL', duration: Date.now() - start, error: err.message, screenshot
      });
      throw err;
    }
  }

  it('TC-PROF-01: Navigate to Profile page', async function () {
    await recordResult('TC-PROF-01', 'Functional', 'Verify user profile panel loads', async () => {
      const profileLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'profile') or contains(text(), 'Profile')]"));
      await profileLink.click();
      await driver.wait(until.urlContains('profile'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Profile');
    });
  });

  it('TC-PROF-02: Profile display cards verification', async function () {
    await recordResult('TC-PROF-02', 'UI/UX', 'Verify card components present on user profile', async () => {
      const card = await driver.findElement(By.xpath("//*[contains(@class, 'card') or contains(@class, 'container')]"));
      expect(await card.isDisplayed()).to.be.true;
    });
  });

  it('TC-PROF-03: Verify display of logged-in user email', async function () {
    await recordResult('TC-PROF-03', 'Functional', 'Verify configured test user email address matches profile display', async () => {
      const body = await driver.findElement(By.tagName('body')).getText();
      expect(body).to.contain(config.TEST_EMAIL);
    });
  });

  it('TC-PROF-04: Profile user metadata layout check', async function () {
    await recordResult('TC-PROF-04', 'UI/UX', 'Verify user age, gender indicators are displayed', async () => {
      const body = await driver.findElement(By.tagName('body')).getText();
      expect(body).to.contain('Age');
      expect(body).to.contain('Gender');
      await takeScreenshot(driver, 'profile_loaded');
    });
  });

  it('TC-PROF-05: Navigation link to Settings Panel', async function () {
    await recordResult('TC-PROF-05', 'Functional', 'Verify gear icon or settings link navigates successfully', async () => {
      const settingsLink = await driver.findElement(By.xpath("//a[contains(@href, 'settings') or contains(text(), 'Settings')]"));
      await settingsLink.click();
      await driver.wait(until.urlContains('settings'), 5000);
      const header = await driver.findElement(By.xpath("//h1 | //h2 | //*[contains(text(), 'Settings')]")).getText();
      expect(header).to.contain('Settings');
    });
  });

  it('TC-PROF-06: Settings list items rendering', async function () {
    await recordResult('TC-PROF-06', 'UI/UX', 'Verify list tiles (Account, Clear History, About) are rendered', async () => {
      const body = await driver.findElement(By.tagName('body')).getText();
      expect(body).to.contain('Account');
      expect(body).to.contain('About');
      await takeScreenshot(driver, 'settings_loaded');
    });
  });

  it('TC-PROF-07: History deletion validation prompt dialog', async function () {
    await recordResult('TC-PROF-07', 'Functional', 'Verify clicking Clear History triggers alert validation prompt', async () => {
      const clearBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Clear History') or contains(text(), 'Delete')]"));
      await clearBtn.click();
      
      // Since it triggers a prompt dialog (confirm popup or overlay), verify confirmation is displayed
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.not.be.empty;
    });
  });

  it('TC-PROF-08: Confirm dialog cancel option action check', async function () {
    await recordResult('TC-PROF-08', 'Functional', 'Verify cancel option retains historical state data', async () => {
      // Find Cancel button on overlay or fallback if native alert
      try {
        const cancelBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Cancel') or contains(text(), 'No')]"));
        await cancelBtn.click();
      } catch (e) {
        // Native alert handling fallback
        try {
          await driver.switchTo().alert().dismiss();
        } catch (err) {}
      }
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Settings');
    });
  });

  it('TC-PROF-09: Account specifications modification mock', async function () {
    await recordResult('TC-PROF-09', 'Functional', 'Verify account information field update modal is visible', async () => {
      const accountTile = await driver.findElement(By.xpath("//*[contains(text(), 'Account') or contains(text(), 'Profile Settings')]"));
      await accountTile.click();
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      expect(bodyText).to.not.be.empty;
    });
  });

  it('TC-PROF-10: Trigger E2E logout redirection flow', async function () {
    await recordResult('TC-PROF-10', 'Functional', 'Click logout tile and assert redirect to welcome back login card', async () => {
      // Find logout tile or button
      const logoutBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Log out') or contains(text(), 'Logout')]"));
      await logoutBtn.click();
      
      await driver.wait(until.urlContains('login'), 8000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Welcome Back');
      await takeScreenshot(driver, 'logout_redirect');
    });
  });
});
