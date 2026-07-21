import 'dart:async';
import 'package:flutter/material.dart';
import '../data/design_system.dart';
import '../data/auth_service.dart';
import 'onboarding_screen.dart';
import 'dashboard_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;
  late Animation<double> _subtitleFadeAnim;
  late Animation<double> _barWidthAnim;
  Timer? _timer;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    // Shield: scale from 0 + rotate-in (0→0.45)
    _scaleAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.45, curve: Curves.easeOut),
      ),
    );

    // Title fade in (0.25→0.75)
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.28, 0.7, curve: Curves.easeOut),
      ),
    );

    // Subtitle fade in (0.45→0.85)
    _subtitleFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.45, 0.85, curve: Curves.easeOut),
      ),
    );

    // Thin bar width expand (0.8→1.0)
    _barWidthAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.8, 1.0, curve: Curves.easeOut),
      ),
    );

    _controller.forward();

    _timer = Timer(const Duration(seconds: 3), () async {
      if (!mounted) return;
      
      final user = await AuthService.getCurrentUser();
      if (!mounted) return;

      if (user != null) {
        Navigator.pushReplacement(
          context,
          FigmaPageRoute(child: const DashboardScreen()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          FigmaPageRoute(child: const OnboardingScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FigmaBackground(
        child: SizedBox(
          width: double.infinity,
          height: double.infinity,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // SHIELD ICON with purple glow halo (matches SplashScreen.tsx)
              AnimatedBuilder(
                animation: _controller,
                builder: (_, child) {
                  return Transform.scale(
                    scale: _scaleAnim.value,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Purple blur glow behind shield
                        Container(
                          width: 160,
                          height: 160,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: RadialGradient(
                              colors: [
                                FigmaTheme.neonPurple.withValues(alpha: 0.4),
                                FigmaTheme.neonBlue.withValues(alpha: 0.0),
                              ],
                            ),
                          ),
                        ),
                        // App Logo Image
                        Image.asset(
                          'assets/truthpulse_app_logo.png',
                          width: 140,
                          height: 140,
                          fit: BoxFit.contain,
                        ),
                      ],
                    ),
                  );
                },
              ),

              const SizedBox(height: 32),

              // GRADIENT TEXT "TruthPulse" (purple→white→blue)
              AnimatedBuilder(
                animation: _fadeAnim,
                builder: (_, child) {
                  return Opacity(
                    opacity: _fadeAnim.value,
                    child: Transform.translate(
                      offset: Offset(0, 20 * (1 - _fadeAnim.value)),
                      child: ShaderMask(
                        shaderCallback: (bounds) =>
                            const LinearGradient(
                              colors: [
                                FigmaTheme.neonPurple,
                                Colors.white,
                                FigmaTheme.neonBlue,
                              ],
                            ).createShader(bounds),
                        child: const Text(
                          'TruthPulse',
                          style: TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 2,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 16),

              // SUBTITLE
              AnimatedBuilder(
                animation: _subtitleFadeAnim,
                builder: (_, child) {
                  return Opacity(
                    opacity: _subtitleFadeAnim.value,
                    child: const Text(
                      'Detect. Analyze. Trust.',
                      style: TextStyle(
                        color: FigmaTheme.textMuted,
                        fontSize: 18,
                        letterSpacing: 1,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 48),

              // THIN GRADIENT LOADING BAR (matches the tsx animated line)
              AnimatedBuilder(
                animation: _barWidthAnim,
                builder: (_, child) {
                  return SizedBox(
                    width: 200,
                    height: 4,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: FractionallySizedBox(
                        widthFactor: _barWidthAnim.value,
                        alignment: Alignment.centerLeft,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.transparent,
                                FigmaTheme.neonPurple,
                                Colors.transparent,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(100),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
