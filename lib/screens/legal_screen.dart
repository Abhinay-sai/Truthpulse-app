import 'package:flutter/material.dart';
import 'two_factor_auth_screen.dart';
import 'active_sessions_screen.dart';
import 'data_export_screen.dart';

class LegalScreen extends StatelessWidget {
  const LegalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Privacy & Security", style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Advanced Security", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            _buildSecurityTile(context, "Two-Factor Authentication", Icons.security, Colors.purpleAccent, const TwoFactorAuthScreen()),
            _buildSecurityTile(context, "Active Sessions", Icons.devices, Colors.greenAccent, const ActiveSessionsScreen()),
            _buildSecurityTile(context, "Export Account Data", Icons.archive, Colors.blueAccent, const DataExportScreen()),
            
            const SizedBox(height: 40),
            
            const Text("Privacy Policy", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            const Text(
              "Your privacy is important to us. TruthPulse uses AI models to analyze images and videos. The media you upload is temporarily sent to our servers for analysis and is permanently deleted immediately after processing unless you explicitly choose to save it to your history.\n\nWe do not sell your data to third parties.",
              style: TextStyle(color: Colors.white70, fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 40),
            const Text("Terms of Service", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            const Text(
              "By using TruthPulse, you agree to not use the service for illegal purposes. The AI analysis provided is for informational purposes only and should not be used as absolute proof in legal settings. Accuracy may vary depending on the quality of the uploaded media.",
              style: TextStyle(color: Colors.white70, fontSize: 16, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityTile(BuildContext context, String title, IconData icon, Color color, Widget destination) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      child: InkWell(
        onTap: () {
          Navigator.push(context, MaterialPageRoute(builder: (context) => destination));
        },
        borderRadius: BorderRadius.circular(15),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white10,
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: Colors.white12),
          ),
          child: Row(
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(width: 20),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              const Icon(Icons.arrow_forward_ios, color: Colors.white38, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}
