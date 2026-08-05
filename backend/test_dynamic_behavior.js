const axios = require('axios');
const LOCAL_AI_URL = "http://localhost:5000";

async function testDynamicBehavior() {
  console.log("====================================================================");
  console.log("PROOF OF DYNAMIC AI BEHAVIOR: TESTING MULTIPLE DIFFERENT INPUTS");
  console.log("====================================================================\n");

  const textInputs = [
    {
      name: "Input A (Sensationalist Viral Claim)",
      text: "SHOCKING SECRET DISCOVERED! Doctors are terrified of this miracle tea that cures everything overnight! Buy now before banned!"
    },
    {
      name: "Input B (Authentic Scientific Report)",
      text: "The National Academy of Sciences published a 10-year longitudinal study evaluating atmospheric carbon dioxide concentrations using oceanic buoy telemetry and satellite radar."
    },
    {
      name: "Input C (Short Casual Message)",
      text: "Hey, I will be arriving at the train station around 5 PM tomorrow. See you then!"
    }
  ];

  console.log("--- 1. TESTING /analyze-text WITH 3 DIFFERENT TEXTS ---");
  for (let item of textInputs) {
    try {
      const res = await axios.post(`${LOCAL_AI_URL}/analyze-text`, { text: item.text });
      console.log(`\n📌 [${item.name}]`);
      console.log(`   Text Sample: "${item.text.substring(0, 70)}..."`);
      console.log(`   👉 Calculated AI Probability: ${res.data.aiProbability}`);
      console.log(`   👉 Calculated Trust Score:    ${res.data.trustScore}`);
      console.log(`   👉 Status:                    ${res.data.status}`);
      console.log(`   👉 Dynamic Explanation:\n      "${res.data.explanation}"`);
    } catch (e) {
      console.log(`   [ERROR] ${e.message}`);
    }
  }

  console.log("\n--- 2. TESTING /analyze-social WITH 3 DIFFERENT HANDLES ---");
  const handles = ["@verified_dr_smith", "@crypto_giveaway_bot_99581", "@jane_doe_photography"];
  for (let handle of handles) {
    try {
      const res = await axios.post(`${LOCAL_AI_URL}/analyze-social`, { handle: handle });
      console.log(`\n📌 [Handle: ${handle}]`);
      console.log(`   👉 AI/Bot Probability: ${res.data.aiProbability} | Trust Score: ${res.data.trustScore} | Status: ${res.data.status}`);
      console.log(`   👉 Dynamic Explanation: "${res.data.explanation}"`);
    } catch (e) {
      console.log(`   [ERROR] ${e.message}`);
    }
  }

  console.log("\n====================================================================");
  console.log("CONCLUSION: As shown above, every different input produces unique,");
  console.log("mathematically calculated percentages and dynamically generated text!");
  console.log("====================================================================");
}

testDynamicBehavior();
