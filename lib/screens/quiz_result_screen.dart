import 'package:flutter/material.dart';
import '../data/design_system.dart';

class QuizResultScreen extends StatelessWidget {
  final int score;
  final int total;

  const QuizResultScreen({super.key, required this.score, required this.total});

  @override
  Widget build(BuildContext context) {
    // Calculate percentage
    final double percentage = total > 0 ? (score / total) : 0;
    
    // Determine feedback based on score
    String title = "";
    String subtitle = "";
    Color themeColor = FigmaTheme.success;
    IconData icon = Icons.emoji_events;

    if (percentage == 1.0) {
      title = "Perfect!";
      subtitle = "You are a master at detecting AI and deepfakes. Nothing gets past you!";
      themeColor = FigmaTheme.success;
      icon = Icons.workspace_premium;
    } else if (percentage >= 0.6) {
      title = "Great Job!";
      subtitle = "You have a solid eye for spotting synthetic media. Keep practicing!";
      themeColor = FigmaTheme.neonCyan;
      icon = Icons.thumb_up_alt;
    } else {
      title = "Needs Practice";
      subtitle = "AI is getting harder to spot! Check out the Learning Hub to improve your skills.";
      themeColor = FigmaTheme.danger;
      icon = Icons.error_outline;
    }

    return FigmaBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(25),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 120, color: themeColor),
                const SizedBox(height: 30),
                Text(title, style: TextStyle(color: themeColor, fontSize: 36, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text(
                  "You scored $score out of $total",
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                Text(
                  subtitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white70, fontSize: 16, height: 1.5),
                ),
                const SizedBox(height: 50),
                FigmaGradientButton(
                  onPressed: () => Navigator.pop(context),
                  label: "BACK TO DASHBOARD",
                  fullWidth: true,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
