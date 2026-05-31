import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Notifications", style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(15),
        itemCount: 3,
        itemBuilder: (context, index) {
          return Card(
            color: Colors.white10,
            margin: const EdgeInsets.only(bottom: 15),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: ListTile(
              contentPadding: const EdgeInsets.all(15),
              leading: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(color: Colors.blueAccent.withValues(alpha: 0.2), shape: BoxShape.circle),
                child: const Icon(Icons.notifications, color: Colors.blueAccent),
              ),
              title: const Text("Batch Scan Complete", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              subtitle: const Padding(
                padding: EdgeInsets.only(top: 8.0),
                child: Text("Your 10 images have been analyzed. Tap to view results.", style: TextStyle(color: Colors.white70)),
              ),
              trailing: const Text("1h ago", style: TextStyle(color: Colors.white54, fontSize: 12)),
            ),
          );
        },
      ),
    );
  }
}
