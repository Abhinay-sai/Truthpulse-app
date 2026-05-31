import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';
import '../data/history_data.dart';

class BatchScanScreen extends StatefulWidget {
  const BatchScanScreen({super.key});

  @override
  State<BatchScanScreen> createState() => _BatchScanScreenState();
}

class _BatchScanScreenState extends State<BatchScanScreen> {
  bool isLoading = false;
  int processingCount = 0;

  Future<void> pickAndAnalyzeBatch() async {
    final ImagePicker picker = ImagePicker();
    final List<XFile> images = await picker.pickMultiImage(
      limit: 15,
    );

    if (images.isEmpty) return;
    if (images.length > 15) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("You can only upload a maximum of 15 images at once.")),
      );
      return;
    }

    setState(() {
      isLoading = true;
      processingCount = images.length;
    });

    try {
      final token = await AuthService.getToken();
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${AuthService.baseUrl}/analyze-batch'),
      );
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      for (var image in images) {
        request.files.add(
          http.MultipartFile.fromBytes('media', await image.readAsBytes(), filename: image.name),
        );
      }

      var response = await request.send();
      if (response.statusCode != 200) {
        throw Exception("Batch processing failed. Server error.");
      }

      var responseData = await response.stream.bytesToString();
      var data = jsonDecode(responseData);
      
      var results = data['results'] as List;

      for (var result in results) {
        scanHistory.insert(0, {
          "status": result['status'],
          "aiProbability": result['aiProbability'],
          "trustScore": result['trustScore'],
          "explanation": result['explanation'],
        });

        // Removed Firebase reporting as it is now handled by the Node.js backend
      }

      if (mounted) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: const Color(0xFF1E1E2C),
            title: const Text("Batch Complete", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            content: Text("Successfully analyzed ${results.length} images. Results have been saved to your History.", style: const TextStyle(color: Colors.white70)),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context); // Go back to dashboard
                },
                child: const Text("OK", style: TextStyle(color: Colors.pinkAccent)),
              ),
            ],
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
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Batch Scanner", style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(25),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.collections, size: 120, color: Colors.pinkAccent),
              const SizedBox(height: 30),
              const Text("Bulk Analysis", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              const Text("Select up to 10 images at once for rapid authenticity scanning.", textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 16)),
              const SizedBox(height: 50),
              SizedBox(
                width: double.infinity,
                height: 60,
                child: ElevatedButton.icon(
                  onPressed: isLoading ? null : pickAndAnalyzeBatch,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18))),
                  icon: const Icon(Icons.library_add, color: Colors.white),
                  label: isLoading
                      ? Text("ANALYZING $processingCount FILES...", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))
                      : const Text("SELECT IMAGES", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
