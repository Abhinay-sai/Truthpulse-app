import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'edit_profile_screen.dart';
import 'notification_screen.dart';
import 'support_screen.dart';
import 'legal_screen.dart';
import 'login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;
  int _totalScans = 0;
  double _averageAccuracy = 0.0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final user = await AuthService.getCurrentUser();
    
    // Fetch dynamic history
    try {
      final token = await AuthService.getToken();
      if (token != null) {
        final response = await http.get(
          Uri.parse('${AuthService.baseUrl}/history'),
          headers: {'Authorization': 'Bearer $token'},
        );
        
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body) as List<dynamic>;
          int totalTrust = 0;
          for (var item in data) {
            final scoreStr = item['trustScore']?.toString().replaceAll('%', '') ?? '0';
            totalTrust += int.tryParse(scoreStr) ?? 0;
          }
          
          _totalScans = data.length;
          if (_totalScans > 0) {
            _averageAccuracy = totalTrust / _totalScans;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    if (mounted) {
      setState(() {
        _user = user;
        _isLoading = false;
      });
    }
  }

  Future<void> _handleLogout() async {
    await AuthService.logout();
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        FigmaPageRoute(child: const LoginScreen()),
        (route) => false,
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
        title: const Text(
          "Profile",
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

          children: [

            const SizedBox(height: 20),

            // PROFILE IMAGE

            FigmaStaggeredEntrance(
              index: 0,
              child: Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: FigmaTheme.buttonGradient,
                  boxShadow: FigmaTheme.purpleGlow(radius: 35, opacity: 0.2),
                  image: _user?['profilePhoto'] != null && _user!['profilePhoto'].isNotEmpty
                      ? DecorationImage(
                          image: MemoryImage(base64Decode(_user!['profilePhoto'].split(',').last)),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: _user?['profilePhoto'] == null || _user!['profilePhoto'].isEmpty
                    ? const Icon(Icons.person, color: Colors.white, size: 80)
                    : null,
              ),
            ),
            const SizedBox(height: 30),
            
            FigmaStaggeredEntrance(
              index: 1,
              child: Column(
                children: [
                  Text(
                    _user?['name'] ?? "User Name",
                    style: const TextStyle(
                      color: FigmaTheme.textPrimary,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _user?['email'] ?? "Loading...",
                    style: const TextStyle(
                      color: FigmaTheme.textMuted,
                      fontSize: 17,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 40),

            // STATS
            FigmaStaggeredEntrance(
              index: 2,
              child: Row(
                children: [
                  Expanded(
                    child: statCard(
                      "$_totalScans",
                      "Scans",
                      FigmaTheme.neonBlue,
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: statCard(
                      "${_averageAccuracy.toStringAsFixed(0)}%",
                      "Accuracy",
                      FigmaTheme.neonCyan,
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: statCard(
                      "4.9",
                      "Rating",
                      FigmaTheme.neonPurple,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // MENU ITEMS
            FigmaStaggeredEntrance(
              index: 3,
              child: profileTile(
                Icons.person_outline,
                "Edit Profile",
                () => Navigator.push(context, FigmaPageRoute(child: const EditProfileScreen())),
              ),
            ),

            FigmaStaggeredEntrance(
              index: 4,
              child: profileTile(
                Icons.security,
                "Privacy & Security",
                () => Navigator.push(context, FigmaPageRoute(child: const LegalScreen())),
              ),
            ),

            FigmaStaggeredEntrance(
              index: 5,
              child: profileTile(
                Icons.notifications,
                "Notifications",
                () => Navigator.push(context, FigmaPageRoute(child: const NotificationScreen())),
              ),
            ),

            FigmaStaggeredEntrance(
              index: 6,
              child: profileTile(
                Icons.help_outline,
                "Help & Support",
                () => Navigator.push(context, FigmaPageRoute(child: const SupportScreen())),
              ),
            ),

            FigmaStaggeredEntrance(
              index: 7,
              child: profileTile(
                Icons.info_outline,
                "About App",
                () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming Soon'))); },
              ),
            ),

            FigmaStaggeredEntrance(
              index: 8,
              child: profileTile(
                Icons.logout,
                "Logout",
                _handleLogout,
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
      ),
    );
  }

  // STAT CARD

  Widget statCard(String value, String title, Color color) {
    return FigmaGlassCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: FigmaTheme.textMuted,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  // PROFILE TILE

  Widget profileTile(IconData icon, String title, VoidCallback onTap) {
    return FigmaAnimatedTap(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: FigmaGlassCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              FigmaIconBadge(
                icon: icon,
                size: 44,
              ),
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
