import 'package:flutter/material.dart';

class PostDetailScreen extends StatelessWidget {
  final Map<String, dynamic> post;

  const PostDetailScreen({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(backgroundColor: Colors.purpleAccent, child: Icon(Icons.person, color: Colors.white)),
                const SizedBox(width: 10),
                Text(post['author'] ?? '@Unknown', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                const Spacer(),
                Text("Just now", style: TextStyle(color: Colors.white.withValues(alpha: 0.2))),
              ],
            ),
            const SizedBox(height: 20),
            Text(post['content'] ?? '', style: const TextStyle(color: Colors.white70, height: 1.5, fontSize: 16)),
            const SizedBox(height: 20),
            if (post['imageUrl'] != null)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white12,
                  borderRadius: BorderRadius.circular(15),
                  image: DecorationImage(
                    image: NetworkImage(post['imageUrl']),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(15)),
                child: const Icon(Icons.video_file, size: 80, color: Colors.white24),
              ),
            const SizedBox(height: 20),
            if (post['aiProbability'] != null)
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: Colors.redAccent.withValues(alpha: 0.2), 
                  borderRadius: BorderRadius.circular(15), 
                  border: Border.all(color: Colors.redAccent)
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning, color: Colors.redAccent),
                    const SizedBox(width: 10),
                    Text("AI Probability: ${post['aiProbability']}%", style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 18)),
                  ],
                ),
              ),
            const SizedBox(height: 40),
            const Text("Comments", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            if (post['comments'] != null && post['comments'] is List)
              ...((post['comments'] as List).map((c) => _buildComment(c['user']?.toString() ?? "@User", c['text']?.toString() ?? "")))
            else
              const Text("No comments yet.", style: TextStyle(color: Colors.white54)),
            const SizedBox(height: 20),
            TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Add a comment...",
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: Colors.white10,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
                suffixIcon: const Icon(Icons.send, color: Colors.purpleAccent),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComment(String user, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CircleAvatar(radius: 15, backgroundColor: Colors.grey, child: Icon(Icons.person, size: 15, color: Colors.white)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                const SizedBox(height: 5),
                Text(text, style: const TextStyle(color: Colors.white70)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
