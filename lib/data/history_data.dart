import 'package:flutter/material.dart';

List<Map<String, dynamic>> scanHistory = [];

class HistoryScreen extends StatelessWidget {

  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: const Color(0xFF0A0118),

      appBar: AppBar(

        backgroundColor: Colors.transparent,

        elevation: 0,

        title: const Text(
          "Scan History",
          style: TextStyle(color: Colors.white),
        ),

        centerTitle: true,
      ),

      body: scanHistory.isEmpty

          ? const Center(

        child: Text(
          "No scan history available",

          style: TextStyle(
            color: Colors.white70,
            fontSize: 18,
          ),
        ),
      )

          : ListView.builder(

        padding: const EdgeInsets.all(20),

        itemCount: scanHistory.length,

        itemBuilder: (context, index) {

          final item = scanHistory[index];

          final bool authentic =
              item["status"] == "Authentic";

          return Container(

            margin: const EdgeInsets.only(bottom: 18),

            padding: const EdgeInsets.all(20),

            decoration: BoxDecoration(

              color: Colors.white10,

              borderRadius:
              BorderRadius.circular(25),

              border: Border.all(
                color: Colors.white12,
              ),
            ),

            child: Row(

              children: [

                CircleAvatar(

                  radius: 28,

                  backgroundColor:
                  authentic
                      ? Colors.green
                      .withValues(alpha: 0.2)
                      : Colors.redAccent
                      .withValues(alpha: 0.2),

                  child: Icon(

                    authentic
                        ? Icons.verified
                        : Icons.warning,

                    color: authentic
                        ? Colors.green
                        : Colors.redAccent,
                  ),
                ),

                const SizedBox(width: 18),

                Expanded(

                  child: Column(

                    crossAxisAlignment:
                    CrossAxisAlignment.start,

                    children: [

                      Text(
                        item["file"],

                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 8),

                      Text(
                        item["status"],

                        style: TextStyle(
                          color: authentic
                              ? Colors.green
                              : Colors.redAccent,

                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),

                Text(
                  item["trust"],

                  style: TextStyle(
                    color: authentic
                        ? Colors.green
                        : Colors.redAccent,

                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}