module.exports = {
  BASE_URL: process.env.BASE_URL || "http://localhost:5173",
  HEADLESS: process.env.HEADLESS === "true" || false,
  TEST_EMAIL: process.env.TEST_EMAIL || "automation_test_user@example.com",
  TEST_PASSWORD: process.env.TEST_PASSWORD || "Test@1234",
  TEST_NAME: process.env.TEST_NAME || "Automation User",
  TIMEOUT: 30000,
  CHROME_OPTIONS: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]
};
