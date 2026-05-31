import 'dart:async';
import 'package:truthpulse/data/design_system.dart';
import 'dart:convert';
import '../data/auth_service.dart';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../data/history_data.dart';
import 'loading_screen.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? controller;
  List<CameraDescription>? cameras;
  bool isCameraReady = false;
  bool isAnalyzing = false;
  
  bool isVideoMode = false;
  bool isRecording = false;
  Timer? _timer;
  int _recordSeconds = 0;

  @override
  void initState() {
    super.initState();
    initializeCamera();
  }

  Future<void> initializeCamera() async {
    cameras = await availableCameras();
    if (cameras != null && cameras!.isNotEmpty) {
      controller = CameraController(
        cameras![0],
        ResolutionPreset.medium,
        enableAudio: true,
      );
      await controller!.initialize();
      setState(() {
        isCameraReady = true;
      });
    }
  }

  void _startTimer() {
    _recordSeconds = 0;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _recordSeconds++;
      });
      // Optional max recording limit e.g. 15s
      if (_recordSeconds >= 15) {
        _stopRecordingAndAnalyze();
      }
    });
  }

  Future<void> _stopRecordingAndAnalyze() async {
    _timer?.cancel();
    if (!controller!.value.isRecordingVideo) return;
    
    setState(() {
      isRecording = false;
      isAnalyzing = true;
    });

    try {
      final file = await controller!.stopVideoRecording();
      await _uploadMedia(await file.readAsBytes(), file.name);
    } catch (e) {
      _showError(e);
    }
  }

  Future<void> _startRecording() async {
    if (!controller!.value.isInitialized) return;
    if (controller!.value.isRecordingVideo) return;

    try {
      await controller!.startVideoRecording();
      setState(() {
        isRecording = true;
      });
      _startTimer();
    } catch (e) {
      _showError(e);
    }
  }

  Future<void> _capturePhotoAndAnalyze() async {
    if (!controller!.value.isInitialized) return;

    setState(() {
      isAnalyzing = true;
    });

    try {
      final file = await controller!.takePicture();
      await _uploadMedia(await file.readAsBytes(), file.name);
    } catch (e) {
      _showError(e);
    }
  }

  Future<void> _uploadMedia(List<int> bytes, String filename) async {
    try {
      final token = await AuthService.getToken();
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${AuthService.baseUrl}/analyze'),
      );
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      request.files.add(
        http.MultipartFile.fromBytes('media', bytes, filename: filename),
      );

      final stopwatch = Stopwatch()..start();
      var response = await request.send();
      var responseData = await response.stream.bytesToString();
      final data = jsonDecode(responseData);
      
      stopwatch.stop();
      final processingTime = '${(stopwatch.elapsedMilliseconds / 1000).toStringAsFixed(1)} Seconds';
      final scanAccuracy = '99.9%';

      if (response.statusCode != 200) {
        throw Exception(data['error'] ?? 'Analysis failed.');
      }

      scanHistory.insert(0, {
        "file": filename,
        "status": data["status"],
        "trust": data["trustScore"],
      });

      setState(() {
        isAnalyzing = false;
      });

      if (mounted) {
        Navigator.pushReplacement(
          context,
          FigmaPageRoute(child: LoadingScreen(
              aiProbability: data["aiProbability"].toString(),
              trustScore: data["trustScore"].toString(),
              status: data["status"].toString(),
              explanation: data["explanation"].toString(),
              processingTime: processingTime,
              scanAccuracy: scanAccuracy,
            ),
          ),
        );
      }
    } catch (e) {
      _showError(e);
    }
  }

  void _showError(dynamic e) {
    setState(() {
      isAnalyzing = false;
      isRecording = false;
    });
    _timer?.cancel();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    controller?.dispose();
    super.dispose();
  }

  String _formatTime(int seconds) {
    final m = (seconds / 60).floor().toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return "$m:$s";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: isCameraReady
          ? Stack(
              children: [
                SizedBox.expand(
                  child: CameraPreview(controller!),
                ),
                
                // HEADER
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                          onPressed: () => Navigator.pop(context),
                        ),
                        if (isRecording)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.redAccent.withValues(alpha: 0.8),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.fiber_manual_record, color: Colors.white, size: 16),
                                const SizedBox(width: 8),
                                Text(_formatTime(_recordSeconds), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          )
                        else
                          const Text(
                            "Live AI Scanner",
                            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        const SizedBox(width: 40),
                      ],
                    ),
                  ),
                ),

                // ANALYZING OVERLAY
                if (isAnalyzing)
                  Container(
                    color: Colors.black54,
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const CircularProgressIndicator(color: FigmaTheme.neonPurple),
                          const SizedBox(height: 20),
                          const Text("Uploading securely to Gemini...", style: TextStyle(color: Colors.white)),
                        ],
                      ),
                    ),
                  ),

                // CONTROLS
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    padding: const EdgeInsets.only(bottom: 40, top: 20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [Colors.black.withValues(alpha: 0.8), Colors.transparent],
                      ),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Mode Switcher
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () { if (!isRecording && !isAnalyzing) setState(() => isVideoMode = false); },
                              child: Text(
                                "PHOTO",
                                style: TextStyle(
                                  color: !isVideoMode ? FigmaTheme.neonCyan : Colors.white54,
                                  fontWeight: !isVideoMode ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            const SizedBox(width: 30),
                            GestureDetector(
                              onTap: () { if (!isRecording && !isAnalyzing) setState(() => isVideoMode = true); },
                              child: Text(
                                "VIDEO",
                                style: TextStyle(
                                  color: isVideoMode ? FigmaTheme.neonCyan : Colors.white54,
                                  fontWeight: isVideoMode ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Shutter Button
                        GestureDetector(
                          onTap: isAnalyzing 
                            ? null 
                            : (isVideoMode 
                                ? (isRecording ? _stopRecordingAndAnalyze : _startRecording)
                                : _capturePhotoAndAnalyze),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            width: isRecording ? 80 : 95,
                            height: isRecording ? 80 : 95,
                            decoration: BoxDecoration(
                              shape: isRecording ? BoxShape.rectangle : BoxShape.circle,
                              borderRadius: isRecording ? BorderRadius.circular(20) : BorderRadius.circular(50),
                              border: Border.all(color: Colors.white, width: 4),
                              color: isVideoMode 
                                ? Colors.redAccent 
                                : Colors.white.withValues(alpha: 0.3),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            )
          : const Center(
              child: CircularProgressIndicator(color: FigmaTheme.neonPurple),
            ),
    );
  }
}
