import 'package:flutter/material.dart';

class ArticleScreen extends StatelessWidget {
  final Map<String, dynamic> article;

  const ArticleScreen({super.key, required this.article});

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
            Text(article['title'] ?? 'Learning Material', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(20)),
              child: const Icon(Icons.image, size: 80, color: Colors.white24),
            ),
            const SizedBox(height: 30),
            Text(
              article['content'] ?? '',
              style: const TextStyle(color: Colors.white70, fontSize: 18, height: 1.6),
            ),
          ],
        ),
      ),
    );
  }
}
