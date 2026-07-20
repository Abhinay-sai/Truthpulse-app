import os
import time
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import config
import reporter

# Global session results list
_session_test_results = []

@pytest.fixture(scope="session")
def test_results():
    """Session fixture returning the list of test results for reporting."""
    return _session_test_results

@pytest.fixture(scope="function")
def driver(request):
    """
    Initializes and yields an Appium webdriver session for a single test.
    Cleans up (quits) the driver after the test is run.
    """
    options = UiAutomator2Options()
    for key, value in config.DESIRED_CAPS.items():
        options.set_capability(key, value)
        
    print(f"\nConnecting to Appium Server at {config.APPIUM_SERVER}...")
    driver = webdriver.Remote(config.APPIUM_SERVER, options=options)
    
    # Define helpers on the driver object dynamically for cleaner test code
    def find_by_text(text, timeout=10):
        xpath = f"//*[@text='{text}']"
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        
    def find_by_text_contains(text, timeout=10):
        xpath = f"//*[contains(@text, '{text}')]"
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        
    def find_by_desc(desc, timeout=10):
        xpath = f"//*[@content-desc='{desc}']"
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )

    def find_by_desc_contains(desc, timeout=10):
        xpath = f"//*[contains(@content-desc, '{desc}')]"
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )

    driver.find_by_text = find_by_text
    driver.find_by_text_contains = find_by_text_contains
    driver.find_by_desc = find_by_desc
    driver.find_by_desc_contains = find_by_desc_contains

    yield driver
    
    # Save a screenshot if the test failed
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        screenshots_dir = os.path.join(os.path.dirname(__file__), "screenshots")
        os.makedirs(screenshots_dir, exist_ok=True)
        screenshot_name = f"{request.node.name}_failed.png"
        screenshot_path = os.path.join(screenshots_dir, screenshot_name)
        try:
            driver.save_screenshot(screenshot_path)
            request.node.screenshot_path = os.path.relpath(screenshot_path, os.path.dirname(__file__))
            print(f"\n[Test Failed] Saved screenshot to {screenshot_path}")
        except Exception as e:
            print(f"Failed to capture screenshot: {e}")
            request.node.screenshot_path = None
    else:
        request.node.screenshot_path = None

    print("\nQuitting Appium Session...")
    driver.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook to capture test execution status, timing, and errors.
    """
    # Execute all other runners to obtain the report object
    outcome = yield
    rep = outcome.get_result()
    
    # Store result details on the item so we can access them in the fixture or in session finish
    setattr(item, "rep_" + rep.when, rep)

@pytest.hookimpl(trylast=True)
def pytest_runtest_logreport(report):
    """
    Callback triggered after a test phase (setup, call, teardown) completes.
    We append to our session test results when the call phase finishes.
    """
    if report.when == "call":
        # Check if setup or teardown failed, or just normal call phase
        status = "PASS" if report.passed else "FAIL"
        
        # Get screenshot path from test node if available
        # pytest stores the item node in report.longrepr or we can look it up
        pass

# We hook into session finish to compile and write our results to Excel
def pytest_runtest_teardown(item, nextitem):
    """
    Save the test metrics after each test teardown phase.
    """
    # Check execution phase report
    rep_call = getattr(item, "rep_call", None)
    rep_setup = getattr(item, "rep_setup", None)
    
    status = "FAIL"
    duration = 0
    error_msg = ""
    
    if rep_call:
        status = "PASS" if rep_call.passed else "FAIL"
        duration = rep_call.duration
        error_msg = str(rep_call.longrepr) if rep_call.failed else ""
    elif rep_setup and rep_setup.failed:
        status = "FAIL (Setup)"
        duration = rep_setup.duration
        error_msg = str(rep_setup.longrepr)

    screenshot = getattr(item, "screenshot_path", "")
        
    # Get metadata from test function docstrings
    description = item.obj.__doc__.strip() if item.obj.__doc__ else "No description"
    # Determine screen name from test file name
    filename = os.path.basename(item.fspath)
    screen_name = "Unknown"
    if "splash" in filename:
        screen_name = "Splash Screen"
    elif "login" in filename:
        screen_name = "Login Screen"
    elif "register" in filename:
        screen_name = "Register Screen"
    elif "home" in filename:
        screen_name = "Home Screen"
    elif "analyze" in filename:
        screen_name = "Analyze Screen"
    elif "chatbot" in filename:
        screen_name = "Chatbot Screen"
    elif "history" in filename:
        screen_name = "History Screen"
    elif "profile" in filename:
        screen_name = "Profile Screen"
    elif "settings" in filename:
        screen_name = "Settings Screen"
    elif "e2e" in filename:
        screen_name = "Full E2E Flow"
        
    test_case = {
        "name": item.name,
        "screen": screen_name,
        "description": description,
        "status": status,
        "duration": duration,
        "error": error_msg,
        "screenshot": screenshot
    }
    _session_test_results.append(test_case)

def pytest_sessionfinish(session, exitstatus):
    """
    Triggered after all tests finish. Writes the final Excel report.
    """
    print(f"\n pytest_sessionfinish: Generating Excel test report for {_session_test_results}")
    if _session_test_results:
        reporter.generate_report(_session_test_results)
    else:
        print("No test results collected to write report.")
