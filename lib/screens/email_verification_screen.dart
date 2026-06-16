import 'package:flutter/material.dart';
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'dashboard_screen.dart';

class EmailVerificationScreen extends StatefulWidget {
  final String email;
  const EmailVerificationScreen({super.key, required this.email});

  @override
  State<EmailVerificationScreen> createState() => _EmailVerificationScreenState();
}

class _EmailVerificationScreenState extends State<EmailVerificationScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _otpController = TextEditingController();
  bool _isLoading = false;
  bool _isResending = false;
  String? _errorMessage;
  String? _successMessage;

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
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _handleVerify() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      await AuthService.verifyEmail(
        email: widget.email,
        otp: _otpController.text,
      );

      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          FigmaPageRoute(child: const DashboardScreen()),
          (route) => false,
        );
      }
    } on AuthException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Could not connect to server.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleResend() async {
    setState(() {
      _isResending = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      await AuthService.resendVerification(widget.email);
      setState(() {
        _successMessage = 'Verification code has been resent to your email.';
      });
    } on AuthException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Could not connect to server.');
    } finally {
      if (mounted) setState(() => _isResending = false);
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

                    // ── ANIMATED ICON ──────────────────────────────
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
                              FigmaTheme.neonBlue.withValues(alpha: 0.3),
                              Colors.transparent,
                            ],
                          ),
                          boxShadow: FigmaTheme.purpleGlow(
                              radius: 30, opacity: 0.4),
                        ),
                        child: const Icon(
                          Icons.mark_email_read_rounded,
                          size: 50,
                          color: FigmaTheme.neonBlue,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── TITLE ──────────────────────────────────────────
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [FigmaTheme.neonBlue, FigmaTheme.neonPurple],
                      ).createShader(b),
                      child: const Text(
                        'Verify Email',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      'We sent a 6-digit code to\n${widget.email}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: FigmaTheme.textMuted, fontSize: 15, height: 1.4),
                    ),

                    const SizedBox(height: 32),

                    // ── ERROR / SUCCESS BANNERS ───────────────────────
                    if (_errorMessage != null)
                      _buildBanner(_errorMessage!, isError: true),
                    if (_successMessage != null)
                      _buildBanner(_successMessage!, isError: false),

                    // ── GLASS FORM CARD ───────────────────────────────
                    FigmaGlassCard(
                      padding: const EdgeInsets.all(24),
                      borderRadius: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // OTP field
                          _buildLabel('Verification Code (OTP)'),
                          const SizedBox(height: 8),
                          _OtpField(controller: _otpController),

                          const SizedBox(height: 24),

                          // Verify button
                          FigmaGradientButton(
                            onPressed: _isLoading ? null : _handleVerify,
                            label: 'Verify and Continue',
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
                                : const Icon(Icons.check_circle_outline_rounded,
                                    color: Colors.white, size: 20),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 28),

                    // ── RESEND LINK ──────────────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Didn't receive the code? ",
                          style: TextStyle(
                              color: FigmaTheme.textMuted, fontSize: 15),
                        ),
                        GestureDetector(
                          onTap: _isResending ? null : _handleResend,
                          child: Text(
                            _isResending ? 'Resending...' : 'Resend Code',
                            style: TextStyle(
                              color: _isResending ? FigmaTheme.textMuted : FigmaTheme.neonBlue,
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

  Widget _buildBanner(String message, {required bool isError}) {
    final color = isError ? FigmaTheme.danger : FigmaTheme.success;
    final icon = isError ? Icons.error_outline_rounded : Icons.check_circle_outline_rounded;
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: color.withValues(alpha: 0.5),
        ),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                color: color,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── OTP Field ────────────────────────────────────────────

class _OtpField extends StatefulWidget {
  final TextEditingController controller;
  const _OtpField({required this.controller});

  @override
  State<_OtpField> createState() => _OtpFieldState();
}

class _OtpFieldState extends State<_OtpField> {
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
        keyboardType: TextInputType.number,
        maxLength: 6,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: FigmaTheme.textPrimary,
          fontSize: 24,
          letterSpacing: 8,
          fontWeight: FontWeight.bold,
        ),
        validator: (v) {
          if (v == null || v.trim().isEmpty) return 'Code is required';
          if (v.trim().length != 6) return 'Code must be 6 digits';
          return null;
        },
        decoration: InputDecoration(
          counterText: '',
          hintText: '000000',
          hintStyle: const TextStyle(
            color: Color(0xFF5A5A7A),
            fontSize: 24,
            letterSpacing: 8,
          ),
          filled: true,
          fillColor: FigmaTheme.spaceInput,
          contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: FigmaTheme.glassBorder, width: 1.5),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: FigmaTheme.neonBlue, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: FigmaTheme.danger, width: 1.5),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: FigmaTheme.danger, width: 2),
          ),
          errorStyle: const TextStyle(color: FigmaTheme.danger, fontSize: 12),
        ),
      ),
    );
  }
}
