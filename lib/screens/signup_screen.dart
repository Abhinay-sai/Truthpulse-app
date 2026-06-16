import 'package:flutter/material.dart';
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'dashboard_screen.dart';
import 'email_verification_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
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
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await AuthService.register(
        name: _nameController.text,
        email: _emailController.text,
        password: _passwordController.text,
      );

      if (mounted) {
        // Navigate to Email Verification screen after successful signup
        Navigator.pushReplacement(
          context,
          FigmaPageRoute(
            child: EmailVerificationScreen(email: _emailController.text.trim()),
          ),
        );
      }
    } on AuthException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() =>
          _errorMessage = 'Could not connect to server. Check your connection.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
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
                    const SizedBox(height: 20),

                    // ── ANIMATED SHIELD ──────────────────────────────
                    AnimatedBuilder(
                      animation: _shieldPulse,
                      builder: (_, child) => Transform.scale(
                        scale: _shieldPulse.value,
                        child: child,
                      ),
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              FigmaTheme.neonBlue.withValues(alpha: 0.3),
                              Colors.transparent,
                            ],
                          ),
                          boxShadow: FigmaTheme.purpleGlow(
                              radius: 30, opacity: 0.4),
                        ),
                        child: const Icon(
                          Icons.person_add_rounded,
                          size: 40,
                          color: FigmaTheme.neonBlue,
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // ── TITLE ──────────────────────────────────────────
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [FigmaTheme.neonBlue, FigmaTheme.neonPurple],
                      ).createShader(b),
                      child: const Text(
                        'Create Account',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),

                    const SizedBox(height: 6),

                    const Text(
                      'Join TruthPulse today',
                      style: TextStyle(
                          color: FigmaTheme.textMuted, fontSize: 15),
                    ),

                    const SizedBox(height: 24),

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
                          // Name field
                          _buildLabel('Full Name'),
                          const SizedBox(height: 8),
                          _InputField(
                            controller: _nameController,
                            hint: 'John Doe',
                            icon: Icons.person_outline_rounded,
                            validator: (v) => (v == null || v.trim().isEmpty)
                                ? 'Name is required'
                                : null,
                          ),

                          const SizedBox(height: 16),

                          // Email field
                          _buildLabel('Email'),
                          const SizedBox(height: 8),
                          _InputField(
                            controller: _emailController,
                            hint: 'your@email.com',
                            icon: Icons.mail_outline_rounded,
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) {
                              if (v == null || v.trim().isEmpty) {
                                return 'Email is required';
                              }
                              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                                  .hasMatch(v.trim())) {
                                return 'Enter a valid email address';
                              }
                              return null;
                            },
                          ),

                          const SizedBox(height: 16),

                          // Password field
                          _buildLabel('Password'),
                          const SizedBox(height: 8),
                          _PasswordField(
                            controller: _passwordController,
                            obscure: _obscurePassword,
                            onToggle: () => setState(
                                () => _obscurePassword = !_obscurePassword),
                            validator: (v) {
                              if (v == null || v.isEmpty) {
                                return 'Password is required';
                              }
                              if (v.length < 6) {
                                return 'At least 6 characters';
                              }
                              if (!v.contains(RegExp(r'[A-Z]'))) {
                                return 'At least 1 uppercase letter';
                              }
                              if (!v.contains(RegExp(r'[0-9]'))) {
                                return 'At least 1 number';
                              }
                              if (!v.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>]'))) {
                                return 'At least 1 special character';
                              }
                              return null;
                            },
                          ),

                          const SizedBox(height: 16),

                          // Confirm Password field
                          _buildLabel('Confirm Password'),
                          const SizedBox(height: 8),
                          _PasswordField(
                            controller: _confirmPasswordController,
                            obscure: _obscurePassword,
                            onToggle: () => setState(
                                () => _obscurePassword = !_obscurePassword),
                            validator: (v) {
                              if (v == null || v.isEmpty) {
                                return 'Please confirm your password';
                              }
                              if (v != _passwordController.text) {
                                return 'Passwords do not match';
                              }
                              return null;
                            },
                          ),

                          const SizedBox(height: 24),

                          // Sign Up button
                          FigmaGradientButton(
                            onPressed: _isLoading ? null : _handleSignup,
                            label: 'Sign Up',
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
                                : const Icon(Icons.person_add_alt_1_rounded,
                                    color: Colors.white, size: 20),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    // ── LOGIN LINK ──────────────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already have an account? ",
                          style: TextStyle(
                              color: FigmaTheme.textMuted, fontSize: 15),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              color: FigmaTheme.neonBlue,
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

// ─── Shared Input Field ───────────────────────────────────

class _InputField extends StatefulWidget {
  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;

  const _InputField({
    required this.controller,
    required this.hint,
    required this.icon,
    this.keyboardType,
    this.validator,
  });

  @override
  State<_InputField> createState() => _InputFieldState();
}

class _InputFieldState extends State<_InputField> {
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
        keyboardType: widget.keyboardType,
        style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
        validator: widget.validator,
        decoration: _inputDecoration(
          hint: widget.hint,
          icon: widget.icon,
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
  final String? Function(String?)? validator;

  const _PasswordField({
    required this.controller,
    required this.obscure,
    required this.onToggle,
    this.validator,
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
        validator: widget.validator,
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
