const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
let token = null;
let testUserId = null;

async function runTests() {
  console.log("Starting Backend API Tests...");
  let passed = 0;
  let failed = 0;
  const warnings = [];

  const runTest = async (name, fn) => {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (error) {
      console.error(`[FAIL] ${name} - ${error.message}`);
      if (error.response) console.error(JSON.stringify(error.response.data));
      failed++;
    }
  };

  // 1. Register User
  const email = `qa_test_${Date.now()}@truthpulse.com`;
  const password = 'TestPassword123!';
  await runTest('User Registration', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'QA Tester',
      email: email,
      password: password
    });
    if (res.status !== 201) throw new Error('Expected 201 Created');
    testUserId = res.data.userId;
  });

  // 2. Verify Email (using bypass 000000)
  await runTest('Email Verification (Bypass)', async () => {
    const res = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: email,
      otp: '000000'
    });
    if (res.status !== 200) throw new Error('Expected 200 OK');
    if (!res.data.token) throw new Error('No token returned');
    token = res.data.token;
  });

  // 3. Login User
  await runTest('User Login', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: password
    });
    if (res.status !== 200) throw new Error('Expected 200 OK');
    if (!res.data.token) throw new Error('No token returned');
  });

  // 4. Get Current User Profile
  await runTest('Get User Profile', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status !== 200) throw new Error('Expected 200 OK');
    if (res.data.user.email !== email) throw new Error('Email mismatch');
  });

  // 5. Update Profile
  await runTest('Update Profile', async () => {
    const res = await axios.put(`${BASE_URL}/auth/update`, {
      name: 'QA Tester Updated'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status !== 200) throw new Error('Expected 200 OK');
  });

  // 6. Test File Upload Analysis API Structure (just to see if it responds without 500)
  // We'll upload a tiny text file mimicking an image just to see the validation/error
  await runTest('File Upload Validation', async () => {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('media', Buffer.from('test data'), 'test.jpg');
    try {
      await axios.post(`${BASE_URL}/analyze`, form, {
        headers: { 
          ...form.getHeaders(),
          Authorization: `Bearer ${token}` 
        }
      });
    } catch (err) {
      if (err.response && err.response.status === 500) {
        throw new Error('Server error on file upload');
      }
      // Depending on Gemini API state, might get a 400 or something, which is acceptable for validation here
      warnings.push(`File Upload API returned: ${err.response ? err.response.status : err.message}`);
    }
  });

  console.log(`\n--- Backend API Test Results ---`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (warnings.length > 0) {
    console.log(`Warnings:\n- ${warnings.join('\n- ')}`);
  }
}

runTests();
