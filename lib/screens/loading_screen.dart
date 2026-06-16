import 'package:truthpulse/data/design_system.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'result_screen.dart';

class LoadingScreen extends StatefulWidget {
  final String aiProbability;
  final String trustScore;
  final String status;
  final String explanation;
  final String processingTime;
  final String scanAccuracy;

  const LoadingScreen({
    super.key,
    required this.aiProbability,
    required this.trustScore,
    required this.status,
    required this.explanation,
    required this.processingTime,
    required this.scanAccuracy,
  });

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> with SingleTickerProviderStateMixin {
  late AnimationController controller;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    _processScan();
  }

  Future<void> _processScan() async {
    // 1. Fetch custom threshold
    double threshold = 70.0;
    try {
      final prefs = await SharedPreferences.getInstance();
      threshold = prefs.getDouble('setting_confidenceThreshold') ?? 70.0;
    } catch (e) {
      // ignore
    }

    // 2. Wait for loading animation
    await Future.delayed(const Duration(seconds: 4));
    if (!mounted) return;

    // 3. Dynamically override status based on user's threshold setting
    String finalStatus = widget.status;
    final scoreString = widget.trustScore.replaceAll('%', '').trim();
    final scoreNum = double.tryParse(scoreString);

    if (scoreNum != null) {
      if (scoreNum >= threshold) {
        finalStatus = "Authentic";
      } else {
        finalStatus = "AI Generated";
      }
    }

    Navigator.pushReplacement(
      context,
      FigmaPageRoute(
        child: ResultScreen(
          aiProbability: widget.aiProbability,
          trustScore: widget.trustScore,
          status: finalStatus,
          explanation: widget.explanation,
          processingTime: widget.processingTime,
          scanAccuracy: widget.scanAccuracy,
        ),
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedBuilder(
              animation: controller,
              builder: (context, child) {
                return Transform.rotate(
                  angle: controller.value * 6.3,
                  child: Container(
                    width: 170,
                    height: 170,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Colors.purpleAccent, Colors.blue],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.purpleAccent.withValues(alpha: 0.2),
                          blurRadius: 40,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.analytics,
                      color: Colors.white,
                      size: 80,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 50),
            const Text(
              "Analyzing Media",
              style: TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 15),
            const Text(
              "AI is scanning authenticity and detecting manipulation...",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white70,
                fontSize: 17,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 50),
            SizedBox(
              width: 220,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: const LinearProgressIndicator(
                  minHeight: 12,
                  backgroundColor: Colors.white12,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.purpleAccent),
                ),
              ),
            ),
            const SizedBox(height: 25),
            const Text(
              "Processing AI Detection Model...",
              style: TextStyle(
                color: Colors.white54,
                fontSize: 15,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
