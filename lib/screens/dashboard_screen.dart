import 'dart:convert';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';
import 'package:flutter/material.dart';
import '../data/design_system.dart';
import 'upload_screen.dart';
import 'text_analysis_screen.dart';
import 'url_scan_screen.dart';
import 'audio_analysis_screen.dart';
import 'batch_scan_screen.dart';
import 'news_feed_screen.dart';
import 'learning_hub_screen.dart';
import 'quiz_screen.dart';
import 'community_feed_screen.dart';
import 'social_scanner_screen.dart';
import 'document_scanner_screen.dart';
import 'live_audio_screen.dart';
import 'profile_screen.dart';
import 'settings_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> _history = [];
  bool _isLoadingHistory = true;

  int _totalScans = 0;
  int _scansThisWeek = 0;
  double _overallTrustScore = 0.0;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) return;
      
      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}/history'),
        headers: {'Authorization': 'Bearer $token'},
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List<dynamic>;
        
        int totalTrust = 0;
        int weekScans = 0;
        final now = DateTime.now();
        
        for (var item in data) {
          final scoreStr = item['trustScore']?.toString().replaceAll('%', '') ?? '0';
          totalTrust += int.tryParse(scoreStr) ?? 0;
          
          if (item['createdAt'] != null) {
            final date = DateTime.tryParse(item['createdAt']);
            if (date != null && now.difference(date).inDays <= 7) {
              weekScans++;
            }
          }
        }
        
        if (mounted) {
          setState(() {
            _history = data;
            _totalScans = data.length;
            _scansThisWeek = weekScans;
            _overallTrustScore = _totalScans > 0 ? (totalTrust / _totalScans) : 0.0;
            _isLoadingHistory = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingHistory = false);
      }
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
                // HEADER — "Welcome Back"
                const Text(
                  'Welcome Back',
                  style: TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Ready to analyze media authenticity?',
                  style: TextStyle(color: FigmaTheme.textMuted, fontSize: 15),
                ),

                const SizedBox(height: 24),

                // TRUST SCORE CARD
                FigmaGlassCard(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Overall Trust Score',
                                style: TextStyle(
                                  color: FigmaTheme.textMuted,
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${_overallTrustScore.toStringAsFixed(0)}%',
                                style: const TextStyle(
                                  color: FigmaTheme.textPrimary,
                                  fontSize: 40,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: FigmaTheme.neonPurple,
                                width: 3,
                              ),
                            ),
                            child: const Icon(
                              Icons.shield_outlined,
                              color: FigmaTheme.neonPurple,
                              size: 30,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      FigmaProgressBar(value: _overallTrustScore / 100.0),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // QUICK ANALYZE BUTTON
                FigmaGradientButton(
                  onPressed: () => Navigator.push(
                    context,
                    FigmaPageRoute(child: const UploadScreen()),
                  ),
                  label: 'Quick Analyze',
                  fullWidth: true,
                  icon: const Icon(Icons.qr_code_scanner_rounded,
                      color: Colors.white, size: 20),
                ),

                const SizedBox(height: 20),

                // STATS GRID
                Row(
                  children: [
                    Expanded(
                      child: FigmaGlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.trending_up_rounded,
                                color: FigmaTheme.neonBlue, size: 24),
                            const SizedBox(height: 8),
                            Text(
                              '$_totalScans',
                              style: const TextStyle(
                                color: FigmaTheme.textPrimary,
                                fontSize: 26,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Total Scans',
                              style: TextStyle(
                                  color: FigmaTheme.textMuted, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: FigmaGlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.access_time_rounded,
                                color: FigmaTheme.neonPurple, size: 24),
                            const SizedBox(height: 8),
                            Text(
                              '$_scansThisWeek',
                              style: const TextStyle(
                                color: FigmaTheme.textPrimary,
                                fontSize: 26,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'This Week',
                              style: TextStyle(
                                  color: FigmaTheme.textMuted, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // RECENT ANALYSIS SECTION
                const Text(
                  'Recent Analysis',
                  style: TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                if (_isLoadingHistory)
                  const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
                else if (_history.isEmpty)
                  const Text("No recent analysis found.", style: TextStyle(color: FigmaTheme.textMuted))
                else
                  ..._history.take(3).map(
                    (scan) {
                      final scoreStr = scan['trustScore']?.toString().replaceAll('%', '') ?? '0';
                      final score = int.tryParse(scoreStr) ?? 0;
                      final isAuthentic = scan['status'] == 'Authentic';
                      final dateStr = scan['createdAt'] != null ? scan['createdAt'].toString().substring(0, 10) : 'Just now';
                      
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: FigmaGlassCard(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      scan['filename'] ?? 'Unknown Scan',
                                      style: const TextStyle(
                                        color: FigmaTheme.textPrimary,
                                        fontSize: 15,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      dateStr,
                                      style: const TextStyle(
                                        color: FigmaTheme.textMuted,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '$score% ${scan['status']}',
                                style: TextStyle(
                                  color: isAuthentic
                                      ? FigmaTheme.success
                                      : FigmaTheme.danger,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }
                  ),

                const SizedBox(height: 24),

                // ADDITIONAL TOOLS SECTION
                const Text(
                  'More Tools',
                  style: TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                _buildToolGrid(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildToolGrid(BuildContext context) {
    final tools = [
      _ToolData(iconData: Icons.travel_explore, label: 'URL Scan', color: FigmaTheme.neonBlue, screen: const UrlScanScreen()),
      _ToolData(iconData: Icons.mic_none_rounded, label: 'Audio', color: FigmaTheme.neonPurple, screen: const AudioAnalysisScreen()),
      _ToolData(iconData: Icons.library_add_check_outlined, label: 'Batch', color: Colors.pinkAccent, screen: const BatchScanScreen()),
      _ToolData(iconData: Icons.article_outlined, label: 'News Feed', color: FigmaTheme.neonBlue, screen: const NewsFeedScreen()),
      _ToolData(iconData: Icons.lightbulb_outline, label: 'Learning', color: FigmaTheme.success, screen: const LearningHubScreen()),
      _ToolData(iconData: Icons.fact_check_outlined, label: 'Spot Fake', color: FigmaTheme.danger, screen: const QuizScreen()),
      _ToolData(iconData: Icons.people_outline_rounded, label: 'Community', color: FigmaTheme.neonPurple, screen: const CommunityFeedScreen()),
      _ToolData(iconData: Icons.document_scanner_outlined, label: 'Text Scan', color: Colors.amberAccent, screen: const TextAnalysisScreen()),
      _ToolData(iconData: Icons.public, label: 'Social', color: FigmaTheme.neonCyan, screen: const SocialScannerScreen()),
      _ToolData(iconData: Icons.description_outlined, label: 'Document', color: FigmaTheme.textMuted, screen: const DocumentScannerScreen()),
      _ToolData(iconData: Icons.surround_sound_outlined, label: 'Live Audio', color: FigmaTheme.neonPurple, screen: const LiveAudioScreen()),
      _ToolData(iconData: Icons.person_outline_rounded, label: 'Profile', color: FigmaTheme.neonBlue, screen: const ProfileScreen()),
      _ToolData(iconData: Icons.settings_outlined, label: 'Settings', color: FigmaTheme.textMuted, screen: const SettingsScreen()),
    ];

    final screenWidth = MediaQuery.of(context).size.width;
    int crossAxisCount = 3;
    if (screenWidth > 1200) {
      crossAxisCount = 6;
    } else if (screenWidth > 900) {
      crossAxisCount = 5;
    } else if (screenWidth > 600) {
      crossAxisCount = 4;
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.9,
      ),
      itemCount: tools.length,
      itemBuilder: (context, i) => _ToolCard(tool: tools[i]),
    );
  }
}

class _ToolCard extends StatelessWidget {
  final _ToolData tool;
  const _ToolCard({required this.tool});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final double iconSize = constraints.maxWidth * 0.35;
        final double paddingAmount = constraints.maxWidth * 0.12;
        final double fontSize = (constraints.maxWidth * 0.12).clamp(10.0, 16.0);
        
        return FigmaAnimatedTap(
          onTap: () => Navigator.push(
            context,
            FigmaPageRoute(child: tool.screen),
          ),
          child: Container(
            decoration: BoxDecoration(
              color: FigmaTheme.spaceBg.withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: tool.color.withValues(alpha: 0.3), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: tool.color.withValues(alpha: 0.05),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Cyber/Neon Icon in Circle
                Container(
                  padding: EdgeInsets.all(paddingAmount),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: tool.color.withValues(alpha: 0.1),
                    boxShadow: [
                      BoxShadow(
                        color: tool.color.withValues(alpha: 0.2),
                        blurRadius: 12,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: ShaderMask(
                    blendMode: BlendMode.srcIn,
                    shaderCallback: (Rect bounds) => LinearGradient(
                      colors: [
                        tool.color.withValues(alpha: 0.8),
                        tool.color,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ).createShader(bounds),
                    child: Icon(
                      tool.iconData,
                      size: iconSize,
                      color: Colors.white,
                    ),
                  ),
                ),
                SizedBox(height: constraints.maxWidth * 0.08),
                // Label
                Text(
                  tool.label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: fontSize,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ToolData {
  final IconData iconData;
  final String label;
  final Color color;
  final Widget screen;
  _ToolData({required this.iconData, required this.label, required this.color, required this.screen});
}
