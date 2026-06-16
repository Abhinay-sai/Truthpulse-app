import 'package:flutter/material.dart';

class ResultScreen extends StatelessWidget {

  final String aiProbability;
  final String trustScore;
  final String status;
  final String explanation;
  final String processingTime;
  final String scanAccuracy;
  final bool showAiSuggestions;

  const ResultScreen({

    super.key,

    required this.aiProbability,
    required this.trustScore,
    required this.status,
    required this.explanation,
    required this.processingTime,
    required this.scanAccuracy,
    this.showAiSuggestions = true,
  });

  @override
  Widget build(BuildContext context) {

    final bool isAuthentic =
        status == "Authentic";

    return Scaffold(

      backgroundColor: const Color(0xFF0A0118),

      appBar: AppBar(

        backgroundColor: Colors.transparent,

        elevation: 0,

        title: const Text(
          "AI Analysis Result",
          style: TextStyle(color: Colors.white),
        ),

        centerTitle: true,
      ),

      body: SafeArea(

        child: SingleChildScrollView(

          padding: const EdgeInsets.all(20),

          child: Column(

            children: [

              const SizedBox(height: 20),

              // STATUS ICON

              Container(

                width: 150,
                height: 150,

                decoration: BoxDecoration(

                  shape: BoxShape.circle,

                  gradient: LinearGradient(

                    colors: isAuthentic
                        ? [
                      Colors.green,
                      Colors.teal,
                    ]
                        : [
                      Colors.redAccent,
                      Colors.orange,
                    ],
                  ),

                  boxShadow: [

                    BoxShadow(
                      color: (isAuthentic
                          ? Colors.green
                          : Colors.redAccent)
                          .withValues(alpha: 0.2),

                      blurRadius: 35,
                    ),
                  ],
                ),

                child: Icon(

                  isAuthentic
                      ? Icons.verified
                      : Icons.warning_rounded,

                  color: Colors.white,

                  size: 80,
                ),
              ),

              const SizedBox(height: 30),

              // STATUS TEXT

              Text(
                status,

                style: TextStyle(

                  color: isAuthentic
                      ? Colors.green
                      : Colors.redAccent,

                  fontSize: 32,

                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 12),

              const Text(
                "AI authenticity analysis completed",

                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 40),

              // SCORE CARDS

              Row(

                children: [

                  Expanded(

                    child: scoreCard(
                      "Trust Score",
                      trustScore,
                      Colors.green,
                    ),
                  ),

                  const SizedBox(width: 15),

                  Expanded(

                    child: scoreCard(
                      "AI Probability",
                      aiProbability,
                      Colors.redAccent,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 35),

              if (showAiSuggestions) // AI EXPLANATION CARD

              Container(

                width: double.infinity,

                padding: const EdgeInsets.all(25),

                decoration: BoxDecoration(

                  color: Colors.white10,

                  borderRadius:
                  BorderRadius.circular(30),

                  border: Border.all(
                    color: Colors.white12,
                  ),
                ),

                child: Column(

                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [

                    Row(

                      children: [

                        const Icon(
                          Icons.analytics,
                          color: Colors.purpleAccent,
                        ),

                        const SizedBox(width: 10),

                        const Text(
                          "AI Explanation",

                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    Text(
                      explanation,

                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                        height: 1.7,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 35),

              // DETAILS CARD

              Container(

                width: double.infinity,

                padding: const EdgeInsets.all(25),

                decoration: BoxDecoration(

                  color: Colors.white10,

                  borderRadius:
                  BorderRadius.circular(30),

                  border: Border.all(
                    color: Colors.white12,
                  ),
                ),

                child: Column(

                  children: [

                    detailRow(
                      "Detection Model",
                      "Gemini Vision AI",
                    ),

                    const SizedBox(height: 18),

                    detailRow(
                      "Analysis Status",
                      "Completed",
                    ),

                    const SizedBox(height: 18),

                    detailRow(
                      "Scan Accuracy",
                      scanAccuracy,
                    ),

                    const SizedBox(height: 18),

                    detailRow(
                      "Processing Time",
                      processingTime,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // BUTTONS

              Row(

                children: [

                  Expanded(

                    child: actionButton(
                      "Scan Again",
                      Colors.purpleAccent,
                          () {

                        Navigator.pop(context);
                      },
                    ),
                  ),

                  const SizedBox(width: 15),

                  Expanded(

                    child: actionButton(
                      "Download",
                      Colors.blue,
                          () {},
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),

            ],
          ),
        ),
      ),
    );
  }

  // SCORE CARD

  Widget scoreCard(
      String title,
      String value,
      Color color,
      ) {

    return Container(

      padding: const EdgeInsets.all(25),

      decoration: BoxDecoration(

        color: Colors.white10,

        borderRadius: BorderRadius.circular(25),

        border: Border.all(
          color: Colors.white12,
        ),
      ),

      child: Column(

        children: [

          Text(
            value,

            style: TextStyle(
              color: color,
              fontSize: 34,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 12),

          Text(
            title,

            textAlign: TextAlign.center,

            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  // DETAIL ROW

  Widget detailRow(
      String title,
      String value,
      ) {

    return Row(

      mainAxisAlignment:
      MainAxisAlignment.spaceBetween,

      children: [

        Text(
          title,

          style: const TextStyle(
            color: Colors.white70,
            fontSize: 16,
          ),
        ),

        Text(
          value,

          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  // ACTION BUTTON

  Widget actionButton(
      String title,
      Color color,
      VoidCallback onPressed,
      ) {

    return Container(

      height: 60,

      decoration: BoxDecoration(

        gradient: LinearGradient(
          colors: [
            color,
            Colors.blueAccent,
          ],
        ),

        borderRadius: BorderRadius.circular(20),

        boxShadow: [

          BoxShadow(
            color: color.withValues(alpha: 0.2),
            blurRadius: 20,
          ),
        ],
      ),

      child: ElevatedButton(

        style: ElevatedButton.styleFrom(

          backgroundColor: Colors.transparent,

          shadowColor: Colors.transparent,
        ),

        onPressed: onPressed,

        child: Text(
          title,

          style: const TextStyle(
            color: Colors.white,
            fontSize: 17,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}