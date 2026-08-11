const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
let token = null;

async function runFullAppTest() {
  console.log("==================================================");
  console.log("TESTING FULL TRUTHPULSE APP WITHOUT GEMINI API KEY");
  console.log("Targeting Express Backend at:", BASE_URL);
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name} - ${err.message}`);
      if (err.response) console.error("   Error Data:", JSON.stringify(err.response.data));
      else if (err.code) console.error("   Error Code:", err.code);
      failed++;
    }
    console.log("--------------------------------------------------");
  };

  // 1. Auth Setup
  const email = `no_gemini_test_${Date.now()}@truthpulse.com`;
  const password = 'TestPassword123!';

  await test("User Registration & Email Verification", async () => {
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'No Gemini Tester',
      email: email,
      password: password
    });

    const verifyRes = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: email,
      otp: '000000'
    });
    token = verifyRes.data.token;
    if (!token) throw new Error("Verification failed to return JWT token");
  });

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  // 2. Text Claim Analysis Endpoint
  await test("Text Claim Analysis (/analyze-text)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-text`, {
      text: "SHOCKING SECRET CURE DISCOVERED BY SCIENTISTS!"
    }, { headers: authHeaders() });

    if (!res.data.status || !res.data.explanation || !res.data.trustScore) {
      throw new Error("Invalid response format");
    }
    console.log("   -> Status:", res.data.status, "| Trust:", res.data.trustScore);
  });

  // 3. Image Media Upload Analysis Endpoint
  await test("Image Media Analysis (/analyze)", async () => {
    const sampleImagePath = path.join(__dirname, 'test_sample.jpg');
    // Create a 1x1 dummy JPG buffer if file doesn't exist
    const dummyJpg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0xFF, 0xD9]);
    fs.writeFileSync(sampleImagePath, dummyJpg);

    const form = new FormData();
    form.append('media', fs.createReadStream(sampleImagePath), 'test_sample.jpg');

    const res = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(sampleImagePath)) fs.unlinkSync(sampleImagePath);

    if (!res.data.status || !res.data.explanation) {
      throw new Error("Invalid response format");
    }
    console.log("   -> Status:", res.data.status, "| Trust:", res.data.trustScore);
  });

  // 4. Document Analysis Endpoint
  await test("Document Analysis (/analyze-document)", async () => {
    const sampleDocPath = path.join(__dirname, 'test_doc.txt');
    fs.writeFileSync(sampleDocPath, "This is a sample document for forensic NLP verification testing.");

    const form = new FormData();
    form.append('document', fs.createReadStream(sampleDocPath), 'test_doc.txt');

    const res = await axios.post(`${BASE_URL}/analyze-document`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(sampleDocPath)) fs.unlinkSync(sampleDocPath);

    if (!res.data.status || !res.data.explanation) {
      throw new Error("Invalid response format");
    }
    console.log("   -> Status:", res.data.status, "| Trust:", res.data.trustScore);
  });

  // 5. Social Media Scanner Endpoint
  await test("Social Profile Analysis (/analyze-social)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-social`, {
      handle: "@test_bot_user_9988"
    }, { headers: authHeaders() });

    if (!res.data.status || !res.data.explanation) {
      throw new Error("Invalid response format");
    }
    console.log("   -> Status:", res.data.status, "| Explanation:", res.data.explanation.substring(0, 60) + "...");
  });

  // 6. Live Audio Scanner Endpoint
  await test("Live Audio Stream Analysis (/analyze-live-audio)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-live-audio`, {}, { headers: authHeaders() });

    if (!res.data.status || !res.data.explanation) {
      throw new Error("Invalid response format");
    }
    console.log("   -> Status:", res.data.status, "| Trust:", res.data.trustScore);
  });

  // 7. Quiz Generator Endpoint
  await test("Deepfake Quiz Generator (/quiz)", async () => {
    const res = await axios.get(`${BASE_URL}/quiz`, { headers: authHeaders() });

    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error("Quiz failed to return array of questions");
    }
    console.log(`   -> Returned ${res.data.length} quiz questions.`);
  });

  // 8. News Generator Endpoint
  await test("AI Cybersecurity News (/news)", async () => {
    const res = await axios.get(`${BASE_URL}/news`, { headers: authHeaders() });

    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error("News failed to return array of headlines");
    }
    console.log(`   -> Returned ${res.data.length} news items. Headline 1: "${res.data[0].title}"`);
  });

  // 9. Learning Hub Articles Endpoint
  await test("Learning Hub Articles (/learning)", async () => {
    const res = await axios.get(`${BASE_URL}/learning`, { headers: authHeaders() });

    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error("Learning hub failed to return articles");
    }
    console.log(`   -> Returned ${res.data.length} learning articles. Article 1: "${res.data[0].title}"`);
  });

  // 10. History Retrieval
  await test("Scan History Retrieval (/history)", async () => {
    const res = await axios.get(`${BASE_URL}/history`, { headers: authHeaders() });

    if (!Array.isArray(res.data)) {
      throw new Error("History failed to return array");
    }
    console.log(`   -> History contains ${res.data.length} saved scans.`);
  });

  console.log("==================================================");
  console.log(`FINAL RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runFullAppTest();
