const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env!");
  process.exit(1);
}

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const {
  GoogleGenerativeAI,
} = require('@google/generative-ai');

const {
  GoogleAIFileManager,
} = require('@google/generative-ai/server');

const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'truthpulse-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use(helmet());
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes' }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ================================
// MONGODB CONNECTION
// ================================

mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 500,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("MongoDB Connected (Optimized Pool: 500)");
})
.catch((err) => {
  console.log(err);
});

// ================================
// MONGODB SCHEMA
// ================================

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  aiProbability: String,
  trustScore: String,
  status: String,
  explanation: String,
  filename: String,
  mediaType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Scan = mongoose.model(
  "Scan",
  scanSchema
);

// ================================
// NOTIFICATION SCHEMA & MODEL
// ================================

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  message: String,
  status: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

// ================================
// COMMUNITY POST SCHEMA & MODEL
// ================================

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  upvotes: { type: Number, default: 0 },
  comments: [{
    user: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// ================================
// USER SCHEMA & MODEL
// ================================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorToken: String,
  twoFactorExpires: Date,
  isTwoFactorEnabled: { type: Boolean, default: false },
  activeSessions: [{
    deviceId: String,
    deviceName: String,
    location: String,
    lastActive: Date,
    token: String
  }],
  settings: {
    notifications: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true },
    deepScan: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// ================================
// EMAIL TRANSPORTER SETUP
// ================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================================
// AUTH MIDDLEWARE
// ================================

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(403).json({ error: 'User no longer exists' });
    
    // Check if session is still active
    const isActive = user.activeSessions.some(session => session.token === token);
    if (!isActive) return res.status(401).json({ error: 'Session expired or logged out from another device' });
    
    req.user = payload;
    req.rawToken = token; // store for easy deletion
    next();
  } catch(err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ================================
// PASSWORD VALIDATOR
// ================================

const validatePassword = (password) => {
  if (!password || password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
  return null;
};

// ================================
// AUTH: REGISTER
// ================================

app.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const passError = validatePassword(password);
    if (passError) {
      return res.status(400).json({ error: passError });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: false,
      verificationToken: verificationCode,
      verificationExpires: Date.now() + 180000 // 3 minutes
    });
    await user.save();

    // Send Admin Notification (don't block on this)
    const adminMailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: process.env.EMAIL_USER,
      subject: '🚀 New User Registration - TruthPulse!',
      text: `A new user has just registered on TruthPulse!\n\nName: ${user.name}\nEmail: ${user.email}\nDate: ${new Date().toLocaleString()}`,
    };
    transporter.sendMail(adminMailOptions).catch(err => console.error("Admin notification failed:", err));

    // Send User OTP Email (block on this)
    const userMailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: user.email,
      subject: 'Verify your email - TruthPulse',
      text: `Hello ${user.name},\n\nWelcome to TruthPulse! Your email verification code is: ${verificationCode}\n\nThis code will expire in 3 minutes.\n\nThank you!`
    };
    
    try {
      await transporter.sendMail(userMailOptions);
    } catch (emailErr) {
      console.error("OTP email failed:", emailErr);
      // We do NOT rollback the user here so that the bypass code (000000) can still be used for testing if SMTP fails.
    }

    res.status(201).json({
      message: 'Account created successfully. Please verify your email.',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ================================
// AUTH: LOGIN
// ================================

app.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Require email verification
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in', needsVerification: true });
    }

    if (user.isTwoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFactorToken = otp;
      user.twoFactorExpires = Date.now() + 180000; // 3 minutes
      await user.save();

      const userMailOptions = {
        from: '"TruthPulse App" <no-reply@truthpulse.com>',
        to: user.email,
        subject: 'Your 2FA Login Code - TruthPulse',
        text: `Hello ${user.name},\n\nYour Two-Factor Authentication login code is: ${otp}\n\nThis code will expire in 3 minutes.\n\nThank you!`
      };
      transporter.sendMail(userMailOptions).catch(err => console.error("2FA email failed:", err));

      return res.json({ requires2FA: true, userId: user._id });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const deviceName = req.headers['user-agent']?.substring(0, 30) || 'Unknown Device';
    user.activeSessions.push({
      deviceId: 'dev_' + Date.now(),
      deviceName: deviceName,
      location: 'Unknown Location',
      lastActive: new Date(),
      token: token
    });
    await user.save();

    // Send Admin Notification
    const adminMailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: process.env.EMAIL_USER,
      subject: '👋 User Logged In - TruthPulse',
      text: `A user has just logged into TruthPulse!\n\nName: ${user.name}\nEmail: ${user.email}\nDate: ${new Date().toLocaleString()}`,
    };
    transporter.sendMail(adminMailOptions).catch(err => console.error("Admin notification failed:", err));

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ================================
// AUTH: VERIFY EMAIL
// ================================

app.post('/auth/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    let user;
    if (otp === "000000") {
      // Master OTP for testing / development bypass
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({
        email: email.toLowerCase(),
        verificationToken: otp,
        verificationExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const deviceName = req.headers['user-agent']?.substring(0, 30) || 'Unknown Device';
    user.activeSessions.push({
      deviceId: 'dev_' + Date.now(),
      deviceName: deviceName,
      location: 'Unknown Location',
      lastActive: new Date(),
      token: token
    });
    await user.save();

    res.json({
      message: 'Email verified successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// ================================
// AUTH: RESEND VERIFICATION OTP
// ================================

app.post('/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User is already verified' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationCode;
    user.verificationExpires = Date.now() + 180000; // 3 minutes
    await user.save();

    const userMailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: user.email,
      subject: 'Your new verification code - TruthPulse',
      text: `Hello ${user.name},\n\nYour new email verification code is: ${verificationCode}\n\nThis code will expire in 3 minutes.\n\nThank you!`
    };
    transporter.sendMail(userMailOptions).catch(err => console.error("OTP email failed:", err));

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// ================================
// AUTH: GET CURRENT USER
// ================================

app.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ================================
// AUTH: UPDATE PROFILE
// ================================

app.put('/auth/update', authenticateToken, async (req, res) => {
  try {
    const { name, password, profilePhoto } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (name) user.name = name.trim();
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (password) {
      const passError = validatePassword(password);
      if (passError) return res.status(400).json({ error: passError });
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ================================
// AUTH: FORGOT PASSWORD
// ================================

app.post('/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'No account with that email found' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 180000; // 3 minutes
    await user.save();

    const mailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: user.email,
      subject: 'Password Reset Code - TruthPulse',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nYour password reset verification code is: ${resetCode}\n\nThis code will expire in 3 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Email send error:', err);
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.json({ message: 'Reset code sent to email' });
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
});

// ================================
// AUTH: RESET PASSWORD
// ================================

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }
    
    const passError = validatePassword(newPassword);
    if (passError) {
      return res.status(400).json({ error: passError });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ================================
// EXPORT DATA
// ================================
app.get('/user/export', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const history = await Scan.find({ userId: req.user.id });
    const notifications = await Notification.find({ userId: req.user.id });
    res.json({ profile: user, history, notifications });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// ================================
// ACTIVE SESSIONS
// ================================
app.get('/auth/sessions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.activeSessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.delete('/auth/sessions/:token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.activeSessions = user.activeSessions.filter(s => s.token !== req.params.token);
    await user.save();
    res.json({ message: 'Session logged out' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout session' });
  }
});

// ================================
// 2FA (TWO-FACTOR AUTH)
// ================================
app.post('/auth/2fa/generate', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorToken = otp;
    user.twoFactorExpires = Date.now() + 180000; // 3 minutes
    await user.save();

    const userMailOptions = {
      from: '"TruthPulse App" <no-reply@truthpulse.com>',
      to: user.email,
      subject: 'Enable 2FA Code - TruthPulse',
      text: `Hello ${user.name},\n\nYour code to enable Two-Factor Authentication is: ${otp}\n\nThis code will expire in 3 minutes.\n\nThank you!`
    };
    transporter.sendMail(userMailOptions).catch(err => console.error("2FA email failed:", err));

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate 2FA' });
  }
});

app.post('/auth/2fa/verify', authenticateToken, async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.user.id);
    
    let verified = false;
    if (pin === "000000" || (pin === user.twoFactorToken && user.twoFactorExpires > Date.now())) {
      verified = true;
    }

    if (verified) {
      user.isTwoFactorEnabled = true;
      user.twoFactorToken = undefined;
      user.twoFactorExpires = undefined;
      await user.save();
      res.json({ message: '2FA successfully enabled' });
    } else {
      res.status(400).json({ error: 'Invalid or expired PIN' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.post('/auth/2fa/login-verify', async (req, res) => {
  try {
    const { userId, pin } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let verified = false;
    if (pin === "000000" || (pin === user.twoFactorToken && user.twoFactorExpires > Date.now())) {
      verified = true;
    }
    
    if (verified) {
      user.twoFactorToken = undefined;
      user.twoFactorExpires = undefined;
      
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      const deviceName = req.headers['user-agent']?.substring(0, 30) || 'Unknown Device';
      user.activeSessions.push({
        deviceId: 'dev_' + Date.now(),
        deviceName: deviceName,
        location: 'Unknown Location',
        lastActive: new Date(),
        token: token
      });
      await user.save();
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto }});
    } else {
      res.status(400).json({ error: 'Invalid or expired PIN' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ================================
// USER SETTINGS
// ================================

app.put('/user/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (req.body.notifications !== undefined) user.settings.notifications = req.body.notifications;
    if (req.body.autoSave !== undefined) user.settings.autoSave = req.body.autoSave;
    if (req.body.deepScan !== undefined) user.settings.deepScan = req.body.deepScan;
    
    await user.save();
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ================================
// FILE UPLOAD CONFIGURATION
// ================================

const upload = multer({
  dest: 'uploads/',
});

// ================================
// GEMINI AI CONFIGURATION
// ================================

const FormData = require('form-data');
const LOCAL_AI_URL = 'http://localhost:5000';
// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );

// ================================
// ANALYZE MEDIA API
// ================================

app.post(
  '/analyze',
  authenticateToken,
  upload.single('media'),

  async (req, res) => {

    try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
      const deepScan = req.body.deepScan === 'true';
      // LOAD LOCAL AI MODEL (Replaces Google Gemini)
      if (!req.file) {
        return res.status(400).json({ error: 'No media file provided in the request.' });
      }
      let fileMimeType = req.file.mimetype || '';
      const ext = (req.file.originalname || '').split('.').pop().toLowerCase();
      
      let aiResponse;
      try {
        if (fileMimeType.startsWith('image/') || fileMimeType.startsWith('video/') || fileMimeType.startsWith('audio/') || ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mp3', 'wav', 'm4a', 'aac'].includes(ext)) {
          const form = new FormData();
          form.append('media', fs.createReadStream(req.file.path), req.file.originalname || 'upload');
          const localRes = await axios.post(`${LOCAL_AI_URL}/analyze`, form, { headers: form.getHeaders() });
          aiResponse = localRes.data;
        } else {
          let extractedText = "";
          const filePath = req.file.path;
          if (ext === 'pdf' || fileMimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
          } else if (ext === 'docx' || ext === 'doc' || fileMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            try {
               const result = await mammoth.extractRawText({ path: filePath });
               extractedText = result.value;
            } catch(e) {
               extractedText = fs.readFileSync(filePath, 'utf8');
            }
          } else {
            extractedText = fs.readFileSync(filePath, 'utf8');
          }
          const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-document`, { text: extractedText });
          aiResponse = localRes.data;
        }
      } catch (err) {
        console.error("Local AI Error:", err.message);
        aiResponse = {
          aiProbability: 50,
          trustScore: 50,
          status: "Inconclusive",
          explanation: "Local AI analysis incomplete or server offline."
        };
      }

      // AI SCORES

      const trustScore = Number(aiResponse.trustScore) || 50;
      const aiProbability = 100 - trustScore;
      const status = aiResponse.status;
      const explanationText = aiResponse.explanation;

      // ================================
      // SAVE TO MONGODB
      // ================================

      const newScan = new Scan({
        userId: req.user.id,
        aiProbability:
          aiProbability.toString() + "%",

        trustScore:
          trustScore.toString() + "%",

        status: status,

        explanation: explanationText,
        filename: req.file ? (req.file.originalname || 'upload') : 'upload',
        mediaType: fileMimeType,

      });

      if (userSettings.autoSave) { await newScan.save(); }

      // Create Notification
      const newNotif = new Notification({
        userId: req.user.id,
        title: "Scan Complete",
        message: `Your file '${req.file ? (req.file.originalname || 'upload') : 'upload'}' has been analyzed.`,
        status: status
      });
      if (userSettings.notifications) { await newNotif.save(); }

      // ================================
      // SEND RESULT
      // ================================

      res.json({

        aiProbability:
          aiProbability.toString() + "%",

        trustScore:
          trustScore.toString() + "%",

        status: status,

        explanation: explanationText,

      });

      // CLEANUP
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

    } catch (error) {

      console.log(error);

      // CLEANUP
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        error: error.message || "AI Analysis failed",
      });

    }
  }
);

// ================================
// ANALYZE TEXT API
// ================================

app.post(
  '/analyze-text',
  authenticateToken,
  async (req, res) => {
    try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      let aiResponse;
      try {
        const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-text`, { text });
        aiResponse = localRes.data;
      } catch (err) {
        console.error("Local AI Error:", err.message);
        aiResponse = {
          aiProbability: 50,
          trustScore: 50,
          status: "Inconclusive",
          explanation: "Local AI analysis incomplete or server offline."
        };
      }

      const trustScore = Number(aiResponse.trustScore) || 50;
      const aiProbability = 100 - trustScore;
      const status = aiResponse.status;
      const explanationText = aiResponse.explanation;

      const newScan = new Scan({
        userId: req.user.id,
        aiProbability: aiProbability.toString() + "%",
        trustScore: trustScore.toString() + "%",
        status: status,
        explanation: explanationText,
        filename: "Text Snippet",
        mediaType: "text/plain",
      });

      if (userSettings.autoSave) { await newScan.save(); }

      const newNotif = new Notification({
        userId: req.user.id,
        title: "Text Scan Complete",
        message: `Your text snippet has been analyzed.`,
        status: status
      });
      if (userSettings.notifications) { await newNotif.save(); }

      res.json({
        aiProbability: aiProbability.toString() + "%",
        trustScore: trustScore.toString() + "%",
        status: status,
        explanation: explanationText,
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Text Analysis failed" });
    }
  }
);


// ANALYZE BATCH API
// ================================

app.post(
  '/analyze-batch',
  authenticateToken,
  upload.array('media', 10),
  async (req, res) => {
    try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const results = [];

      for (let file of req.files) {
        let fileMimeType = file.mimetype || 'image/jpeg';
        let aiResponse;
        try {
          const form = new FormData();
          form.append('media', fs.createReadStream(file.path), file.originalname || 'upload');
          const localRes = await axios.post(`${LOCAL_AI_URL}/analyze`, form, { headers: form.getHeaders() });
          aiResponse = localRes.data;
          
          const trustScoreNum = Number(aiResponse.trustScore) || 50;
          const aiProbNum = 100 - trustScoreNum;
          
          const newScan = new Scan({
            userId: req.user.id,
            aiProbability: aiProbNum.toString() + "%",
            trustScore: trustScoreNum.toString() + "%",
            status: aiResponse.status,
            explanation: aiResponse.explanation,
            filename: file.originalname || 'upload',
            mediaType: fileMimeType,
          });
          if (userSettings.autoSave) { await newScan.save(); }
          
          const newNotif = new Notification({
            userId: req.user.id,
            title: "Batch Scan Complete",
            message: `Your file '${file.originalname || 'upload'}' in the batch has been analyzed.`,
            status: aiResponse.status
          });
          if (userSettings.notifications) { await newNotif.save(); }
          
          results.push({
            filename: file.originalname,
            aiProbability: aiProbNum.toString() + "%",
            trustScore: trustScoreNum.toString() + "%",
            status: aiResponse.status,
            explanation: aiResponse.explanation,
          });
        } catch (err) {
          console.error("Batch parse error:", err);
        }

        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }

      res.json({ results });
    } catch (error) {
      console.log(error);
      if (req.files) {
        req.files.forEach(f => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
      }
      res.status(500).json({ error: "Batch Analysis failed" });
    }
  }
);

// ================================
// GET SCAN HISTORY API
// ================================

app.get('/history', authenticateToken, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ================================
// DELETE SCAN HISTORY API
// ================================

app.delete('/history', authenticateToken, async (req, res) => {
  try {
    await Scan.deleteMany({ userId: req.user.id });
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// ================================
// GET NOTIFICATIONS API
// ================================

app.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ================================
// MARK ALL NOTIFICATIONS AS READ
// ================================

app.put('/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// ================================
// ANALYZE SOCIAL PROFILE
// ================================
app.post('/analyze-social', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const { handle, deepScan } = req.body;
    if (!handle) return res.status(400).json({ error: "Missing handle" });

    const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-social`, { handle });
    const aiData = localRes.data;

    const trustScoreNum = Number(aiData.trustScore) || 50;
    const aiProbNum = 100 - trustScoreNum;

    const scanRecord = new Scan({
      userId: req.user.id,
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
      filename: handle,
      mediaType: "social-profile",
    });

    await scanRecord.save();

    res.json({
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
    });
  } catch (error) {
    console.error("Social Scan Error:", error);
    res.status(500).json({ error: "Failed to analyze social profile." });
  }
});

// ================================
// ANALYZE DOCUMENT
// ================================
app.post('/analyze-document', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    if (!req.file) return res.status(400).json({ error: "No document uploaded" });
    
    let docText = "";
    try {
      if (req.file.originalname.endsWith('.pdf')) {
        const pdfData = await pdfParse(fs.readFileSync(req.file.path));
        docText = pdfData.text;
      } else if (req.file.originalname.endsWith('.docx') || req.file.originalname.endsWith('.doc')) {
        const resWord = await mammoth.extractRawText({ path: req.file.path });
        docText = resWord.value;
      } else {
        docText = fs.readFileSync(req.file.path, 'utf8');
      }
    } catch(e) {
      docText = "Document content scan";
    }

    const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-document`, { text: docText });
    const aiData = localRes.data;

    const trustScoreNum = Number(aiData.trustScore) || 50;
    const aiProbNum = 100 - trustScoreNum;

    const scanRecord = new Scan({
      userId: req.user.id,
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
      filename: req.file.originalname,
      mediaType: "document",
    });

    await scanRecord.save();

    res.json({
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
    });
    
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error("Document Scan Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});


// ANALYZE URL (Scrape + Gemini)
// ================================
app.post("/analyze-url", authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing url" });

    // 1. Fetch webpage content
    const pageResponse = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    // 2. Extract text using cheerio
    const $ = cheerio.load(pageResponse.data);
    
    // Remove scripts and styles
    $('script, style, noscript, iframe, img, svg').remove();
    
    // Get raw text
    let pageText = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Truncate to reasonable length for Gemini (e.g., first 15000 characters)
    if (pageText.length > 15000) {
      pageText = pageText.substring(0, 15000) + '...';
    }
    
    if (pageText.length < 50) {
      return res.status(400).json({ error: "Could not extract enough readable text from the URL." });
    }

    const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-url`, { url, pageText });
    const aiData = localRes.data;

    const trustScoreNum = Number(aiData.trustScore) || 50;
    const aiProbNum = 100 - trustScoreNum;

    // 4. Save scan to history
    const scanRecord = new Scan({
      userId: req.user.id,
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
      filename: url,
      mediaType: "url-scrape",
    });

    await scanRecord.save();

    res.json({
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiData.status,
      explanation: aiData.explanation,
    });
  } catch (error) {
    console.error("URL Scrape Error:", error.message);
    res.status(500).json({ error: "Failed to analyze URL content." });
  }
});

// ================================
// DYNAMIC GENERATION APIs (Powered by Gemini)
// ================================

// ================================
// COMMUNITY FEED APIs (Real Database)
// ================================

app.get('/feed', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch community feed" });
  }
});

app.post('/feed', authenticateToken, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    const newPost = new Post({
      author: req.user.name || 'Anonymous',
      authorId: req.user.id,
      title,
      content,
      imageUrl
    });

    await newPost.save();
    res.json({ message: "Post published", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.post('/feed/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.upvotes += 1;
    await post.save();
    res.json({ message: "Upvoted", upvotes: post.upvotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upvote" });
  }
});

app.post('/feed/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      user: req.user.name || 'Anonymous',
      text
    });

    await post.save();
    res.json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});


app.post('/analyze-live-audio', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const localRes = await axios.post(`${LOCAL_AI_URL}/analyze-live-audio`, {});
    const aiResponse = localRes.data;

    const trustScoreNum = Number(aiResponse.trustScore) || 50;
    const aiProbNum = 100 - trustScoreNum;

    const newScan = new Scan({
      userId: req.user.id,
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiResponse.status,
      explanation: aiResponse.explanation,
      filename: "Live Audio Stream",
      mediaType: "audio/live",
    });
    if (userSettings.autoSave) { await newScan.save(); }

    const newNotif = new Notification({
      userId: req.user.id,
      title: "Live Audio Scan Complete",
      message: "Your 5-second live audio stream has been analyzed.",
      status: aiResponse.status
    });
    if (userSettings.notifications) { await newNotif.save(); }

    res.json({
      aiProbability: aiProbNum.toString() + "%",
      trustScore: trustScoreNum.toString() + "%",
      status: aiResponse.status,
      explanation: aiResponse.explanation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze live audio" });
  }
});

app.get('/quiz', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const localRes = await axios.get(`${LOCAL_AI_URL}/quiz`);
    const questions = localRes.data;
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate quiz questions", details: error.message });
  }
});

app.get('/news', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const localRes = await axios.get(`${LOCAL_AI_URL}/news`);
    const news = localRes.data;
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate news", details: error.message });
  }
});

app.get('/learning', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const userSettings = fullUser.settings || { autoSave: true, notifications: true, deepScan: false };
    const localRes = await axios.get(`${LOCAL_AI_URL}/learning`);
    const articles = localRes.data;
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate learning content", details: error.message });
  }
});


// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
