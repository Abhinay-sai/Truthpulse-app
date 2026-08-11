const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
let token = null;
let userId = null;
let createdPostId = null;

async function runExhaustiveTestSuite() {
  console.log("==================================================================");
  console.log(" EXHAUSTIVE FEATURE TEST SUITE - TRUTHPULSE APP (NO GEMINI KEY) ");
  console.log(" Targeting Express Backend:", BASE_URL);
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;
  const results = [];

  const test = async (category, featureName, fn) => {
    try {
      await fn();
      console.log(`[PASS] [${category}] ${featureName}`);
      passed++;
      results.push({ category, featureName, status: "PASS" });
    } catch (err) {
      console.error(`[FAIL] [${category}] ${featureName} -> ${err.message}`);
      if (err.response) console.error("       Response Data:", JSON.stringify(err.response.data));
      failed++;
      results.push({ category, featureName, status: "FAIL", error: err.message });
    }
  };

  // 1. Health Check
  await test("System", "Health Check (/health)", async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status !== 'ok') throw new Error("Service health check returned non-ok status");
  });

  // 2. Authentication Flow
  const testEmail = `exhaustive_qa_${Date.now()}@truthpulse.com`;
  const testPassword = 'SecurePassword123!';

  await test("Auth", "User Registration (/auth/register)", async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Exhaustive QA Tester',
      email: testEmail,
      password: testPassword
    });
    if (!res.data.userId) throw new Error("Missing userId in response");
    userId = res.data.userId;
  });

  await test("Auth", "Email OTP Verification (/auth/verify-email)", async () => {
    const res = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: testEmail,
      otp: '000000'
    });
    if (!res.data.token) throw new Error("Missing token in verification response");
    token = res.data.token;
  });

  await test("Auth", "User Login (/auth/login)", async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    if (!res.data.token) throw new Error("Login failed to return token");
  });

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  await test("Auth", "Fetch Current User Profile (/auth/me)", async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, { headers: authHeaders() });
    if (res.data.user.email !== testEmail) throw new Error("Email mismatch in profile");
  });

  await test("Auth", "Update User Profile (/auth/update)", async () => {
    const res = await axios.put(`${BASE_URL}/auth/update`, {
      name: 'Exhaustive QA Tester (Updated)'
    }, { headers: authHeaders() });
    if (!res.data.message) throw new Error("Update profile response invalid");
  });

  await test("Auth", "Update User Settings (/user/settings)", async () => {
    const res = await axios.put(`${BASE_URL}/user/settings`, {
      notifications: true,
      autoSave: true,
      deepScan: true
    }, { headers: authHeaders() });
    if (res.data.deepScan !== true) throw new Error("Settings update failed to persist");
  });

  // 3. AI Analysis Suite
  await test("AI Analysis", "Text Claim Analysis (/analyze-text)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-text`, {
      text: "Breaking: Miracle natural compound cures all viral infections instantly!"
    }, { headers: authHeaders() });
    if (!res.data.status || !res.data.trustScore || !res.data.explanation) throw new Error("Invalid response keys");
  });

  await test("AI Analysis", "Image File Analysis (/analyze)", async () => {
    const imgPath = path.join(__dirname, 'temp_test_img.jpg');
    const dummyJpg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xD9]);
    fs.writeFileSync(imgPath, dummyJpg);

    const form = new FormData();
    form.append('media', fs.createReadStream(imgPath), 'sample.jpg');

    const res = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    if (!res.data.status || !res.data.explanation) throw new Error("Image analysis response incomplete");
  });

  await test("AI Analysis", "Audio File Analysis (/analyze)", async () => {
    const audioPath = path.join(__dirname, 'temp_test_audio.mp3');
    fs.writeFileSync(audioPath, Buffer.from("DUMMY AUDIO DATA CONTENT"));

    const form = new FormData();
    form.append('media', fs.createReadStream(audioPath), 'sample_voice.mp3');

    const res = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    if (!res.data.status || !res.data.explanation) throw new Error("Audio analysis response incomplete");
  });

  await test("AI Analysis", "Batch Files Analysis (/analyze-batch)", async () => {
    const f1 = path.join(__dirname, 'b1.jpg');
    const f2 = path.join(__dirname, 'b2.jpg');
    fs.writeFileSync(f1, Buffer.from([0xFF, 0xD8, 0xFF, 0xD9]));
    fs.writeFileSync(f2, Buffer.from([0xFF, 0xD8, 0xFF, 0xD9]));

    const form = new FormData();
    form.append('media', fs.createReadStream(f1), 'b1.jpg');
    form.append('media', fs.createReadStream(f2), 'b2.jpg');

    const res = await axios.post(`${BASE_URL}/analyze-batch`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(f1)) fs.unlinkSync(f1);
    if (fs.existsSync(f2)) fs.unlinkSync(f2);

    if (!res.data.results || res.data.results.length !== 2) throw new Error("Batch failed to return 2 results");
  });

  await test("AI Analysis", "Document Scanner (/analyze-document)", async () => {
    const docPath = path.join(__dirname, 'temp_test_doc.txt');
    fs.writeFileSync(docPath, "Statistical analysis of machine learning transformer models.");

    const form = new FormData();
    form.append('document', fs.createReadStream(docPath), 'report.txt');

    const res = await axios.post(`${BASE_URL}/analyze-document`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });
    if (fs.existsSync(docPath)) fs.unlinkSync(docPath);

    if (!res.data.status || !res.data.explanation) throw new Error("Document scan incomplete");
  });

  await test("AI Analysis", "Social Media Bot Scanner (/analyze-social)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-social`, {
      handle: "@crypto_pump_bot_7781"
    }, { headers: authHeaders() });

    if (!res.data.status || !res.data.explanation) throw new Error("Social scan incomplete");
  });

  await test("AI Analysis", "Live Audio Stream Scanner (/analyze-live-audio)", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-live-audio`, {}, { headers: authHeaders() });
    if (!res.data.status || !res.data.explanation) throw new Error("Live audio stream scan incomplete");
  });

  await test("AI Analysis", "Webpage URL Scanner (/analyze-url)", async () => {
    // Test URL scanner with a lightweight public URL
    try {
      const res = await axios.post(`${BASE_URL}/analyze-url`, {
        url: "https://example.com"
      }, { headers: authHeaders() });
      if (!res.data.status || !res.data.explanation) throw new Error("URL scan response incomplete");
    } catch(err) {
      if (err.response && err.response.data && err.response.data.error) {
        console.log("       [INFO] URL fetch note:", err.response.data.error);
      } else {
        throw err;
      }
    }
  });

  // 4. Dynamic Content Generators
  await test("Generators", "Deepfake Quiz Generator (/quiz)", async () => {
    const res = await axios.get(`${BASE_URL}/quiz`, { headers: authHeaders() });
    if (!Array.isArray(res.data) || res.data.length !== 3) throw new Error("Expected 3 quiz items");
  });

  await test("Generators", "AI Cybersecurity News (/news)", async () => {
    const res = await axios.get(`${BASE_URL}/news`, { headers: authHeaders() });
    if (!Array.isArray(res.data) || res.data.length !== 5) throw new Error("Expected 5 news items");
  });

  await test("Generators", "Learning Hub Articles (/learning)", async () => {
    const res = await axios.get(`${BASE_URL}/learning`, { headers: authHeaders() });
    if (!Array.isArray(res.data) || res.data.length !== 4) throw new Error("Expected 4 learning articles");
  });

  // 5. Community Feed & Interaction
  await test("Community", "Fetch Community Feed (/feed)", async () => {
    const res = await axios.get(`${BASE_URL}/feed`, { headers: authHeaders() });
    if (!Array.isArray(res.data)) throw new Error("Feed did not return array");
  });

  await test("Community", "Create Community Post (/feed)", async () => {
    const res = await axios.post(`${BASE_URL}/feed`, {
      title: "How I spot AI images in 2026",
      content: "Look closely at eye reflections and background symmetry!",
      imageUrl: "https://picsum.photos/seed/truth/800/600"
    }, { headers: authHeaders() });

    if (!res.data.post || !res.data.post._id) throw new Error("Failed to create community post");
    createdPostId = res.data.post._id;
  });

  if (createdPostId) {
    await test("Community", "Upvote Community Post (/feed/:id/upvote)", async () => {
      const res = await axios.post(`${BASE_URL}/feed/${createdPostId}/upvote`, {}, { headers: authHeaders() });
      if (res.data.upvotes === undefined) throw new Error("Upvote failed");
    });

    await test("Community", "Comment on Community Post (/feed/:id/comment)", async () => {
      const res = await axios.post(`${BASE_URL}/feed/${createdPostId}/comment`, {
        text: "Great tip, thanks for sharing!"
      }, { headers: authHeaders() });
      if (!Array.isArray(res.data.comments) || res.data.comments.length === 0) throw new Error("Comment failed");
    });
  }

  // 6. Notifications & History Management
  await test("User Data", "Fetch Notifications (/notifications)", async () => {
    const res = await axios.get(`${BASE_URL}/notifications`, { headers: authHeaders() });
    if (!Array.isArray(res.data)) throw new Error("Notifications failed");
  });

  await test("User Data", "Mark Notifications as Read (/notifications/read-all)", async () => {
    const res = await axios.put(`${BASE_URL}/notifications/read-all`, {}, { headers: authHeaders() });
    if (!res.data.message) throw new Error("Mark read failed");
  });

  await test("User Data", "Fetch Scan History (/history)", async () => {
    const res = await axios.get(`${BASE_URL}/history`, { headers: authHeaders() });
    if (!Array.isArray(res.data)) throw new Error("History failed");
  });

  await test("User Data", "Clear Scan History (/history)", async () => {
    const res = await axios.delete(`${BASE_URL}/history`, { headers: authHeaders() });
    if (!res.data.message) throw new Error("Delete history failed");
  });

  console.log("\n==================================================================");
  console.log(` SUMMARY: ${passed} PASSED | ${failed} FAILED OUT OF ${passed + failed} TOTAL TESTS `);
  console.log("==================================================================");

  if (failed > 0) process.exit(1);
}

runExhaustiveTestSuite();
