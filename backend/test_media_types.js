const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const LOCAL_AI_URL = "http://localhost:5000";

async function testMediaTypes() {
  console.log("==================================================");
  console.log("TESTING ALL MEDIA TYPES: PHOTOS, VIDEOS, AUDIO");
  console.log("==================================================\n");

  // 1. Create simulated test files if they don't exist
  fs.writeFileSync('test_photo.jpg', 'fake image bytes');
  fs.writeFileSync('test_video.mp4', 'fake mp4 video bytes stream');
  fs.writeFileSync('test_audio.mp3', 'fake mp3 audio sound bytes');

  const tests = [
    { name: "Photo/Image Upload (.jpg)", file: "test_photo.jpg", mime: "image/jpeg" },
    { name: "Video Upload (.mp4)", file: "test_video.mp4", mime: "video/mp4" },
    { name: "Audio Upload (.mp3)", file: "test_audio.mp3", mime: "audio/mp3" }
  ];

  for (let t of tests) {
    try {
      const form = new FormData();
      form.append('media', fs.createReadStream(t.file), { filename: t.file, contentType: t.mime });
      const res = await axios.post(`${LOCAL_AI_URL}/analyze`, form, { headers: form.getHeaders() });
      console.log(`[PASS] ${t.name}`);
      console.log(`   👉 Status: ${res.data.status} | AI Prob: ${res.data.aiProbability} | Trust: ${res.data.trustScore}`);
      console.log(`   👉 Explanation: "${res.data.explanation}"\n`);
    } catch (err) {
      console.log(`[FAIL] ${t.name}:`, err.message);
    }
  }

  // Clean up
  try {
    fs.unlinkSync('test_photo.jpg');
    fs.unlinkSync('test_video.mp4');
    fs.unlinkSync('test_audio.mp3');
  } catch(e) {}
}

testMediaTypes();
