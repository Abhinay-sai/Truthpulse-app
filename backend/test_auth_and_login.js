const axios = require('axios');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function runAuthTests() {
  console.log("==================================================");
  console.log(" TESTING AUTHENTICATION & LOGIN SYSTEM ");
  console.log(" Targeting Express Backend:", BASE_URL);
  console.log("==================================================\n");

  let passed = 0;
  let total = 6;
  const testEmail = `auth_test_${Date.now()}@truthpulse.com`;
  const testPassword = 'Password123!';
  let jwtToken = null;

  // 1. Health Check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.status === 200 && res.data.status === 'ok') {
      console.log("[PASS] 1. Backend Health Check (/health) -> OK");
      passed++;
    } else {
      console.log("[FAIL] 1. Health Check status invalid:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 1. Health Check failed:", err.message);
  }

  // 2. User Registration
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Auth Test User',
      email: testEmail,
      password: testPassword
    });
    if (res.status === 201 && res.data.userId) {
      console.log(`[PASS] 2. User Registration (/auth/register) -> Registered ${testEmail}`);
      passed++;
    } else {
      console.log("[FAIL] 2. Registration invalid response:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 2. Registration error:", err.response ? err.response.data : err.message);
  }

  // 3. Email Verification / OTP
  try {
    const res = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: testEmail,
      otp: '000000'
    });
    if (res.status === 200 && res.data.token) {
      jwtToken = res.data.token;
      console.log("[PASS] 3. Email OTP Verification (/auth/verify-email) -> JWT Token Received");
      passed++;
    } else {
      console.log("[FAIL] 3. OTP verification invalid response:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 3. OTP verification error:", err.response ? err.response.data : err.message);
  }

  // 4. User Login
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    if (res.status === 200 && res.data.token) {
      jwtToken = res.data.token;
      console.log("[PASS] 4. User Login (/auth/login) -> Success! JWT Token Validated");
      passed++;
    } else {
      console.log("[FAIL] 4. Login invalid response:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 4. Login error:", err.response ? err.response.data : err.message);
  }

  // 5. Fetch Profile (/auth/me)
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    const userObj = res.data.user || res.data;
    if (res.status === 200 && userObj.email === testEmail) {
      console.log(`[PASS] 5. Fetch User Profile (/auth/me) -> Verified User: ${userObj.name} (${userObj.email})`);
      passed++;
    } else {
      console.log("[FAIL] 5. Profile response invalid:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 5. Profile error:", err.response ? err.response.data : err.message);
  }

  // 6. Trigger Forgot Password
  try {
    const res = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: testEmail
    });
    if (res.status === 200 && res.data.message) {
      console.log("[PASS] 6. Forgot Password Flow (/auth/forgot-password) -> Password Reset Email Triggered");
      passed++;
    } else {
      console.log("[FAIL] 6. Forgot Password invalid response:", res.data);
    }
  } catch (err) {
    console.log("[FAIL] 6. Forgot Password error:", err.response ? err.response.data : err.message);
  }

  console.log("\n==================================================");
  console.log(` AUTHENTICATION TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("==================================================");

  if (passed !== total) process.exit(1);
}

runAuthTests();
