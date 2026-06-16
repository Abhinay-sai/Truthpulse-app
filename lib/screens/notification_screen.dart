import 'package:flutter/material.dart';
import '../data/notification_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<dynamic> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  Future<void> _fetchNotifications() async {
    final notifs = await NotificationService.getNotifications();
    if (mounted) {
      setState(() {
        _notifications = notifs;
        _isLoading = false;
      });
      // Mark them as read automatically when opened
      NotificationService.markAllAsRead();
    }
  }

  String _formatDate(String isoString) {
    try {
      final date = DateTime.parse(isoString);
      final diff = DateTime.now().difference(date);
      if (diff.inDays > 0) return '${diff.inDays}d ago';
      if (diff.inHours > 0) return '${diff.inHours}h ago';
      if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
      return 'Just now';
    } catch (e) {
      return 'Recently';
    }
  }

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
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.deepPurpleAccent))
          : _notifications.isEmpty
              ? const Center(
                  child: Text(
                    "No notifications yet",
                    style: TextStyle(color: Colors.white54, fontSize: 16),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(15),
                  itemCount: _notifications.length,
                  itemBuilder: (context, index) {
                    final notif = _notifications[index];
                    final title = notif['title'] ?? 'Notification';
                    final message = notif['message'] ?? '';
                    final status = notif['status'] ?? 'Unknown';
                    final isRead = notif['isRead'] ?? false;
                    final createdAt = notif['createdAt'] ?? '';
                    
                    return Card(
                      color: isRead ? Colors.white10 : Colors.white.withValues(alpha: 0.15),
                      margin: const EdgeInsets.only(bottom: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: isRead ? BorderSide.none : const BorderSide(color: Colors.deepPurpleAccent, width: 1.5),
                      ),
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
                        title: Row(
                          children: [
                            Expanded(child: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            if (!isRead) 
                              Container(
                                width: 8, height: 8,
                                decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle),
                              ),
                          ],
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(message, style: const TextStyle(color: Colors.white70)),
                        ),
                        trailing: Text(_formatDate(createdAt), style: const TextStyle(color: Colors.white54, fontSize: 12)),
                      ),
                    );
                  },
                ),
    );
  }
}
