const genAI = require('@google/generative-ai');
require('dotenv').config();

const ai = new genAI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

async function test() {
  try {
    const prompt = `Generate 3 realistic quiz questions for spotting deepfakes/AI.
Return ONLY a raw JSON array of objects without markdown formatting.
Each object must have:
- imageUrl (string, generate a valid url exactly like "https://picsum.photos/seed/[random_word]/800/600" replacing [random_word] with a random 5-letter word)
- isAiGenerated (boolean)
- explanation (string, explaining why it is or isn't AI generated based on typical tells)`;
    
    const result = await model.generateContent(prompt);
    console.log('RAW RESPONSE:');
    console.log(result.response.text());
    
    let rawText = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
    console.log('CLEANED TEXT:');
    console.log(rawText);
    const questions = JSON.parse(rawText);
    console.log('Parsed successfully!', questions.length);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
}
test();
