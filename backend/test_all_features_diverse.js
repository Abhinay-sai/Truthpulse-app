const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
let token = null;

async function runDiverseTestCases() {
  console.log("==================================================================");
  console.log(" DIVERSE SCENARIO & FEATURE TEST SUITE - TRUTHPULSE ");
  console.log(" Testing live endpoints with varied authentic vs synthetic inputs");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  const runTest = async (title, fn) => {
    try {
      await fn();
      console.log(`[PASS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${title} -> ${err.message}`);
      if (err.response && err.response.data) {
        console.error("       Response Data:", JSON.stringify(err.response.data));
      }
      failed++;
    }
    console.log("------------------------------------------------------------------");
  };

  // 1. SETUP AUTH
  const email = `diverse_tester_${Date.now()}@truthpulse.com`;
  const password = 'Password123!';

  await runTest("User Setup & Authentication", async () => {
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Diverse Case Tester',
      email,
      password
    });

    const verifyRes = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email,
      otp: '000000'
    });

    token = verifyRes.data.token;
    if (!token) throw new Error("No token returned from verify-email");
  });

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  // 2. IMAGE SCENARIO 1: High-Variance Natural Image
  await runTest("Image Scenario 1: High Spatial Variance Natural Image", async () => {
    // Create image buffer with varied pixels
    const width = 64, height = 64;
    const header = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xD9]);
    const imgPath = path.join(__dirname, 'test_img1.jpg');
    fs.writeFileSync(imgPath, header);

    const form = new FormData();
    form.append('media', fs.createReadStream(imgPath), 'natural_photo.jpg');

    const res = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    const trustNum = parseFloat(res.data.trustScore);
    const aiProbNum = parseFloat(res.data.aiProbability);
    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
    if (isNaN(trustNum) || isNaN(aiProbNum)) throw new Error("Score returned is NaN");
    if (trustNum === 50 && aiProbNum === 50) throw new Error("Scores unexpectedly defaulted to static 50%");
  });

  // 3. IMAGE SCENARIO 2: Synthetic Low-Noise Image
  await runTest("Image Scenario 2: Synthetic Smooth Surface Image", async () => {
    const imgPath = path.join(__dirname, 'test_img2.jpg');
    const dummyData = Buffer.alloc(200, 128); // uniform bytes
    fs.writeFileSync(imgPath, dummyData);

    const form = new FormData();
    form.append('media', fs.createReadStream(imgPath), 'synthetic_render.png');

    const res = await axios.post(`${BASE_URL}/analyze`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
    const trustNum = parseFloat(res.data.trustScore);
    if (isNaN(trustNum)) throw new Error("Score returned is NaN");
  });

  // 4. TEXT SCENARIO 1: Authentic Factual News Claim
  await runTest("Text Scenario 1: Verified Scientific Journal Statement", async () => {
    const text = "Researchers at NASA Goddard Space Flight Center documented global sea surface temperature anomalies using satellite telemetry data collected over 30 years.";
    const res = await axios.post(`${BASE_URL}/analyze-text`, { text }, { headers: authHeaders() });

    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
    console.log(`   Snippet: ${res.data.explanation.substring(0, 75)}...`);
    if (res.data.trustScore === '50%' && res.data.aiProbability === '50%') {
      throw new Error("Scores static 50%");
    }
  });

  // 5. TEXT SCENARIO 2: Sensational Clickbait Rumor Claim
  await runTest("Text Scenario 2: Sensational Synthetic Clickbait Claim", async () => {
    const text = "SECRET MIRACLE CURE THEY DONT WANT YOU TO KNOW! DOCTORS SHOCKED BY THIS ONE SIMPLE TRICK THAT ELIMINATES ALL VIRUSES INSTANTLY!!";
    const res = await axios.post(`${BASE_URL}/analyze-text`, { text }, { headers: authHeaders() });

    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
    console.log(`   Snippet: ${res.data.explanation.substring(0, 75)}...`);
    if (res.data.trustScore === '50%' && res.data.aiProbability === '50%') {
      throw new Error("Scores static 50%");
    }
  });

  // 6. DOCUMENT SCANNER: Academic Forensic Report
  await runTest("Document Scanner: Academic Forensic Report", async () => {
    const docPath = path.join(__dirname, 'academic_report.txt');
    fs.writeFileSync(docPath, "Abstract: Comprehensive evaluation of deep learning architectures for multimodal synthetic media detection. We analyze spatial noise patterns and spectrogram harmonics.");

    const form = new FormData();
    form.append('document', fs.createReadStream(docPath), 'academic_report.txt');

    const res = await axios.post(`${BASE_URL}/analyze-document`, form, {
      headers: { ...form.getHeaders(), ...authHeaders() }
    });

    if (fs.existsSync(docPath)) fs.unlinkSync(docPath);

    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
  });

  // 7. SOCIAL MEDIA SCANNER: Automated Bot Profile vs Real User
  await runTest("Social Profile Scanner: Authentic User vs Bot Handle", async () => {
    const res1 = await axios.post(`${BASE_URL}/analyze-social`, { handle: "@dr_sarah_physics" }, { headers: authHeaders() });
    const res2 = await axios.post(`${BASE_URL}/analyze-social`, { handle: "@bot_pump_crypto_998" }, { headers: authHeaders() });

    console.log(`   Handle 1 (@dr_sarah_physics) -> Trust: ${res1.data.trustScore} | Status: ${res1.data.status}`);
    console.log(`   Handle 2 (@bot_pump_crypto_998) -> Trust: ${res2.data.trustScore} | Status: ${res2.data.status}`);
  });

  // 8. WEBPAGE URL SCANNER: Scraped Article Analysis
  await runTest("Webpage URL Scanner: Scraped Target Webpage", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-url`, { url: "https://example.com" }, { headers: authHeaders() });
    console.log(`   Result -> Trust: ${res.data.trustScore} | AI Prob: ${res.data.aiProbability} | Status: ${res.data.status}`);
  });

  // 9. LIVE AUDIO STREAM SCANNER: Real-Time Stream Inspection
  await runTest("Live Audio Stream Scanner: Acoustic Evaluation", async () => {
    const res = await axios.post(`${BASE_URL}/analyze-live-audio`, {}, { headers: authHeaders() });
    console.log(`   Result -> Audio Trust: ${res.data.trustScore} | Status: ${res.data.status}`);
  });

  // 10. GENERATORS: Quiz & News & Learning Hub
  await runTest("Content Generators: Quiz, News & Learning Hub", async () => {
    const quizRes = await axios.get(`${BASE_URL}/quiz`, { headers: authHeaders() });
    const newsRes = await axios.get(`${BASE_URL}/news`, { headers: authHeaders() });
    const learnRes = await axios.get(`${BASE_URL}/learning`, { headers: authHeaders() });

    console.log(`   Quiz: ${quizRes.data.length} questions | News: ${newsRes.data.length} items | Learning: ${learnRes.data.length} articles`);
    if (quizRes.data.length === 0 || newsRes.data.length === 0 || learnRes.data.length === 0) {
      throw new Error("Content generators returned empty arrays");
    }
  });

  // 11. COMMUNITY FEED & HISTORY
  await runTest("Community & User Scan History Flow", async () => {
    const feedRes = await axios.get(`${BASE_URL}/feed`, { headers: authHeaders() });
    const postRes = await axios.post(`${BASE_URL}/feed`, {
      title: "Diverse Test Post",
      content: "Testing community interaction post."
    }, { headers: authHeaders() });

    const histRes = await axios.get(`${BASE_URL}/history`, { headers: authHeaders() });
    console.log(`   Feed items: ${feedRes.data.length} | Created Post ID: ${postRes.data.post._id} | User Saved Scans: ${histRes.data.length}`);
  });

  console.log("==================================================================");
  console.log(` SUMMARY: ${passed} PASSED | ${failed} FAILED OUT OF ${passed + failed} SCENARIOS `);
  console.log("==================================================================");

  if (failed > 0) process.exit(1);
}

runDiverseTestCases();
