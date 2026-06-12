import 'package:flutter/material.dart';
import '../data/history_data.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // For live notifications, we will show history records as notifications
    // Filtering them to pretend they are new notifications
    final recentScans = scanHistory.take(5).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0A0118),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Notifications", style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: recentScans.isEmpty
          ? const Center(
              child: Text(
                "No new notifications",
                style: TextStyle(color: Colors.white54, fontSize: 16),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(15),
              itemCount: recentScans.length,
              itemBuilder: (context, index) {
                final scan = recentScans[index];
                final status = scan['status'] ?? 'Unknown';
                final file = scan['file'] ?? 'File';
                
                return Card(
                  color: Colors.white10,
                  margin: const EdgeInsets.only(bottom: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(15),
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: (status == 'AI Generated' || status == 'Deepfake Detected' || status == 'Malicious URL') 
                            ? Colors.redAccent.withValues(alpha: 0.2) 
                            : Colors.greenAccent.withValues(alpha: 0.2), 
                        shape: BoxShape.circle
                      ),
                      child: Icon(
                        (status == 'AI Generated' || status == 'Deepfake Detected' || status == 'Malicious URL') ? Icons.warning : Icons.check_circle, 
                        color: (status == 'AI Generated' || status == 'Deepfake Detected' || status == 'Malicious URL') ? Colors.redAccent : Colors.greenAccent
                      ),
                    ),
                    title: const Text("Scan Complete", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text("Your file '$file' has been analyzed. Result: $status.", style: const TextStyle(color: Colors.white70)),
                    ),
                    trailing: const Text("Just now", style: TextStyle(color: Colors.white54, fontSize: 12)),
                  ),
                );
              },
            ),
    );
  }
}
