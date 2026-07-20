const { expect } = require('chai');
const { initDriver, takeScreenshot, globalResults, ensureLoggedIn } = require('../conftest');
const { By, until } = require('selenium-webdriver');
const config = require('../config');

describe('Web Dashboard Navigation and Layout Suite', function () {
  let driver;
  const screen = 'Dashboard Screen';

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

  it('TC-DASH-01: Verify dashboard landing route', async function () {
    await recordResult('TC-DASH-01', 'Functional', 'Verify URL contains dashboard after successful login redirect', async () => {
      const url = await driver.getCurrentUrl();
      expect(url).to.contain('dashboard');
    });
  });

  it('TC-DASH-02: Verify header welcome message layout', async function () {
    await recordResult('TC-DASH-02', 'UI/UX', 'Verify welcome greeting title banner is visible', async () => {
      const greeting = await driver.findElement(By.xpath("//h1 | //h2[contains(text(), 'Hello') or contains(text(), 'Welcome')]"));
      const isVisible = await greeting.isDisplayed();
      expect(isVisible).to.be.true;
    });
  });

  it('TC-DASH-03: Verify quick actions container rendering', async function () {
    await recordResult('TC-DASH-03', 'UI/UX', 'Verify quick action options panel is displayed', async () => {
      const qaHeader = await driver.findElement(By.xpath("//*[contains(text(), 'Quick Actions')]"));
      expect(await qaHeader.isDisplayed()).to.be.true;
    });
  });

  it('TC-DASH-04: Verify dashboard weather/outfit recommendation card layout', async function () {
    await recordResult('TC-DASH-04', 'UI/UX', 'Verify daily stylist recommendation card loads', async () => {
      const recommendationCard = await driver.findElement(By.xpath("//*[contains(text(), 'Style Recommendation') or contains(text(), 'Outfit') or contains(@class, 'card')]"));
      expect(await recommendationCard.isDisplayed()).to.be.true;
    });
  });

  it('TC-DASH-05: Sidebar navigation panel layout check', async function () {
    await recordResult('TC-DASH-05', 'UI/UX', 'Verify sidebar navigation link items are visible', async () => {
      const sidebar = await driver.findElement(By.xpath("//nav | //aside"));
      expect(await sidebar.isDisplayed()).to.be.true;
      await takeScreenshot(driver, 'dashboard_layout');
    });
  });

  it('TC-DASH-06: Sidebar navigation - Chatbot tab navigation', async function () {
    await recordResult('TC-DASH-06', 'Functional', 'Verify clicking Chatbot sidebar item redirects user', async () => {
      const chatLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'chatbot') or contains(text(), 'Chat') or contains(text(), 'Stylist')]"));
      await chatLink.click();
      await driver.wait(until.urlContains('chatbot'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Style Chat');
    });
  });

  it('TC-DASH-07: Sidebar navigation - Profile tab navigation', async function () {
    await recordResult('TC-DASH-07', 'Functional', 'Verify clicking Profile sidebar item redirects user', async () => {
      const profileLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'profile') or contains(text(), 'Profile')]"));
      await profileLink.click();
      await driver.wait(until.urlContains('profile'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Profile');
    });
  });

  it('TC-DASH-08: Sidebar navigation - Analyze tab navigation', async function () {
    await recordResult('TC-DASH-08', 'Functional', 'Verify clicking Analyze sidebar item redirects user', async () => {
      const analyzeLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'analyze') or contains(text(), 'Analyze')]"));
      await analyzeLink.click();
      await driver.wait(until.urlContains('analyze'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Face Shape');
    });
  });

  it('TC-DASH-09: Sidebar navigation - History tab navigation', async function () {
    await recordResult('TC-DASH-09', 'Functional', 'Verify clicking History sidebar item redirects user', async () => {
      const historyLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'history') or contains(text(), 'History')]"));
      await historyLink.click();
      await driver.wait(until.urlContains('history'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('History');
    });
  });

  it('TC-DASH-10: Dashboard quick action navigation to chat', async function () {
    await recordResult('TC-DASH-10', 'Functional', 'Verify quick action cards on dashboard successfully navigate to chat', async () => {
      // First go back to dashboard
      const dashLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'dashboard') or contains(text(), 'Dashboard')]"));
      await dashLink.click();
      await driver.wait(until.urlContains('dashboard'), 5000);
      
      const qaChatTile = await driver.findElement(By.xpath("//*[contains(text(), 'Style Chat') or contains(text(), 'Chat with AI')]"));
      await qaChatTile.click();
      await driver.wait(until.urlContains('chatbot'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Style Chat');
      await takeScreenshot(driver, 'dashboard_quick_action_nav');
    });
  });
});
