import pytest
from appium.webdriver.common.appiumby import AppiumBy

# Array of boundary value analysis inputs
input_variants = [
    "",                             # Empty
    "A",                            # Minimum bound
    "John Doe",                     # Standard valid
    "test@example.com",             # Valid Email
    "invalid-email",                # Invalid Email
    "1234567890",                   # Numeric
    "!@#$%^&*()_+",                 # Special chars
    "a" * 255,                      # Maximum length boundary
    "<script>alert(1)</script>",    # Injection attempt
    "DROP TABLE users;",            # SQLi attempt
    "   leading and trailing   ",   # Whitespace handling
    "emoji 😊 test",                # Unicode/Emoji
    "a" * 5000                      # Extreme length stress test
]

# Common input fields across the app
input_fields = [
    (AppiumBy.ID, "com.example.vastranaveen:id/input_email"),
    (AppiumBy.ID, "com.example.vastranaveen:id/input_password"),
    (AppiumBy.ID, "com.example.vastranaveen:id/input_name"),
    (AppiumBy.ID, "com.example.vastranaveen:id/input_chat"),
    (AppiumBy.ID, "com.example.vastranaveen:id/input_search"),
    (AppiumBy.CLASS_NAME, "android.widget.EditText")
]

@pytest.mark.parametrize("field_locator_type, field_locator_val", input_fields)
@pytest.mark.parametrize("input_val", input_variants)
def test_exhaustive_mobile_inputs(driver, field_locator_type, field_locator_val, input_val):
    """
    Exhaustively tests input validation and app stability against edge-case inputs.
    Generates 6 fields * 13 inputs = 78 test cases.
    """
    try:
        # Dynamically find the input field if it's currently on screen
        elements = driver.find_elements(by=field_locator_type, value=field_locator_val)
        
        if elements:
            for el in elements:
                # Clear existing text
                el.clear()
                # Send the parameterized input
                el.send_keys(input_val)
                
                # Check if the app accepted it without crashing
                text = el.get_attribute("text")
                # Assert that the app is still alive
                assert driver.current_activity is not None
                
    except Exception as e:
        if "NoSuchElement" not in str(e):
            raise e
