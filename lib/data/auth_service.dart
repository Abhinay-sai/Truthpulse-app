import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// ============================================================
// AUTH SERVICE — connects to Node.js /auth/* endpoints
// ============================================================

class AuthService {
  // Live backend URL on Render
  static String get baseUrl => 'https://abhinay-truthpulse-server.onrender.com';

  static const _tokenKey = 'auth_token';
  static const _userKey = 'auth_user';

  // ─── Token Storage ───────────────────────────────────────

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user));
  }

  static Future<Map<String, dynamic>?> getSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_userKey);
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // ─── Register ────────────────────────────────────────────

  /// Returns nothing on success (OTP sent). Throws AuthException on failure.
  static Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/auth/register'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'name': name.trim(),
            'email': email.trim().toLowerCase(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 15));

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode != 201) {
      throw AuthException(data['error'] ?? 'Registration failed');
    }
  }

  // ─── Verify Email ────────────────────────────────────────

  /// Returns the user map on success, throws AuthException on failure.
  static Future<Map<String, dynamic>> verifyEmail({
    required String email,
    required String otp,
  }) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/auth/verify-email'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'otp': otp.trim(),
          }),
        )
        .timeout(const Duration(seconds: 15));

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200) {
      await saveToken(data['token'] as String);
      await saveUser(data['user'] as Map<String, dynamic>);
      return data['user'] as Map<String, dynamic>;
    } else {
      throw AuthException(data['error'] ?? 'Verification failed');
    }
  }

  // ─── Resend Verification ─────────────────────────────────

  static Future<void> resendVerification(String email) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/auth/resend-verification'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'email': email.trim().toLowerCase()}),
        )
        .timeout(const Duration(seconds: 15));

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw AuthException(data['error'] ?? 'Failed to resend verification code');
    }
  }

  // ─── Login ───────────────────────────────────────────────

  /// Returns the user map on success, throws AuthException on failure.
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http
        .post(
          Uri.parse('$baseUrl/auth/login'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 15));

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200) {
      if (data['requires2FA'] == true) {
        return { 'requires2FA': true, 'userId': data['userId'] };
      }
      await saveToken(data['token'] as String);
      await saveUser(data['user'] as Map<String, dynamic>);
      return data['user'] as Map<String, dynamic>;
    } else {
      throw AuthException(data['error'] ?? 'Login failed');
    }
  }

  // ─── Get Current User ────────────────────────────────────

  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final token = await getToken();
    if (token == null) return null;

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return data['user'] as Map<String, dynamic>;
      } else {
        // Token expired or invalid — clear session
        await clearSession();
        return null;
      }
    } catch (_) {
      // Network error — return cached user if available
      return await getSavedUser();
    }
  }

  // ─── Forgot Password ──────────────────────────────────────
  static Future<void> forgotPassword(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/forgot-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email.trim().toLowerCase()}),
    ).timeout(const Duration(seconds: 15));

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw AuthException(data['error'] ?? 'Failed to send reset link');
    }
  }

  // ─── Reset Password ───────────────────────────────────────
  static Future<void> resetPassword({
    required String email,
    required String token,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/reset-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email.trim().toLowerCase(),
        'token': token.trim(),
        'newPassword': newPassword,
      }),
    ).timeout(const Duration(seconds: 15));

    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw AuthException(data['error'] ?? 'Failed to reset password');
    }
  }

  // ─── Logout ──────────────────────────────────────────────

  static Future<void> logout() async {
    await clearSession();
  }
}

// ─── Custom Exception ─────────────────────────────────────

class AuthException implements Exception {
  final String message;
  AuthException(this.message);

  @override
  String toString() => message;
}
