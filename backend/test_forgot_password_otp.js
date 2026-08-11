const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

async function testForgotPassword() {
  console.log("==================================================");
  console.log(" TESTING FORGOT PASSWORD OTP EMAIL SENDING ");
  console.log("==================================================\n");

  const targetEmail = 'abhinaysai21@gmail.com';

  try {
    // 1. Ensure user exists or register first
    console.log(`1. Preparing user account for ${targetEmail}...`);
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Abhinay Sai',
        email: targetEmail,
        password: 'Password123!'
      });
      console.log("   -> Registered new account for testing.");
    } catch (regErr) {
      if (regErr.response && regErr.response.status === 409) {
        console.log("   -> Account already exists (409), proceeding to Forgot Password test.");
      } else {
        console.log("   -> Register status:", regErr.response ? regErr.response.status : regErr.message);
      }
    }

    // 2. Call Forgot Password API
    console.log(`2. Triggering /auth/forgot-password for ${targetEmail}...`);
    const startTime = Date.now();
    const res = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: targetEmail
    });
    const elapsed = Date.now() - startTime;

    console.log(`   -> Response Status: ${res.status}`);
    console.log(`   -> Response Data:`, JSON.stringify(res.data));
    console.log(`   -> Time Taken: ${elapsed}ms`);

    console.log("\n==================================================");
    console.log(" SUCCESS: Forgot Password OTP email sent!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n==================================================");
    console.error(" [FAIL] Forgot Password test failed!");
    if (err.response) {
      console.error(" Status:", err.response.status);
      console.error(" Response:", JSON.stringify(err.response.data));
    } else {
      console.error(" Error:", err.message);
    }
    console.error("==================================================");
    process.exit(1);
  }
}

testForgotPassword();
