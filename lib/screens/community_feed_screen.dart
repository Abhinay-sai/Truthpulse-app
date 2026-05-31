import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'post_detail_screen.dart';

class CommunityFeedScreen extends StatefulWidget {
  const CommunityFeedScreen({super.key});

  @override
  State<CommunityFeedScreen> createState() => _CommunityFeedScreenState();
}

class _CommunityFeedScreenState extends State<CommunityFeedScreen> {
  List<dynamic> posts = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchFeed();
  }

  Future<void> _fetchFeed() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        setState(() {
          error = 'Please log in to view the feed.';
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}/feed'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          posts = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed to load community feed.';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Network error. Please try again.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return FigmaBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          title: const Text("Community Warnings", style: TextStyle(color: FigmaTheme.textPrimary)),
          iconTheme: const IconThemeData(color: FigmaTheme.textPrimary),
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
            : error != null
                ? Center(
                    child: Text(error!, style: const TextStyle(color: FigmaTheme.danger, fontSize: 16)),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(15),
                    itemCount: posts.length,
                    itemBuilder: (context, index) {
                      final post = posts[index];
                      return FigmaStaggeredEntrance(
                        index: index,
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 20),
                          child: FigmaAnimatedTap(
                            onTap: () {
                              Navigator.push(context, FigmaPageRoute(child: PostDetailScreen(post: post)));
                            },
                            child: FigmaGlassCard(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const CircleAvatar(
                                        backgroundColor: FigmaTheme.neonPurple,
                                        child: Icon(Icons.person, color: Colors.white),
                                      ),
                                      const SizedBox(width: 10),
                                      Text(
                                        post['author'] ?? 'Anonymous',
                                        style: const TextStyle(color: FigmaTheme.textPrimary, fontWeight: FontWeight.bold),
                                      ),
                                      const Spacer(),
                                      Text("2h ago", style: TextStyle(color: FigmaTheme.textMuted.withValues(alpha: 0.8))),
                                    ],
                                  ),
                                  const SizedBox(height: 15),
                                  Text(
                                    post['title'] ?? '',
                                    style: const TextStyle(color: FigmaTheme.neonCyan, fontWeight: FontWeight.w600, fontSize: 16),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    post['content'] ?? '',
                                    style: const TextStyle(color: FigmaTheme.textMuted, height: 1.5),
                                  ),
                                  const SizedBox(height: 15),
                                  if (post['imageUrl'] != null)
                                    Container(
                                      height: 180,
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(15),
                                        image: DecorationImage(
                                          image: NetworkImage(post['imageUrl']),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                  const SizedBox(height: 15),
                                  Row(
                                    children: [
                                      const Icon(Icons.arrow_upward, color: FigmaTheme.success, size: 20),
                                      const SizedBox(width: 4),
                                      Text('${post['upvotes'] ?? 0}', style: const TextStyle(color: FigmaTheme.success)),
                                      const SizedBox(width: 16),
                                      const Icon(Icons.comment, color: FigmaTheme.textMuted, size: 20),
                                      const SizedBox(width: 4),
                                      Text('${post['comments'] is List ? (post['comments'] as List).length : 0}', style: const TextStyle(color: FigmaTheme.textMuted)),
                                      const Spacer(),
                                      IconButton(
                                        onPressed: () {},
                                        icon: const Icon(Icons.share, color: FigmaTheme.textMuted),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {},
          backgroundColor: FigmaTheme.neonPurple,
          child: const Icon(Icons.add_alert, color: Colors.white),
        ),
      ),
    );
  }
}
