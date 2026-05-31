import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<dynamic> _history = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        throw Exception("You must be logged in to view history.");
      }

      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}/history'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        if (mounted) {
          setState(() {
            _history = jsonDecode(response.body);
            _isLoading = false;
          });
        }
      } else {
        throw Exception("Failed to load history.");
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text("Scan History"),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.purpleAccent),
      );
    }

    if (_error != null) {
      return Center(
        child: Text(
          "Error: $_error",
          style: const TextStyle(color: Colors.redAccent),
        ),
      );
    }

    if (_history.isEmpty) {
      return const Center(
        child: Text(
          "No Scan History",
          style: TextStyle(color: Colors.white70),
        ),
      );
    }

    return ListView.builder(
      itemCount: _history.length,
      itemBuilder: (context, index) {
        final item = _history[index];
        return Card(
          color: Colors.white10,
          margin: const EdgeInsets.all(10),
          child: ListTile(
            leading: const Icon(
              Icons.analytics,
              color: Colors.cyan,
            ),
            title: Text(
              item['status'] ?? 'Unknown',
              style: const TextStyle(
                color: Colors.white,
              ),
            ),
            subtitle: Text(
              "AI: ${item['aiProbability']} | Trust: ${item['trustScore']}",
              style: const TextStyle(
                color: Colors.white70,
              ),
            ),
          ),
        );
      },
    );
  }
}