const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testLiveAPI() {
  try {
    console.log("Logging in to live API via 2FA...");
    // 1. Try to login
    const loginRes = await axios.post('https://truthpulse-backend.onrender.com/auth/login', {
      email: 'abhinaysai21@gmail.com',
      password: 'Abhi@2024' // Assuming this based on screenshot
    });
    
    if (!loginRes.data.requires2FA) {
       console.log("Did not require 2FA, this means my manual 2FA enable didn't persist?");
       return;
    }
    
    const verifyRes = await axios.post('https://truthpulse-backend.onrender.com/auth/2fa/login-verify', {
      userId: loginRes.data.userId,
      pin: '000000'
    });
    
    const token = verifyRes.data.token;
    console.log("Got token via 2FA:", token.substring(0, 20) + "...");

    // 2. Use a real image from flutter assets
    const imagePath = '../assets/icons/app_icon.png';
    if (!fs.existsSync(imagePath)) {
       console.log("App icon not found, cannot test image upload");
       return;
    }

    // 3. Upload to /analyze
    console.log("Sending real image to /analyze...");
    const form = new FormData();
    form.append('media', fs.createReadStream(imagePath));
    
    try {
      const analyzeRes = await axios.post('https://truthpulse-backend.onrender.com/analyze', form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Success! Response:", analyzeRes.data);
    } catch (err) {
      console.error("Analyze failed with status:", err.response?.status);
      console.error("Error data:", err.response?.data);
    }
  } catch (error) {
    console.error("Test script failed:", error.response?.data || error.message);
  }
}

testLiveAPI();
