import os

# Appium Server URL
APPIUM_SERVER = "http://127.0.0.1:4723"

# Path to the debug APK (relative to the repository root or absolute)
APK_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "app-debug.apk"))

# Desired capabilities for Android Emulator
DESIRED_CAPS = {
    "platformName": "Android",
    "appium:platformVersion": "12",
    "appium:deviceName": "Android Emulator",
    "appium:app": APK_PATH,
    "appium:appPackage": "com.example.vastranaveen",
    "appium:appActivity": ".MainActivity",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": False,
    "appium:fullReset": False,
    "appium:newCommandTimeout": 60,
    "appium:gpsEnabled": True,
}

# Test Configuration
TEST_EMAIL = "test@appium.com"
TEST_PASSWORD = "password123"
TEST_NAME = "Appium Tester"
BACKEND_URL = "http://10.0.2.2:5000"  # Android emulator default localhost alias
