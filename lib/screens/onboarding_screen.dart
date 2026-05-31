import 'package:truthpulse/data/design_system.dart';
import 'package:flutter/material.dart';

import 'login_screen.dart';

class OnboardingScreen extends StatelessWidget {

  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
      const Color(0xFF0A0118),

      body: SafeArea(

        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(25),
            child: Column(
              children: [
                const SizedBox(height: 30),

              // LOGO

              Container(

                width: 180,
                height: 180,

                decoration: BoxDecoration(

                  shape: BoxShape.circle,

                  gradient: const LinearGradient(
                    colors: [
                      Colors.purpleAccent,
                      Colors.blue,
                    ],
                  ),

                  boxShadow: [

                    BoxShadow(
                      color:
                      Colors.purpleAccent
                          .withValues(alpha: 0.2),

                      blurRadius: 40,
                    ),
                  ],
                ),

                child: const Icon(
                  Icons.verified_user,
                  color: Colors.white,
                  size: 90,
                ),
              ),

              const SizedBox(height: 50),

              // TITLE

              const Text(
                "TruthPulse",

                style: TextStyle(
                  color: Colors.white,
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),

              const SizedBox(height: 18),

              const Text(
                "AI-Powered Media Authenticity Analyzer",

                textAlign: TextAlign.center,

                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 20,
                  height: 1.6,
                ),
              ),

              const SizedBox(height: 35),

              // FEATURES

              featureTile(
                Icons.analytics,
                "AI Media Detection",
              ),

              featureTile(
                Icons.security,
                "Trust Score Analysis",
              ),

              featureTile(
                Icons.camera_alt,
                "Live Camera Scanning",
              ),

              featureTile(
                Icons.history,
                "Smart Scan History",
              ),

              const SizedBox(height: 40),

              // BUTTON

              Container(

                width: double.infinity,
                height: 68,

                decoration: BoxDecoration(

                  gradient: const LinearGradient(
                    colors: [
                      Colors.purpleAccent,
                      Colors.blue,
                    ],
                  ),

                  borderRadius:
                  BorderRadius.circular(35),

                  boxShadow: [

                    BoxShadow(
                      color:
                      Colors.purpleAccent
                          .withValues(alpha: 0.2),

                      blurRadius: 25,
                    ),
                  ],
                ),

                child: ElevatedButton(

                  style: ElevatedButton.styleFrom(

                    backgroundColor:
                    Colors.transparent,

                    shadowColor:
                    Colors.transparent,
                  ),

                  onPressed: () {

                    Navigator.pushReplacement(

                      context,

                      FigmaPageRoute(child: LoginScreen(),
                      ),
                    );
                  },

                  child: const Text(
                    "Get Started",

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight:
                      FontWeight.bold,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

            ],
          ),
        ),
      ),
    ),
    );
  }

  // FEATURE TILE

  Widget featureTile(
      IconData icon,
      String title,
      ) {

    return Container(

      margin: const EdgeInsets.only(
        bottom: 18,
      ),

      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(

        color: Colors.white10,

        borderRadius:
        BorderRadius.circular(22),

        border: Border.all(
          color: Colors.white12,
        ),
      ),

      child: Row(

        children: [

          Container(

            width: 55,
            height: 55,

            decoration: BoxDecoration(

              shape: BoxShape.circle,

              color:
              Colors.purpleAccent
                  .withValues(alpha: 0.2),
            ),

            child: Icon(
              icon,
              color: Colors.purpleAccent,
            ),
          ),

          const SizedBox(width: 18),

          Expanded(

            child: Text(
              title,

              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight:
                FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

