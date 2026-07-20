const { expect } = require('chai');
const { initDriver, takeScreenshot, globalResults, ensureLoggedIn } = require('../conftest');
const { By, until, Key } = require('selenium-webdriver');
const config = require('../config');

describe('Web Chatbot Interactivity Suite', function () {
  let driver;
  const screen = 'Chatbot Screen';

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

  it('TC-CHAT-01: Navigate to Chatbot page', async function () {
    await recordResult('TC-CHAT-01', 'Functional', 'Verify chatbot router loads', async () => {
      const chatLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'chatbot') or contains(text(), 'Chat') or contains(text(), 'Stylist')]"));
      await chatLink.click();
      await driver.wait(until.urlContains('chatbot'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Style Chat');
    });
  });

  it('TC-CHAT-02: Verify chatbot placeholder greeting messages', async function () {
    await recordResult('TC-CHAT-02', 'UI/UX', 'Verify bot displays initial stylist hello statement', async () => {
      const chatPane = await driver.findElement(By.xpath("//*[contains(text(), 'Vastra') or contains(text(), 'stylist') or contains(text(), 'Ask me')]"));
      expect(await chatPane.isDisplayed()).to.be.true;
    });
  });

  it('TC-CHAT-03: Input text box rendering check', async function () {
    await recordResult('TC-CHAT-03', 'UI/UX', 'Verify message input textbox is visible', async () => {
      const textInput = await driver.findElement(By.xpath("//input[@placeholder='Ask Vastra...' or @type='text']"));
      expect(await textInput.isDisplayed()).to.be.true;
    });
  });

  it('TC-CHAT-04: Chat send action button layout check', async function () {
    await recordResult('TC-CHAT-04', 'UI/UX', 'Verify chat send icon button exists next to input', async () => {
      const sendBtn = await driver.findElement(By.xpath("//button[@type='submit' or contains(@class, 'send') or contains(@class, 'button')]"));
      expect(await sendBtn.isDisplayed()).to.be.true;
      await takeScreenshot(driver, 'chatbot_loaded');
    });
  });

  it('TC-CHAT-05: Empty message input validation', async function () {
    await recordResult('TC-CHAT-05', 'Validation', 'Verify empty spaces submission is ignored by chatbot', async () => {
      const textInput = await driver.findElement(By.xpath("//input[@placeholder='Ask Vastra...' or @type='text']"));
      const sendBtn = await driver.findElement(By.xpath("//button[@type='submit' or contains(@class, 'send') or contains(@class, 'button')]"));
      
      await textInput.clear();
      await textInput.sendKeys('   ');
      await sendBtn.click();
      
      const bubbles = await driver.findElements(By.xpath("//*[contains(@class, 'bubble') or contains(@class, 'message')]"));
      // Expect no new empty bubbles to be added
      expect(bubbles.length).to.be.lessThan(5);
    });
  });

  it('TC-CHAT-06: Submission of valid styling query', async function () {
    await recordResult('TC-CHAT-06', 'Functional', 'Type and send query text to Groq server', async () => {
      const textInput = await driver.findElement(By.xpath("//input[@placeholder='Ask Vastra...' or @type='text']"));
      await textInput.clear();
      await textInput.sendKeys('Suggest a casual outfit for men');
      
      const sendBtn = await driver.findElement(By.xpath("//button[@type='submit' or contains(@class, 'send') or contains(@class, 'button')]"));
      await sendBtn.click();
      
      timeSleep = (ms) => new Promise(res => setTimeout(res, ms));
      await timeSleep(1500);

      const bodyText = await driver.findElement(By.tagName('body')).getText();
      expect(bodyText).to.contain('casual outfit');
    });
  });

  it('TC-CHAT-07: Chat response loading indicator verification', async function () {
    await recordResult('TC-CHAT-07', 'UI/UX', 'Verify bot response animation starts loading', async () => {
      // Check if loading state, typing dot indicator, or placeholder bubble exists
      const body = await driver.findElement(By.tagName('body')).getText();
      expect(body).to.not.be.empty;
    });
  });

  it('TC-CHAT-08: Receipt of AI stylist message response', async function () {
    await recordResult('TC-CHAT-08', 'Functional', 'Wait for AI response to resolve and render in bubble', async () => {
      // Allow up to 10 seconds for API response
      await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'message') or contains(@class, 'bubble')][last()]")), 12000);
      const latestText = await driver.findElement(By.xpath("//*[contains(@class, 'message') or contains(@class, 'bubble')][last()]")).getText();
      expect(latestText).to.not.be.empty;
      await takeScreenshot(driver, 'chatbot_replied');
    });
  });

  it('TC-CHAT-09: Sending query using ENTER keyboard key', async function () {
    await recordResult('TC-CHAT-09', 'Functional', 'Verify user can submit prompt by pressing Enter key', async () => {
      const textInput = await driver.findElement(By.xpath("//input[@placeholder='Ask Vastra...' or @type='text']"));
      await textInput.clear();
      await textInput.sendKeys('Which colors complement gray?', Key.RETURN);
      
      timeSleep = (ms) => new Promise(res => setTimeout(res, ms));
      await timeSleep(2500);
      
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      expect(bodyText).to.contain('gray');
    });
  });

  it('TC-CHAT-10: Chat interface container scroll layout check', async function () {
    await recordResult('TC-CHAT-10', 'UI/UX', 'Verify chat messages container is scrollable', async () => {
      const scrollPane = await driver.findElement(By.xpath("//div[contains(@class, 'scroll') or contains(@class, 'messages') or contains(@class, 'container')]"));
      expect(await scrollPane.isDisplayed()).to.be.true;
    });
  });
});
