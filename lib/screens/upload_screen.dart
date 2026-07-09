import 'dart:convert';

import '../data/auth_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../data/history_data.dart';
import '../data/design_system.dart';
import 'loading_screen.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  bool _isLoading = false;

  List<dynamic> _recentUploads = [];
  bool _isLoadingHistory = true;

  @override
  void initState() {
    super.initState();
    _fetchRecentUploads();
  }

  Future<void> _fetchRecentUploads() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return;
      
      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}/history'),
        headers: {'Authorization': 'Bearer $token'},
      ).timeout(const Duration(seconds: 15));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List<dynamic>;
        if (mounted) {
          setState(() {
            _recentUploads = data.take(2).toList();
            _isLoadingHistory = false;
          });
        }
      } else {
        throw Exception("Failed to load history. Status: ${response.statusCode}");
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingHistory = false);
      }
    }
  }

  Future<void> _pickAndAnalyze() async {
    final picker = ImagePicker();
    final image = await picker.pickMedia();
    if (image == null) return;

    final bytes = await image.readAsBytes();
    setState(() => _isLoading = true);

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
        http.MultipartFile.fromBytes('media', bytes, filename: image.name),
      );

      final stopwatch = Stopwatch()..start();

      final response = await request.send();
      final responseData = await response.stream.bytesToString();
      final data = jsonDecode(responseData);
      
      stopwatch.stop();
      final processingTime = '${(stopwatch.elapsedMilliseconds / 1000).toStringAsFixed(1)} Seconds';
      final scanAccuracy = '99.9%';

      if (response.statusCode != 200) {
        throw Exception(data['error'] ?? 'Analysis failed. Please try again.');
      }

      scanHistory.insert(0, {
        'status': data['status'],
        'aiProbability': data['aiProbability'],
        'trustScore': data['trustScore'],
        'explanation': data['explanation'],
      });

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
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FigmaTheme.spaceBg,
      body: FigmaBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // HEADER
                const Text(
                  'Upload Media',
                  style: TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Upload image or video to analyze',
                  style: TextStyle(color: FigmaTheme.textMuted, fontSize: 15),
                ),

                const SizedBox(height: 24),

                // DROP ZONE — matches UploadScreen.tsx drag-and-drop card
                GestureDetector(
                  onTap: _isLoading ? null : _pickAndAnalyze,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: _isLoading
                          ? FigmaTheme.purpleGlow(radius: 20, opacity: 0.3)
                          : null,
                    ),
                    child: FigmaGlassCard(
                      borderColor: FigmaTheme.glassBorder,
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        children: [
                          // Upload icon with gradient glow
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: RadialGradient(colors: [
                                    FigmaTheme.neonPurple.withValues(alpha: 0.25),
                                    FigmaTheme.neonBlue.withValues(alpha: 0.0),
                                  ]),
                                ),
                              ),
                              _isLoading
                                  ? const SizedBox(
                                      width: 60,
                                      height: 60,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 3,
                                        color: FigmaTheme.neonPurple,
                                      ),
                                    )
                                  : const Icon(
                                      Icons.cloud_upload_outlined,
                                      size: 64,
                                      color: FigmaTheme.neonPurple,
                                    ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          const Text(
                            'Drag & Drop',
                            style: TextStyle(
                              color: FigmaTheme.textPrimary,
                              fontSize: 22,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'or click to browse files',
                            style: TextStyle(
                              color: FigmaTheme.textMuted,
                              fontSize: 14,
                            ),
                          ),

                          const SizedBox(height: 24),

                          FigmaGradientButton(
                            onPressed: _isLoading ? null : _pickAndAnalyze,
                            label: _isLoading ? 'Analyzing...' : 'Browse Files',
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // SUPPORTED FORMATS
                FigmaGlassCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.task_alt_rounded,
                              color: FigmaTheme.neonPurple, size: 20),
                          const SizedBox(width: 8),
                          const Text(
                            'Supported Formats',
                            style: TextStyle(
                              color: FigmaTheme.textPrimary,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Icon(Icons.image_outlined,
                                    color: FigmaTheme.textMuted, size: 16),
                                const SizedBox(width: 6),
                                const Text(
                                  'JPG, PNG, WebP',
                                  style: TextStyle(
                                      color: FigmaTheme.textMuted, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: Row(
                              children: [
                                Icon(Icons.videocam_outlined,
                                    color: FigmaTheme.textMuted, size: 16),
                                const SizedBox(width: 6),
                                const Text(
                                  'MP4, MOV, AVI',
                                  style: TextStyle(
                                      color: FigmaTheme.textMuted, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // RECENT UPLOADS
                const Text(
                  'Recent Uploads',
                  style: TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                _isLoadingHistory 
                  ? const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
                  : _recentUploads.isEmpty 
                    ? const Text("No recent uploads found.", style: TextStyle(color: FigmaTheme.textMuted))
                    : Row(
                        children: _recentUploads.map((upload) {
                          final filename = upload['filename'] ?? 'Unknown File';
                          final mediaType = upload['mediaType'] ?? 'image';
                          final isImage = mediaType.toString().startsWith('image');
                          final isUrl = mediaType.toString() == 'url';
                          final isText = mediaType.toString() == 'text/plain';
                          
                          IconData iconData = Icons.insert_drive_file_outlined;
                          Color iconColor = FigmaTheme.textMuted;
                          
                          if (isImage) {
                            iconData = Icons.image_outlined;
                            iconColor = FigmaTheme.neonPurple;
                          } else if (isUrl) {
                            iconData = Icons.link_rounded;
                            iconColor = Colors.greenAccent;
                          } else if (isText) {
                            iconData = Icons.text_snippet_outlined;
                            iconColor = Colors.orangeAccent;
                          } else {
                            iconData = Icons.videocam_outlined;
                            iconColor = FigmaTheme.neonBlue;
                          }

                          return Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: FigmaGlassCard(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  children: [
                                    AspectRatio(
                                      aspectRatio: 1,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(12),
                                          gradient: LinearGradient(
                                            colors: [
                                              iconColor.withValues(alpha: 0.2),
                                              iconColor.withValues(alpha: 0.05),
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          ),
                                        ),
                                        child: Icon(
                                          iconData,
                                          color: iconColor,
                                          size: 36,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      filename,
                                      style: const TextStyle(
                                        color: FigmaTheme.textPrimary,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      upload['status'] ?? '',
                                      style: TextStyle(
                                        color: upload['status'] == 'Authentic' ? Colors.greenAccent : FigmaTheme.danger,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),

                const SizedBox(height: 20),

                // ANALYZE MEDIA BUTTON
                FigmaGradientButton(
                  onPressed: _isLoading ? null : _pickAndAnalyze,
                  label: 'Analyze Media',
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
