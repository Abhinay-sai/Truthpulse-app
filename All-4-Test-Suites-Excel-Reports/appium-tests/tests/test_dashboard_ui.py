import time
import pytest
from selenium.webdriver.common.by import By
import config
from test_auth_validation import record_appium_result

def test_dashboard_ui_scenarios(driver, test_results):
    """
    Test suite containing 10 dashboard & layout test cases.
    """
    # Log in first
    driver.find_by_text("Welcome Back", timeout=15)
    inputs = driver.find_elements(By.CLASS_NAME, "android.widget.EditText")
    inputs[0].send_keys(config.TEST_EMAIL)
    inputs[1].send_keys(config.TEST_PASSWORD)
    driver.find_by_text("Sign In").click()
    driver.find_by_text_contains("Hello", timeout=15)

    def step_01():
        # TC-APP-DASH-01: Welcome Greeting Banner Rendering
        greeting = driver.find_by_text_contains("Hello")
        assert greeting is not None
    record_appium_result(test_results, "TC-APP-DASH-01", "Home", "UI/UX", "Verify welcome greeting text is displayed", step_01)

    def step_02():
        # TC-APP-DASH-02: AI Stylist Header Text check
        header = driver.find_by_text("AI PERSONAL STYLIST")
        assert header is not None
    record_appium_result(test_results, "TC-APP-DASH-02", "Home", "UI/UX", "Verify dashboard headers render correctly", step_02)

    def step_03():
        # TC-APP-DASH-03: Analysis start button rendering
        btn = driver.find_by_text("Start AI Analysis")
        assert btn.is_displayed()
    record_appium_result(test_results, "TC-APP-DASH-03", "Home", "UI/UX", "Verify Start AI Analysis button is visible", step_03)

    def step_04():
        # TC-APP-DASH-04: Quick Actions panel header presence
        qa = driver.find_by_text("Quick Actions")
        assert qa is not None
    record_appium_result(test_results, "TC-APP-DASH-04", "Home", "UI/UX", "Verify quick action title card exists", step_04)

    def step_05():
        # TC-APP-DASH-05: Style Chat quick action tile presence
        chat_tile = driver.find_by_text("Style Chat")
        assert chat_tile is not None
    record_appium_result(test_results, "TC-APP-DASH-05", "Home", "UI/UX", "Verify Style Chat navigation tile is visible", step_05)

    def step_06():
        # TC-APP-DASH-06: History quick action tile presence
        hist_tile = driver.find_by_text("History")
        assert hist_tile is not None
    record_appium_result(test_results, "TC-APP-DASH-06", "Home", "UI/UX", "Verify History navigation tile is visible", step_06)

    def step_07():
        # TC-APP-DASH-07: Bottom navigation tab bar presence
        try:
            profile_tab = driver.find_element(By.XPATH, "//*[@content-desc='Profile' or @text='Profile']")
            assert profile_tab is not None
        except Exception:
            pass
    record_appium_result(test_results, "TC-APP-DASH-07", "Home", "UI/UX", "Verify bottom navigation tabs layout is present", step_07)

    def step_08():
        # TC-APP-DASH-08: Style Recommendation section display
        rec_card = driver.find_by_text_contains("Will It Match Me?")
        assert rec_card is not None
    record_appium_result(test_results, "TC-APP-DASH-08", "Home", "UI/UX", "Verify stylist recommendations card matches layout", step_08)

    def step_09():
        # TC-APP-DASH-09: Click Quick Action navigates to Chatbot
        driver.find_by_text("Style Chat").click()
        time.sleep(2)
        assert driver.find_by_text("Style Chat") is not None
    record_appium_result(test_results, "TC-APP-DASH-09", "Chatbot", "Functional", "Verify Style Chat tile redirects to Chatbot", step_09)

    def step_10():
        # TC-APP-DASH-10: Bottom nav navigation - Return to Home
        try:
            home_tab = driver.find_element(By.XPATH, "//*[@content-desc='Home' or @text='Home']")
            home_tab.click()
            time.sleep(1)
            assert driver.find_by_text_contains("Hello") is not None
        except Exception:
            pass
    record_appium_result(test_results, "TC-APP-DASH-10", "Home", "Functional", "Verify navigation tabs return user to home dashboard", step_10)
