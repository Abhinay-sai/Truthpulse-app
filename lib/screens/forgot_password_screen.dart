import 'package:flutter/material.dart';
import '../data/design_system.dart';
import '../data/auth_service.dart';
import 'reset_password_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  final bool _sent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _handleSendResetLink() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) return;
    
    setState(() => _isLoading = true);
    
    try {
      await AuthService.forgotPassword(email);
      
      if (mounted) {
        Navigator.push(
          context,
          FigmaPageRoute(child: ResetPasswordScreen(email: email)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
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
                    Icons.lock_reset_rounded,
                    size: 80,
                    color: FigmaTheme.neonPurple,
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Reset Password',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Enter the email address associated with your account and we\'ll send you a link to reset your password.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: FigmaTheme.textMuted,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  if (_sent)
                    Container()
                  else
                    FigmaGlassCard(
                      padding: const EdgeInsets.all(24),
                      borderRadius: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Email',
                            style: TextStyle(
                              color: FigmaTheme.textMuted,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
                            decoration: InputDecoration(
                              hintText: 'your@email.com',
                              hintStyle: const TextStyle(color: Color(0xFF5A5A7A), fontSize: 15),
                              prefixIcon: const Icon(Icons.mail_outline_rounded, color: FigmaTheme.textMuted, size: 20),
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
                            onPressed: _isLoading ? null : _handleSendResetLink,
                            label: 'Send Reset Link',
                            fullWidth: true,
                            height: 54,
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : const Icon(Icons.send_rounded, color: Colors.white, size: 20),
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
