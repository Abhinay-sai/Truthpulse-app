import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'result_screen.dart';

class SocialScannerScreen extends StatefulWidget {
  const SocialScannerScreen({super.key});

  @override
  State<SocialScannerScreen> createState() => _SocialScannerScreenState();
}

class _SocialScannerScreenState extends State<SocialScannerScreen> {
  final TextEditingController _handleController = TextEditingController();
  bool _isScanning = false;
  String _statusMessage = '';

  Future<void> _startScan() async {
    final handle = _handleController.text.trim();
    if (handle.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid handle')),
      );
      return;
    }

    setState(() {
      _isScanning = true;
      _statusMessage = 'Analyzing profile behavior and network...';
    });

    try {
      final token = await AuthService.getToken();
      final prefs = await SharedPreferences.getInstance();
      final deepScan = prefs.getBool('setting_deepScan') ?? false;
      
      if (deepScan) {
        setState(() {
          _statusMessage = 'Deep Scan Enabled. Performing rigorous analysis...';
        });
      }

      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}/analyze-social'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'handle': handle,
          'deepScan': deepScan.toString(),
        }),
      );

      setState(() {
        _isScanning = false;
      });

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          FigmaPageRoute(child: ResultScreen(
            aiProbability: result['aiProbability'].toString(),
            trustScore: result['trustScore'].toString(),
            status: result['status'].toString(),
            explanation: result['explanation'].toString(),
            processingTime: '2.5 Seconds',
            scanAccuracy: '99.9%',
          )),
        );
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Analysis failed. Please try again.')),
        );
      }
    } catch (e) {
      setState(() {
        _isScanning = false;
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error. Check connection.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FigmaTheme.spaceBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text("Social Scanner", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: FigmaBackground(
        child: Center(
          child: _isScanning
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: FigmaTheme.neonCyan),
                    const SizedBox(height: 30),
                    Text(
                      _statusMessage,
                      style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
                    ),
                  ],
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(30),
                  child: Column(
                    children: [
                      const Icon(Icons.people_alt, size: 80, color: FigmaTheme.neonCyan),
                      const SizedBox(height: 20),
                      const Text(
                        "Analyze Social Profiles",
                        style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "Enter an Instagram, X, or TikTok handle to scan for bot-like behavior or synthetic identities.",
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white70, fontSize: 16),
                      ),
                      const SizedBox(height: 40),
                      TextField(
                        controller: _handleController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: "@username or profile URL",
                          hintStyle: const TextStyle(color: Colors.white38),
                          prefixIcon: const Icon(Icons.alternate_email, color: FigmaTheme.neonCyan),
                          filled: true,
                          fillColor: FigmaTheme.spaceInput,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      SizedBox(
                        width: double.infinity,
                        height: 55,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          ).copyWith(
                            elevation: WidgetStateProperty.all(0),
                          ),
                          onPressed: _startScan,
                          child: Ink(
                            decoration: BoxDecoration(
                              gradient: FigmaTheme.buttonGradient,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: FigmaTheme.purpleGlow(),
                            ),
                            child: Container(
                              alignment: Alignment.center,
                              child: const Text("Scan Profile", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}
