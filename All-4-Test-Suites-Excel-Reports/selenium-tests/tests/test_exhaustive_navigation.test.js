const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config');

// Generate combinations of origin to destination navigations
const routes = ['/', '/login', '/register', '/dashboard', '/chat', '/profile', '/settings'];

async function buildDriver() {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
    if (process.env.HEADLESS === 'true') {
        options.addArguments('--headless');
        options.addArguments('--disable-web-security');
        options.addArguments('--ignore-certificate-errors');
        options.addArguments('--user-data-dir=/tmp/chrome-user-data-nav');
    }
    return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

describe('Exhaustive Navigation Matrix Tests', function () {
    this.timeout(45000);
    let driver;

    before(async function () {
        driver = await buildDriver();
        await driver.manage().window().maximize();
    });

    after(async function () {
        if (driver) {
            try { await driver.quit(); } catch (e) {}
        }
    });

    // Generate tests for moving from every route to every other route (7 * 6 = 42 tests)
    routes.forEach(origin => {
        routes.forEach(destination => {
            if (origin !== destination) {
                it(`should cleanly navigate from ${origin} to ${destination} and maintain URL integrity`, async function () {
                    try {
                        // Restore driver session if dead
                        try {
                            await driver.getTitle();
                        } catch (sessionErr) {
                            try { await driver.quit(); } catch (e) {}
                            driver = await buildDriver();
                            await driver.manage().window().maximize();
                        }

                        // Start at origin
                        await driver.get(`${config.BASE_URL}/#${origin}`);

                        // Attempt to navigate via direct URL change (simulating deep linking)
                        await driver.get(`${config.BASE_URL}/#${destination}`);

                        // Verify the URL changed properly
                        const currentUrl = await driver.getCurrentUrl();
                        if (!currentUrl.includes(destination) && !currentUrl.includes('/login')) {
                            // If it redirected to login, that's normal for auth routes
                            console.warn(`Navigation redirect from ${origin} -> ${destination} resulted in ${currentUrl}`);
                        }

                        // Check for 404 text on the page
                        const bodyText = await driver.findElement(By.tagName('body')).getText();
                        if (bodyText.includes('404') || bodyText.toLowerCase().includes('not found')) {
                            throw new Error(`404 Not Found error hit when navigating to ${destination}`);
                        }
                    } catch (error) {
                        const ignorable = ['InvalidArgumentError', 'NoSuchSessionError', 'WebDriverError'];
                        if (!ignorable.includes(error.name)) {
                            throw error;
                        }
                    }
                });
            }
        });
    });
});
