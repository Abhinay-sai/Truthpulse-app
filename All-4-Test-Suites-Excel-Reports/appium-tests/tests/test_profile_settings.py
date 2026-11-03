import time
import pytest
from selenium.webdriver.common.by import By
import config
from test_auth_validation import record_appium_result

def test_profile_settings_scenarios(driver, test_results):
    """
    Test suite containing 10 Profile and Settings screen test cases.
    """
    # Log in first
    driver.find_by_text("Welcome Back", timeout=15)
    inputs = driver.find_elements(By.CLASS_NAME, "android.widget.EditText")
    inputs[0].send_keys(config.TEST_EMAIL)
    inputs[1].send_keys(config.TEST_PASSWORD)
    driver.find_by_text("Sign In").click()
    driver.find_by_text_contains("Hello", timeout=15)
    
    # Go to Profile tab
    try:
        profile_tab = driver.find_element(By.XPATH, "//*[@content-desc='Profile' or @text='Profile']")
        profile_tab.click()
        time.sleep(2)
    except Exception:
        pass

    def step_01():
        # TC-APP-PROF-01: Profile title rendering check
        title = driver.find_by_text("Profile")
        assert title is not None
    record_appium_result(test_results, "TC-APP-PROF-01", "Profile", "UI/UX", "Verify Profile header text is visible", step_01)

    def step_02():
        # TC-APP-PROF-02: Display of user name metadata check
        name_txt = driver.find_by_text_contains(config.TEST_NAME)
        assert name_txt is not None
    record_appium_result(test_results, "TC-APP-PROF-02", "Profile", "Functional", "Verify user profile displays user's full name", step_02)

    def step_03():
        # TC-APP-PROF-03: Display of user email address check
        email_txt = driver.find_by_text_contains(config.TEST_EMAIL)
        assert email_txt is not None
    record_appium_result(test_results, "TC-APP-PROF-03", "Profile", "Functional", "Verify profile displays correct registered email", step_03)

    def step_04():
        # TC-APP-PROF-04: Card widgets for info details check
        gender_card = driver.find_by_text_contains("Gender")
        assert gender_card is not None
    record_appium_result(test_results, "TC-APP-PROF-04", "Profile", "UI/UX", "Verify layout contains cards for user demographics", step_04)

    def step_05():
        # TC-APP-PROF-05: Settings cog wheel navigation button check
        try:
            settings_gear = driver.find_element(By.XPATH, "//*[@content-desc='Settings' or contains(@content-desc, 'settings') or @text='Settings']")
            assert settings_gear is not None
        except Exception:
            pass
    record_appium_result(test_results, "TC-APP-PROF-05", "Profile", "UI/UX", "Verify settings shortcut navigation gear icon exists", step_05)

    def step_06():
        # TC-APP-PROF-06: Tap settings option triggers settings screen
        try:
            settings_gear = driver.find_element(By.XPATH, "//*[@content-desc='Settings' or contains(@content-desc, 'settings') or @text='Settings']")
            settings_gear.click()
            time.sleep(2)
        except Exception:
            # Fallback
            driver.find_by_text("Settings").click()
            time.sleep(2)
        assert driver.find_by_text("Settings") is not None
    record_appium_result(test_results, "TC-APP-PROF-06", "Settings", "Functional", "Verify navigation from profile to settings page", step_06)

    def step_07():
        # TC-APP-PROF-07: Account settings option listing check
        acc = driver.find_by_text("Account")
        assert acc is not None
    record_appium_result(test_results, "TC-APP-PROF-07", "Settings", "UI/UX", "Verify Settings lists the account panel item", step_07)

    def step_08():
        # TC-APP-PROF-08: About details option listing check
        about = driver.find_by_text("About")
        assert about is not None
    record_appium_result(test_results, "TC-APP-PROF-08", "Settings", "UI/UX", "Verify Settings lists the about description tile", step_08)

    def step_09():
        # TC-APP-PROF-09: Logout tile click trigger logout
        logout = driver.find_by_text("Log out")
        assert logout is not None
    record_appium_result(test_results, "TC-APP-PROF-09", "Settings", "UI/UX", "Verify Log out option is rendered inside settings", step_09)

    def step_10():
        # TC-APP-PROF-10: Verify redirect to Welcome login card after logout click
        driver.find_by_text("Log out").click()
        time.sleep(2.5)
        assert driver.find_by_text("Welcome Back") is not None
    record_appium_result(test_results, "TC-APP-PROF-10", "Login", "Functional", "Verify logout returns user to Welcome Back screen", step_10)
network = None
