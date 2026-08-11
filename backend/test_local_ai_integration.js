const axios = require('axios');
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || "http://localhost:5001";

async function runTests() {
  console.log("==================================================");
  console.log("STARTING END-TO-END LOCAL AI INTEGRATION TESTS");
  console.log("Targeting:", LOCAL_AI_URL);
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Text Claim Analysis (/analyze-text)
  try {
    const sampleText = "URGENT MIRACLE CURE DISCOVERED! Doctors don't want you to know this secret pill cures everything in 24 hours!";
    const res = await axios.post(`${LOCAL_AI_URL}/analyze-text`, { text: sampleText });
    console.log("[PASS] /analyze-text (Fake Claim Test)");
    console.log("   -> Result:", JSON.stringify(res.data, null, 2));
    if (res.data.aiProbability && res.data.trustScore && res.data.status && res.data.explanation) passed++;
    else { console.log("   [ERROR] Missing expected Gemini JSON fields!"); failed++; }
  } catch (err) {
    console.log("[FAIL] /analyze-text:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 2: Social Media Bot Scanner (/analyze-social)
  try {
    const res = await axios.post(`${LOCAL_AI_URL}/analyze-social`, { handle: "@crypto_giveaway_bot_9958" });
    console.log("[PASS] /analyze-social (Bot Handle Test)");
    console.log("   -> Result:", JSON.stringify(res.data, null, 2));
    if (res.data.status && res.data.explanation) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /analyze-social:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 3: Document Scanner (/analyze-document)
  try {
    const docText = "This study investigates the statistical properties of multi-layer neural networks applied to natural language verification.";
    const res = await axios.post(`${LOCAL_AI_URL}/analyze-document`, { text: docText });
    console.log("[PASS] /analyze-document (Scientific Text Test)");
    console.log("   -> Result:", JSON.stringify(res.data, null, 2));
    if (res.data.status && res.data.explanation) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /analyze-document:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 4: URL Scanner (/analyze-url)
  try {
    const res = await axios.post(`${LOCAL_AI_URL}/analyze-url`, { url: "https://example.com/news", pageText: "Verified local news report regarding city council election results and municipal budget allocations." });
    console.log("[PASS] /analyze-url (Webpage Scrape Test)");
    console.log("   -> Result:", JSON.stringify(res.data, null, 2));
    if (res.data.status && res.data.explanation) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /analyze-url:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 5: Live Audio Scanner (/analyze-live-audio)
  try {
    const res = await axios.post(`${LOCAL_AI_URL}/analyze-live-audio`, {});
    console.log("[PASS] /analyze-live-audio (Voice Stream Test)");
    console.log("   -> Result:", JSON.stringify(res.data, null, 2));
    if (res.data.status && res.data.explanation) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /analyze-live-audio:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 6: Deepfake Quiz Generator (/quiz)
  try {
    const res = await axios.get(`${LOCAL_AI_URL}/quiz`);
    console.log("[PASS] /quiz (Quiz Generator Test)");
    console.log(`   -> Generated ${res.data.length} quiz questions. Sample Question 1:`, res.data[0].explanation);
    if (Array.isArray(res.data) && res.data.length === 3 && res.data[0].imageUrl) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /quiz:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 7: News Generator (/news)
  try {
    const res = await axios.get(`${LOCAL_AI_URL}/news`);
    console.log("[PASS] /news (News Generator Test)");
    console.log(`   -> Generated ${res.data.length} news items. Sample Headline:`, res.data[0].title);
    if (Array.isArray(res.data) && res.data.length === 5 && res.data[0].title) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /news:", err.message); failed++;
  }
  console.log("--------------------------------------------------");

  // Test 8: Learning Hub Articles (/learning)
  try {
    const res = await axios.get(`${LOCAL_AI_URL}/learning`);
    console.log("[PASS] /learning (Learning Hub Test)");
    console.log(`   -> Generated ${res.data.length} articles. Sample Title:`, res.data[0].title);
    if (Array.isArray(res.data) && res.data.length === 4 && res.data[0].content) passed++;
    else failed++;
  } catch (err) {
    console.log("[FAIL] /learning:", err.message); failed++;
  }
  console.log("==================================================");
  console.log(`FINAL RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
