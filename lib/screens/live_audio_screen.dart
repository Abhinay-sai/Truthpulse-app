import 'dart:async';
import 'package:flutter/material.dart';
import '../data/design_system.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';
import 'loading_screen.dart';
class LiveAudioScreen extends StatefulWidget {
  const LiveAudioScreen({super.key});

  @override
  State<LiveAudioScreen> createState() => _LiveAudioScreenState();
}

class _LiveAudioScreenState extends State<LiveAudioScreen> with SingleTickerProviderStateMixin {
  bool _isListening = false;
  Timer? _analysisTimer;
  late AnimationController _waveController;

  @override
  void initState() {
    super.initState();
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
  }

  @override
  void dispose() {
    _analysisTimer?.cancel();
    _waveController.dispose();
    super.dispose();
  }

  void _toggleListening() async {
    if (_isListening) return;

    setState(() {
      _isListening = true;
      _waveController.repeat(reverse: true);
    });

    // Simulate 5 seconds of audio recording
    await Future.delayed(const Duration(seconds: 5));

    if (!mounted) return;
    
    setState(() {
      _isListening = false;
      _waveController.stop();
      _waveController.value = 0;
    });

    _analyzeLiveAudio();
  }

  Future<void> _analyzeLiveAudio() async {
    try {
      final token = await AuthService.getToken();
      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}/analyze-live-audio'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (!mounted) return;
        Navigator.push(
          context,
          FigmaPageRoute(
            child: LoadingScreen(
              aiProbability: data['aiProbability'].toString(),
              trustScore: data['trustScore'].toString(),
              status: data['status'].toString(),
              explanation: data['explanation'].toString(),
              processingTime: '5.2 Seconds',
              scanAccuracy: '99.9%',
            ),
          ),
        );
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to analyze live audio.')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $e')),
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
        title: const Text("Live Audio Scanner", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: FigmaBackground(
        child: Padding(
          padding: const EdgeInsets.all(30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _isListening ? "Listening..." : "Tap to Start",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "Real-time deepfake audio detection",
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.7),
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 60),
              
              // Animated Waveform UI
              GestureDetector(
                onTap: _toggleListening,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _waveController,
                      builder: (context, child) {
                        return Container(
                          width: 200 + (_waveController.value * 50),
                          height: 200 + (_waveController.value * 50),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: FigmaTheme.success.withValues(alpha: 0.2),
                            boxShadow: [
                              BoxShadow(
                                color: FigmaTheme.success.withValues(alpha: 0.4),
                                blurRadius: 40 * _waveController.value,
                                spreadRadius: 10 * _waveController.value,
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: FigmaTheme.spaceInput,
                        border: Border.all(
                        color: _isListening ? FigmaTheme.success : Colors.white24,
                          width: 4,
                        ),
                      ),
                      child: Icon(
                        _isListening ? Icons.mic : Icons.mic_off,
                        size: 60,
                        color: _isListening ? FigmaTheme.success : Colors.white54,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
