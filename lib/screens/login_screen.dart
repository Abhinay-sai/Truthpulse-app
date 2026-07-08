// ignore_for_file: use_build_context_synchronously
import 'package:flutter/material.dart';
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'dashboard_screen.dart';
import 'signup_screen.dart';
import 'forgot_password_screen.dart';
import 'email_verification_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  late AnimationController _shieldController;
  late Animation<double> _shieldPulse;

  @override
  void initState() {
    super.initState();
    _shieldController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _shieldPulse = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _shieldController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _shieldController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await AuthService.login(
        email: _emailController.text,
        password: _passwordController.text,
      );

      if (mounted) {
        if (result['requires2FA'] == true) {
          _show2FADialog(result['userId']);
          return;
        }

        Navigator.pushReplacement(
          context,
          FigmaPageRoute(child: const DashboardScreen()),
        );
      }
    } on AuthException catch (e) {
      if (e.message.contains("verify your email") || e.message.contains("Please verify your email before logging in")) {
        if (mounted) {
          Navigator.pushReplacement(
            context,
            FigmaPageRoute(
              child: EmailVerificationScreen(email: _emailController.text.trim()),
            ),
          );
        }
      } else {
        setState(() => _errorMessage = e.message);
      }
    } catch (e) {
      setState(() =>
          _errorMessage = 'Could not connect to server. Check your connection.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _show2FADialog(String userId) {
    final TextEditingController pinController = TextEditingController();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF150530),
          title: const Text("Two-Factor Authentication", style: TextStyle(color: Colors.white)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text("An OTP has been sent to your email.", style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 16),
              TextField(
                controller: pinController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                style: const TextStyle(color: Colors.white, letterSpacing: 8, fontSize: 20),
                decoration: const InputDecoration(
                  hintText: "Enter 6-digit OTP",
                  hintStyle: TextStyle(color: Colors.white38),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel", style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.purpleAccent),
              onPressed: () async {
                try {
                  await AuthService.verifyLogin2FA(userId, pinController.text);
                  if (!mounted) return;
                  Navigator.pop(context); // close dialog
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const DashboardScreen()),
                    (route) => false,
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                }
              },
              child: const Text("Verify", style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FigmaBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const SizedBox(height: 40),

                    // ── ANIMATED SHIELD ──────────────────────────────
                    AnimatedBuilder(
                      animation: _shieldPulse,
                      builder: (_, child) => Transform.scale(
                        scale: _shieldPulse.value,
                        child: child,
                      ),
                      child: Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              FigmaTheme.neonPurple.withValues(alpha: 0.3),
                              Colors.transparent,
                            ],
                          ),
                          boxShadow: FigmaTheme.purpleGlow(
                              radius: 30, opacity: 0.4),
                        ),
                        child: const Icon(
                          Icons.shield_rounded,
                          size: 56,
                          color: FigmaTheme.neonPurple,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── TITLE ──────────────────────────────────────────
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [FigmaTheme.neonPurple, FigmaTheme.neonBlue],
                      ).createShader(b),
                      child: const Text(
                        'Welcome Back',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 34,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),

                    const SizedBox(height: 6),

                    const Text(
                      'Sign in to continue to TruthPulse',
                      style: TextStyle(
                          color: FigmaTheme.textMuted, fontSize: 15),
                    ),

                    const SizedBox(height: 32),

                    // ── ERROR BANNER ──────────────────────────────────
                    if (_errorMessage != null)
                      Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: FigmaTheme.danger.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: FigmaTheme.danger.withValues(alpha: 0.5),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded,
                                color: FigmaTheme.danger, size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(
                                  color: FigmaTheme.danger,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                    // ── GLASS FORM CARD ───────────────────────────────
                    FigmaGlassCard(
                      padding: const EdgeInsets.all(24),
                      borderRadius: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Email field
                          _buildLabel('Email'),
                          const SizedBox(height: 8),
                          _EmailField(controller: _emailController),

                          const SizedBox(height: 20),

                          // Password field
                          _buildLabel('Password'),
                          const SizedBox(height: 8),
                          _PasswordField(
                            controller: _passwordController,
                            obscure: _obscurePassword,
                            onToggle: () => setState(
                                () => _obscurePassword = !_obscurePassword),
                          ),

                          const SizedBox(height: 10),

                          // Forgot password
                          Align(
                            alignment: Alignment.centerRight,
                            child: GestureDetector(
                              onTap: () => Navigator.push(
                                context,
                                FigmaPageRoute(child: const ForgotPasswordScreen()),
                              ),
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: FigmaTheme.neonPurple,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Sign In button
                          FigmaGradientButton(
                            onPressed: _isLoading ? null : _handleLogin,
                            label: 'Sign In',
                            fullWidth: true,
                            height: 54,
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white),
                                  )
                                : const Icon(Icons.login_rounded,
                                    color: Colors.white, size: 20),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    // ── SIGN UP LINK ──────────────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Don't have an account? ",
                          style: TextStyle(
                              color: FigmaTheme.textMuted, fontSize: 15),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.push(
                            context,
                            FigmaPageRoute(child: const SignupScreen()),
                          ),
                          child: const Text(
                            'Create Account',
                            style: TextStyle(
                              color: FigmaTheme.neonPurple,
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) => Text(
        text,
        style: const TextStyle(
          color: FigmaTheme.textMuted,
          fontSize: 13,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.3,
        ),
      );
}

// ─── Email Field ──────────────────────────────────────────

class _EmailField extends StatefulWidget {
  final TextEditingController controller;
  const _EmailField({required this.controller});

  @override
  State<_EmailField> createState() => _EmailFieldState();
}

class _EmailFieldState extends State<_EmailField> {
  final _focus = FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() => _focused = _focus.hasFocus));
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        boxShadow: _focused
            ? FigmaTheme.purpleGlow(radius: 8, opacity: 0.3)
            : null,
      ),
      child: TextFormField(
        controller: widget.controller,
        focusNode: _focus,
        keyboardType: TextInputType.emailAddress,
        style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
        validator: (v) {
          if (v == null || v.trim().isEmpty) return 'Email is required';
          if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(v.trim())) {
            return 'Enter a valid email address';
          }
          return null;
        },
        decoration: _inputDecoration(
          hint: 'your@email.com',
          icon: Icons.mail_outline_rounded,
          focused: _focused,
        ),
      ),
    );
  }
}

// ─── Password Field ───────────────────────────────────────

class _PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final bool obscure;
  final VoidCallback onToggle;

  const _PasswordField({
    required this.controller,
    required this.obscure,
    required this.onToggle,
  });

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  final _focus = FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() => _focused = _focus.hasFocus));
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        boxShadow: _focused
            ? FigmaTheme.purpleGlow(radius: 8, opacity: 0.3)
            : null,
      ),
      child: TextFormField(
        controller: widget.controller,
        focusNode: _focus,
        obscureText: widget.obscure,
        style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
        validator: (v) {
          if (v == null || v.isEmpty) return 'Password is required';
          return null;
        },
        decoration: _inputDecoration(
          hint: 'Enter your password',
          icon: Icons.lock_outline_rounded,
          focused: _focused,
          suffix: GestureDetector(
            onTap: widget.onToggle,
            child: Icon(
              widget.obscure
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              color: FigmaTheme.textMuted,
              size: 20,
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Shared InputDecoration factory ──────────────────────

InputDecoration _inputDecoration({
  required String hint,
  required IconData icon,
  required bool focused,
  Widget? suffix,
}) =>
    InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(
          color: Color(0xFF5A5A7A), fontSize: 15),
      prefixIcon: Icon(
        icon,
        color: focused ? FigmaTheme.neonPurple : FigmaTheme.textMuted,
        size: 20,
      ),
      suffixIcon: suffix,
      filled: true,
      fillColor: FigmaTheme.spaceInput,
      contentPadding:
          const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: FigmaTheme.glassBorder, width: 1.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide:
            const BorderSide(color: FigmaTheme.neonPurple, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide:
            const BorderSide(color: FigmaTheme.danger, width: 1.5),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: FigmaTheme.danger, width: 2),
      ),
      errorStyle: const TextStyle(
          color: FigmaTheme.danger, fontSize: 12),
    );
