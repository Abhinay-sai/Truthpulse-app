import 'package:flutter/material.dart';
import '../data/design_system.dart';
import '../data/auth_service.dart';
import 'login_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;
  const ResetPasswordScreen({super.key, required this.email});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _codeController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _codeController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleReset() async {
    if (_codeController.text.trim().isEmpty || _passwordController.text.trim().isEmpty) {
      setState(() => _error = "Please fill in all fields");
      return;
    }

    final pass = _passwordController.text;
    if (pass.length < 6) {
      setState(() => _error = "Password must be at least 6 characters");
      return;
    }
    if (!pass.contains(RegExp(r'[A-Z]'))) {
      setState(() => _error = "Password needs an uppercase letter");
      return;
    }
    if (!pass.contains(RegExp(r'[0-9]'))) {
      setState(() => _error = "Password needs a number");
      return;
    }
    if (!pass.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>]'))) {
      setState(() => _error = "Password needs a special character");
      return;
    }
    
    setState(() {
      _isLoading = true;
      _error = null;
    });
    
    try {
      await AuthService.resetPassword(
        email: widget.email,
        token: _codeController.text.trim(),
        newPassword: _passwordController.text.trim(),
      );
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Password reset successful! Please log in.')),
        );
        Navigator.pushAndRemoveUntil(
          context,
          FigmaPageRoute(child: const LoginScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      extendBodyBehindAppBar: true,
      body: FigmaBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const Icon(
                    Icons.mark_email_read_rounded,
                    size: 80,
                    color: FigmaTheme.neonPurple,
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Check Your Email',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'We sent a 6-digit code to \n${widget.email}',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: FigmaTheme.textMuted,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Colors.redAccent, fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  FigmaGlassCard(
                    padding: const EdgeInsets.all(24),
                    borderRadius: 24,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'Verification Code',
                          style: TextStyle(
                            color: FigmaTheme.textMuted,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _codeController,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
                          decoration: InputDecoration(
                            hintText: '123456',
                            hintStyle: const TextStyle(color: Color(0xFF5A5A7A), fontSize: 15),
                            prefixIcon: const Icon(Icons.pin_rounded, color: FigmaTheme.textMuted, size: 20),
                            filled: true,
                            fillColor: FigmaTheme.spaceInput,
                            contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: FigmaTheme.glassBorder, width: 1.5),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: FigmaTheme.neonPurple, width: 2),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'New Password',
                          style: TextStyle(
                            color: FigmaTheme.textMuted,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
                          decoration: InputDecoration(
                            hintText: '••••••••',
                            hintStyle: const TextStyle(color: Color(0xFF5A5A7A), fontSize: 15),
                            prefixIcon: const Icon(Icons.lock_outline_rounded, color: FigmaTheme.textMuted, size: 20),
                            filled: true,
                            fillColor: FigmaTheme.spaceInput,
                            contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: FigmaTheme.glassBorder, width: 1.5),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14),
                              borderSide: const BorderSide(color: FigmaTheme.neonPurple, width: 2),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        FigmaGradientButton(
                          onPressed: _isLoading ? null : _handleReset,
                          label: 'Reset Password',
                          fullWidth: true,
                          height: 54,
                          icon: _isLoading
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Icon(Icons.check_circle_outline, color: Colors.white, size: 20),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
