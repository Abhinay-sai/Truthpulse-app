import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../data/design_system.dart';
import '../data/auth_service.dart';
import 'edit_profile_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool darkMode = true;
  bool notifications = true;
  bool aiSuggestions = true;
  bool autoSave = true;
  bool deepScan = false;
  double confidenceThreshold = 70.0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      darkMode = prefs.getBool('setting_darkMode') ?? true;
      notifications = prefs.getBool('setting_notifications') ?? true;
      aiSuggestions = prefs.getBool('setting_aiSuggestions') ?? true;
      autoSave = prefs.getBool('setting_autoSave') ?? true;
      deepScan = prefs.getBool('setting_deepScan') ?? false;
      confidenceThreshold = prefs.getDouble('setting_confidenceThreshold') ?? 70.0;
      _isLoading = false;
    });
  }

  Future<void> _saveSetting(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('setting_$key', value);

    if (key == 'notifications' || key == 'autoSave' || key == 'deepScan') {
      try {
        final token = await AuthService.getToken();
        if (token != null) {
          await http.put(
            Uri.parse('${AuthService.baseUrl}/user/settings'),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
            body: jsonEncode({key: value}),
          );
        }
      } catch (e) {
        // ignore
      }
    }
  }

  Future<void> _saveSettingDouble(String key, double value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('setting_$key', value);
  }

  Future<void> _clearHistory() async {
    try {
      final token = await AuthService.getToken();
      final response = await http.delete(
        Uri.parse('${AuthService.baseUrl}/history'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        _showFeedback("Scan history cleared successfully.");
      } else {
        _showFeedback("Failed to clear history.");
      }
    } catch (e) {
      _showFeedback("Network error while clearing history.");
    }
  }

  void _showFeedback(String message) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: FigmaTheme.neonPurple.withValues(alpha: 0.8),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showInfoDialog(String title, String content) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: FigmaTheme.spaceMid,
        title: Text(title, style: const TextStyle(color: FigmaTheme.textPrimary)),
        content: Text(content, style: const TextStyle(color: FigmaTheme.textMuted)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("OK", style: TextStyle(color: FigmaTheme.neonCyan)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FigmaTheme.spaceBg,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          "Settings",
          style: TextStyle(
            color: FigmaTheme.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: FigmaBackground(
        child: _isLoading 
            ? const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
            : SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),

                    // HEADER CARD
                    FigmaStaggeredEntrance(
                      index: 0,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(25),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(30),
                          gradient: FigmaTheme.buttonGradient,
                          boxShadow: FigmaTheme.purpleGlow(radius: 30, opacity: 0.2),
                        ),
                        child: const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "TruthPulse Settings",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 10),
                            Text(
                              "Customize your AI media analysis experience.",
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 35),

                    // GENERAL
                    FigmaStaggeredEntrance(
                      index: 1,
                      child: const Text(
                        "General",
                        style: TextStyle(
                          color: FigmaTheme.textPrimary,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    FigmaStaggeredEntrance(
                      index: 3,
                      child: settingsTile(Icons.notifications, "Notifications", notifications, (value) {
                        setState(() => notifications = value);
                        _saveSetting('notifications', value);
                        _showFeedback("Notifications ${value ? 'enabled' : 'disabled'}");
                      }),
                    ),

                    FigmaStaggeredEntrance(
                      index: 4,
                      child: settingsTile(Icons.auto_fix_high, "AI Suggestions", aiSuggestions, (value) {
                        setState(() => aiSuggestions = value);
                        _saveSetting('aiSuggestions', value);
                        _showFeedback("AI Suggestions ${value ? 'enabled' : 'disabled'}");
                      }),
                    ),

                    FigmaStaggeredEntrance(
                      index: 5,
                      child: settingsTile(Icons.save, "Auto Save Reports", autoSave, (value) {
                        setState(() => autoSave = value);
                        _saveSetting('autoSave', value);
                        _showFeedback("Auto Save ${value ? 'enabled' : 'disabled'}");
                      }),
                    ),

                    FigmaStaggeredEntrance(
                      index: 6,
                      child: settingsTile(Icons.search, "Deep Scan Mode", deepScan, (value) {
                        setState(() => deepScan = value);
                        _saveSetting('deepScan', value);
                        _showFeedback("Deep Scan Mode ${value ? 'enabled (Scans will take longer)' : 'disabled'}");
                      }),
                    ),

                    const SizedBox(height: 10),
                    FigmaStaggeredEntrance(
                      index: 7,
                      child: FigmaGlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Custom Warning Threshold: ${confidenceThreshold.round()}%",
                              style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                            Slider(
                              value: confidenceThreshold,
                              min: 50,
                              max: 99,
                              divisions: 49,
                              activeColor: FigmaTheme.neonPurple,
                              onChanged: (val) {
                                setState(() => confidenceThreshold = val);
                              },
                              onChangeEnd: (val) {
                                _saveSettingDouble('confidenceThreshold', val);
                                _showFeedback("Threshold updated to ${val.round()}%");
                              },
                            )
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 35),

                    // ACCOUNT
                    FigmaStaggeredEntrance(
                      index: 6,
                      child: const Text(
                        "Account",
                        style: TextStyle(
                          color: FigmaTheme.textPrimary,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    FigmaStaggeredEntrance(
                      index: 7, 
                      child: actionTile(Icons.person, "Manage Profile", onTap: () {
                        Navigator.push(
                          context,
                          FigmaPageRoute(child: const EditProfileScreen()),
                        );
                      }),
                    ),
                    FigmaStaggeredEntrance(
                      index: 8, 
                      child: actionTile(Icons.security, "Privacy & Security", onTap: () {
                        _showInfoDialog("Privacy & Security", "Your data is secured with industry-standard AES-256 encryption. We never sell your personal information.");
                      }),
                    ),
                    FigmaStaggeredEntrance(
                      index: 9, 
                      child: actionTile(Icons.storage, "Storage Management", onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            backgroundColor: FigmaTheme.spaceMid,
                            title: const Text("Storage & History", style: TextStyle(color: FigmaTheme.textPrimary)),
                            content: const Text("Would you like to permanently delete your scan history and clear the cache?", style: TextStyle(color: FigmaTheme.textMuted)),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text("Cancel", style: TextStyle(color: Colors.white54)),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  _clearHistory();
                                },
                                child: const Text("Clear History", style: TextStyle(color: FigmaTheme.danger)),
                              ),
                            ],
                          ),
                        );
                      }),
                    ),
                    FigmaStaggeredEntrance(
                      index: 10, 
                      child: actionTile(Icons.help_outline, "Help & Support", onTap: () {
                        _showInfoDialog("Help & Support", "Need assistance?\nContact us anytime at support@truthpulse.ai");
                      }),
                    ),
                    FigmaStaggeredEntrance(
                      index: 11, 
                      child: actionTile(Icons.info_outline, "About Application", onTap: () {
                        showAboutDialog(
                          context: context,
                          applicationName: 'TruthPulse AI',
                          applicationVersion: '1.0.0',
                          applicationIcon: const Icon(Icons.verified_user, color: FigmaTheme.neonPurple, size: 40),
                          children: [
                            const Text("Advanced AI Media Authenticity Detection System."),
                          ],
                        );
                      }),
                    ),

                    const SizedBox(height: 40),

                    // VERSION CARD
                    FigmaStaggeredEntrance(
                      index: 12,
                      child: FigmaGlassCard(
                        padding: const EdgeInsets.all(22),
                        child: const Column(
                          children: [
                            Icon(
                              Icons.verified_rounded,
                              color: FigmaTheme.success,
                              size: 40,
                            ),
                            SizedBox(height: 15),
                            Text(
                              "TruthPulse AI v1.0",
                              style: TextStyle(
                                color: FigmaTheme.textPrimary,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 10),
                            Text(
                              "Advanced AI Media Authenticity Detection System",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: FigmaTheme.textMuted,
                                fontSize: 14,
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
      ),
    );
  }

  Widget settingsTile(IconData icon, String title, bool value, Function(bool) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: FigmaGlassCard(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            FigmaIconBadge(icon: icon, size: 44),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: FigmaTheme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Switch(
              value: value,
              onChanged: onChanged,
              activeThumbColor: FigmaTheme.neonPurple,
              inactiveTrackColor: FigmaTheme.spaceInput,
              inactiveThumbColor: FigmaTheme.textMuted,
            ),
          ],
        ),
      ),
    );
  }

  Widget actionTile(IconData icon, String title, {VoidCallback? onTap}) {
    return FigmaAnimatedTap(
      onTap: onTap ?? () {
        _showFeedback("$title (Coming Soon)");
      },
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: FigmaGlassCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              FigmaIconBadge(icon: icon, size: 44),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: FigmaTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios_rounded,
                color: FigmaTheme.textMuted,
                size: 16,
              ),
            ],
          ),
        ),
      ),
    );
  }
}