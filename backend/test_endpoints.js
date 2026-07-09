const axios = require('axios');

async function testEndpoints() {
  try {
    const loginRes = await axios.post('http://localhost:5000/auth/login', {
      email: 'abhinaysai21@gmail.com',
      password: 'Abhi@2024'
    });
    
    let token = '';
    if (loginRes.data.requires2FA) {
      const verifyRes = await axios.post('http://localhost:5000/auth/2fa/login-verify', {
        userId: loginRes.data.userId,
        pin: '000000'
      });
      token = verifyRes.data.token;
    } else {
      token = loginRes.data.token;
    }

    console.log("Token acquired.");
    
    try {
      console.log("Testing /quiz...");
      const quizRes = await axios.get('http://localhost:5000/quiz', { headers: { 'Authorization': `Bearer ${token}` } });
      console.log("Quiz Response:", quizRes.data);
    } catch (err) {
      console.error("Quiz Error:", err.response?.data || err.message);
    }

    try {
      console.log("Testing /learning...");
      const learningRes = await axios.get('http://localhost:5000/learning', { headers: { 'Authorization': `Bearer ${token}` } });
      console.log("Learning Response:", learningRes.data);
    } catch (err) {
      console.error("Learning Error:", err.response?.data || err.message);
    }

  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

testEndpoints();
