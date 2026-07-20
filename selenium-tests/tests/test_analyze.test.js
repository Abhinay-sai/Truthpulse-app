const { expect } = require('chai');
const { initDriver, takeScreenshot, globalResults, ensureLoggedIn } = require('../conftest');
const { By, until } = require('selenium-webdriver');
const config = require('../config');
const path = require('path');
const fs = require('fs');

describe('Web Face Analysis Wizard Suite', function () {
  let driver;
  const screen = 'Analyze Screen';

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

  it('TC-ANZ-01: Navigate to Face Analysis page', async function () {
    await recordResult('TC-ANZ-01', 'Functional', 'Verify user can open the face analysis screen', async () => {
      const analyzeLink = await driver.findElement(By.xpath("//nav//a[contains(@href, 'analyze') or contains(text(), 'Analyze')]"));
      await analyzeLink.click();
      await driver.wait(until.urlContains('analyze'), 5000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Face Shape');
    });
  });

  it('TC-ANZ-02: Verify Wizard initial Step 1 elements', async function () {
    await recordResult('TC-ANZ-02', 'UI/UX', 'Verify photo upload placeholder is visible on Step 1', async () => {
      const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
      expect(await fileInput.isEnabled()).to.be.true;
    });
  });

  it('TC-ANZ-03: Verify Step progress indicator styling', async function () {
    await recordResult('TC-ANZ-03', 'UI/UX', 'Verify stepper indicator shows active step 1', async () => {
      const stepIndicator = await driver.findElement(By.xpath("//*[contains(text(), 'Step 1') or contains(text(), 'Upload')]"));
      expect(await stepIndicator.isDisplayed()).to.be.true;
    });
  });

  it('TC-ANZ-04: Rejection of empty analysis submission', async function () {
    await recordResult('TC-ANZ-04', 'Validation', 'Verify next step button is disabled without selecting a photo', async () => {
      const nextBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Next') or contains(text(), 'Analyze')]"));
      const isEnabled = await nextBtn.isEnabled();
      // It can either be disabled or show validation message on click
      if (isEnabled) {
        await nextBtn.click();
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        expect(bodyText).to.contain('upload');
      } else {
        expect(isEnabled).to.be.false;
      }
    });
  });

  it('TC-ANZ-05: Simulation of file selection/upload', async function () {
    await recordResult('TC-ANZ-05', 'Functional', 'Upload a mock image file to input field', async () => {
      const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
      
      // Create a temporary mock image file
      const tempImg = path.join(__dirname, 'mock_face.jpg');
      fs.writeFileSync(tempImg, 'dummy content');

      await fileInput.sendKeys(tempImg);
      
      timeSleep = (ms) => new Promise(res => setTimeout(res, ms));
      await timeSleep(2000);
      
      // Cleanup temp file
      if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
      
      await takeScreenshot(driver, 'mock_image_selected');
    });
  });

  it('TC-ANZ-06: Step 2 Wizard wizard navigation', async function () {
    await recordResult('TC-ANZ-06', 'Functional', 'Verify navigation to Step 2 after upload', async () => {
      const nextBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Next') or contains(text(), 'Analyze') or contains(text(), 'Submit')]"));
      await nextBtn.click();
      
      timeSleep = (ms) => new Promise(res => setTimeout(res, ms));
      await timeSleep(2500);
      
      const body = await driver.findElement(By.tagName('body')).getText();
      expect(body).to.contain('Analyzing');
      await takeScreenshot(driver, 'analysis_in_progress');
    });
  });

  it('TC-ANZ-07: Analysis loading animation state verification', async function () {
    await recordResult('TC-ANZ-07', 'UI/UX', 'Verify loading spinner or analyzing text state is displayed', async () => {
      const progressText = await driver.findElement(By.xpath("//*[contains(text(), 'Analyzing') or contains(text(), 'Wait') or contains(@class, 'loader')]"));
      expect(await progressText.isDisplayed()).to.be.true;
    });
  });

  it('TC-ANZ-08: Validation of Face Shape detection results', async function () {
    await recordResult('TC-ANZ-08', 'Functional', 'Verify face shape response parameters are parsed on completion', async () => {
      // Wait for analysis results cards to show up
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Face Shape') or contains(text(), 'Oval') or contains(text(), 'Round') or contains(text(), 'Skin Tone')]")), 15000);
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).to.contain('Face Shape');
    });
  });

  it('TC-ANZ-09: Validation of Style Recommendations card rendering', async function () {
    await recordResult('TC-ANZ-09', 'UI/UX', 'Verify recommended hairstyle/clothing metrics cards are loaded', async () => {
      const recHeader = await driver.findElement(By.xpath("//*[contains(text(), 'Style Recommendations') or contains(text(), 'Outfits') or contains(text(), 'Size')]"));
      expect(await recHeader.isDisplayed()).to.be.true;
      await takeScreenshot(driver, 'analysis_results_screen');
    });
  });

  it('TC-ANZ-10: Navigation back to wizard start', async function () {
    await recordResult('TC-ANZ-10', 'Functional', 'Verify reset/restart analysis button returns to Step 1', async () => {
      const restartBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Restart') or contains(text(), 'New Analysis') or contains(text(), 'Analyze Again')]"));
      await restartBtn.click();
      
      timeSleep = (ms) => new Promise(res => setTimeout(res, ms));
      await timeSleep(1500);
      
      const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
      expect(await fileInput.isDisplayed()).to.be.true;
    });
  });
});
