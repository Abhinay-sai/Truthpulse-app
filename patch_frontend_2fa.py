import re

# ---------------------------------------------------------
# 1. 2FA SCREEN
# ---------------------------------------------------------
with open('lib/screens/two_factor_auth_screen.dart', 'r') as f:
    content = f.read()

imports = """import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../data/auth_service.dart';
"""
content = content.replace("import 'package:flutter/material.dart';", imports)

logic = """  bool _is2FAEnabled = false;
  String? _qrCodeUrl;
  final TextEditingController _pinController = TextEditingController();

  Future<void> _generate2FA() async {
    try {
      final token = await AuthService.getToken();
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}/auth/2fa/generate'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _qrCodeUrl = data['qrCode'];
        });
      }
    } catch (e) {
      // ignore
    }
  }

  Future<void> _verify2FA() async {
    try {
      final token = await AuthService.getToken();
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}/auth/2fa/verify'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'pin': _pinController.text}),
      );
      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('2FA Successfully Enabled!'), backgroundColor: Colors.green));
          Navigator.pop(context);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid PIN.'), backgroundColor: Colors.red));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  @override"""
content = content.replace("  bool _is2FAEnabled = false;\n\n  @override", logic)

qr_old = """                    Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: const Center(
                        child: Icon(Icons.qr_code_2, size: 180, color: Colors.black),
                      ),
                    ),"""
qr_new = """                    Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Center(
                        child: _qrCodeUrl != null 
                            ? Image.network(_qrCodeUrl!)
                            : const CircularProgressIndicator(color: Colors.purpleAccent),
                      ),
                    ),"""
content = content.replace(qr_old, qr_new)

text_field_old = """                    TextField(
                      keyboardType: TextInputType.number,"""
text_field_new = """                    TextField(
                      controller: _pinController,
                      keyboardType: TextInputType.number,"""
content = content.replace(text_field_old, text_field_new)

onchange_old = """                        onChanged: (val) {
                          setState(() {
                            _is2FAEnabled = val;
                          });
                        },"""
onchange_new = """                        onChanged: (val) {
                          setState(() {
                            _is2FAEnabled = val;
                          });
                          if (val) {
                            _generate2FA();
                          }
                        },"""
content = content.replace(onchange_old, onchange_new)

verify_btn_old = """                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('2FA Successfully Enabled!')));
                          Navigator.pop(context);
                        },"""
verify_btn_new = """                        onPressed: _verify2FA,"""
content = content.replace(verify_btn_old, verify_btn_new)

with open('lib/screens/two_factor_auth_screen.dart', 'w') as f:
    f.write(content)

# ---------------------------------------------------------
# 2. LOGIN SCREEN
# ---------------------------------------------------------
with open('lib/screens/login_screen.dart', 'r') as f:
    content = f.read()

# I am replacing the AuthService.login call. Let's find it.
# Actually I'll patch AuthService.login directly if possible.
print("2FA Screen patched.")
