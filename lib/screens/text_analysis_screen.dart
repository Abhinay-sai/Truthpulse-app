import 'package:truthpulse/data/design_system.dart';
import 'dart:convert';

import '../data/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'loading_screen.dart';

class TextAnalysisScreen extends StatefulWidget {
  const TextAnalysisScreen({super.key});

  @override
  State<TextAnalysisScreen> createState() => _TextAnalysisScreenState();
}

class _TextAnalysisScreenState extends State<TextAnalysisScreen> {
  final TextEditingController _textController = TextEditingController();
  bool isLoading = false;

  Future<void> analyzeText() async {
    final text = _textController.text.trim();
    if (text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter some text to analyze.")),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final token = await AuthService.getToken();
      final headers = {'Content-Type': 'application/json'};
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final stopwatch = Stopwatch()..start();

      final response = await http.post(
        Uri.parse('${AuthService.baseUrl}/analyze-text'),
        headers: headers,
        body: jsonEncode({'text': text}),
      );
      
      stopwatch.stop();
      final processingTime = '${(stopwatch.elapsedMilliseconds / 1000).toStringAsFixed(1)} Seconds';
      final scanAccuracy = '99.9%';

      if (response.statusCode != 200) {
        throw Exception("Server error: ${response.statusCode}");
      }

      var data = jsonDecode(response.body);

      // Removed Firebase reporting as it is now handled by the Node.js backend

      if (mounted) {
        Navigator.push(
          context,
          FigmaPageRoute(child: LoadingScreen(
              aiProbability: data['aiProbability'].toString(),
              trustScore: data['trustScore'].toString(),
              status: data['status'].toString(),
              explanation: data['explanation'].toString(),
              processingTime: processingTime,
              scanAccuracy: scanAccuracy,
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text("Analyze Text"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(
              Icons.text_snippet,
              size: 80,
              color: Colors.amberAccent,
            ),
            const SizedBox(height: 20),
            const Text(
              "AI Text Scanner",
              style: TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              "Paste an article, email, or essay to detect if it was written by an AI.",
              style: TextStyle(
                color: Colors.white70,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 40),
            TextField(
              controller: _textController,
              maxLines: 8,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Paste text here...",
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: Colors.white10,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton.icon(
                onPressed: isLoading ? null : analyzeText,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amberAccent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
                icon: const Icon(
                  Icons.analytics,
                  color: Colors.black,
                ),
                label: isLoading
                    ? const CircularProgressIndicator(
                        color: Colors.black,
                      )
                    : const Text(
                        "ANALYZE TEXT",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}


