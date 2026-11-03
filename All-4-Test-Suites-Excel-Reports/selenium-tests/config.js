module.exports = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:5173', // Deployed or local page URL
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000', // Flask backend
  TEST_EMAIL: 'test@selenium.com',
  TEST_PASSWORD: 'Password123!',
  TEST_NAME: 'Selenium Web Tester',
  CHROME_OPTIONS: [
    '--start-maximized',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  ]
};
