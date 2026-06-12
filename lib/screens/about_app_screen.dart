import 'package:flutter/material.dart';
import '../data/design_system.dart';

class AboutAppScreen extends StatelessWidget {
  const AboutAppScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FigmaTheme.spaceBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          "About App",
          style: TextStyle(
            color: FigmaTheme.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: FigmaTheme.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: FigmaBackground(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: FigmaTheme.buttonGradient,
                  boxShadow: FigmaTheme.purpleGlow(radius: 40, opacity: 0.3),
                ),
                child: const Icon(
                  Icons.shield,
                  color: Colors.white,
                  size: 60,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                "TruthPulse",
                style: TextStyle(
                  color: FigmaTheme.textPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Version 1.0.0",
                style: TextStyle(
                  color: FigmaTheme.textMuted,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 40),
              FigmaGlassCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Our Mission",
                      style: TextStyle(
                        color: FigmaTheme.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 12),
                    Text(
                      "TruthPulse is dedicated to combating misinformation and deepfakes by empowering users with advanced AI technology. We believe in a digital world where authenticity is transparent and verifiable.",
                      style: TextStyle(
                        color: FigmaTheme.textMuted,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              FigmaGlassCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Technologies Used",
                      style: TextStyle(
                        color: FigmaTheme.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 12),
                    Text(
                      "• Flutter & Dart\n• Node.js & Express\n• Google Gemini 2.5 AI\n• MongoDB",
                      style: TextStyle(
                        color: FigmaTheme.textMuted,
                        fontSize: 15,
                        height: 1.8,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                "© 2026 TruthPulse. All rights reserved.",
                style: TextStyle(
                  color: FigmaTheme.textMuted,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
