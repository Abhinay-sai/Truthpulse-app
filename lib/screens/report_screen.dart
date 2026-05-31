import 'package:flutter/material.dart';

class ReportScreen extends StatelessWidget {

  const ReportScreen({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
      const Color(0xFF0A0118),

      appBar: AppBar(

        backgroundColor: Colors.transparent,

        elevation: 0,

        title: const Text(
          "AI Reports",
          style: TextStyle(
            color: Colors.white,
          ),
        ),

        centerTitle: true,
      ),

      body: SingleChildScrollView(

        padding: const EdgeInsets.all(20),

        child: Column(

          crossAxisAlignment:
          CrossAxisAlignment.start,

          children: [

            const SizedBox(height: 10),

            // HEADER CARD

            Container(

              width: double.infinity,

              padding: const EdgeInsets.all(25),

              decoration: BoxDecoration(

                borderRadius:
                BorderRadius.circular(30),

                gradient: const LinearGradient(
                  colors: [
                    Colors.purpleAccent,
                    Colors.blue,
                  ],
                ),

                boxShadow: [

                  BoxShadow(
                    color:
                    Colors.purpleAccent
                        .withValues(alpha: 0.2),

                    blurRadius: 30,
                  ),
                ],
              ),

              child: const Column(

                crossAxisAlignment:
                CrossAxisAlignment.start,

                children: [

                  Text(
                    "TruthPulse Analytics",

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight:
                      FontWeight.bold,
                    ),
                  ),

                  SizedBox(height: 12),

                  Text(
                    "AI-powered media authenticity report dashboard.",

                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 35),

            // STATISTICS

            Row(

              children: [

                Expanded(
                  child: statsCard(
                    "156",
                    "Total Scans",
                    Colors.blue,
                  ),
                ),

                const SizedBox(width: 15),

                Expanded(
                  child: statsCard(
                    "92%",
                    "Accuracy",
                    Colors.green,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 15),

            Row(

              children: [

                Expanded(
                  child: statsCard(
                    "34",
                    "AI Generated",
                    Colors.redAccent,
                  ),
                ),

                const SizedBox(width: 15),

                Expanded(
                  child: statsCard(
                    "122",
                    "Authentic",
                    Colors.orange,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 40),

            // ANALYSIS TITLE

            const Text(
              "Analysis Summary",

              style: TextStyle(
                color: Colors.white,
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            reportTile(
              "CNN Detection Accuracy",
              "92%",
              Colors.green,
            ),

            reportTile(
              "Deepfake Detection",
              "88%",
              Colors.orange,
            ),

            reportTile(
              "False Positive Rate",
              "6%",
              Colors.redAccent,
            ),

            reportTile(
              "Processing Speed",
              "2.1 sec",
              Colors.blue,
            ),

            const SizedBox(height: 40),

            // AI SUMMARY CARD

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

              child: const Column(

                crossAxisAlignment:
                CrossAxisAlignment.start,

                children: [

                  Row(

                    children: [

                      Icon(
                        Icons.analytics,
                        color: Colors.purpleAccent,
                        size: 30,
                      ),

                      SizedBox(width: 12),

                      Text(
                        "AI System Summary",

                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: 20),

                  Text(
                    "TruthPulse uses TensorFlow CNN architecture integrated with Flutter and Python Flask backend to analyze media authenticity. The system evaluates image consistency, deepfake indicators, facial artifacts, and AI-generated visual patterns.",

                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                      height: 1.8,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // GRAPH PLACEHOLDER

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

                  const Text(
                    "AI Detection Graph",

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight:
                      FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 25),

                  Row(

                    mainAxisAlignment:
                    MainAxisAlignment.spaceAround,

                    crossAxisAlignment:
                    CrossAxisAlignment.end,

                    children: [

                      graphBar(
                        120,
                        Colors.green,
                        "Real",
                      ),

                      graphBar(
                        70,
                        Colors.redAccent,
                        "Fake",
                      ),

                      graphBar(
                        100,
                        Colors.blue,
                        "CNN",
                      ),

                      graphBar(
                        90,
                        Colors.orange,
                        "Trust",
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  // STATS CARD

  Widget statsCard(
      String value,
      String title,
      Color color,
      ) {

    return Container(

      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(

        color: Colors.white10,

        borderRadius:
        BorderRadius.circular(25),

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
              fontSize: 30,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 10),

          Text(
            title,

            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  // REPORT TILE

  Widget reportTile(
      String title,
      String value,
      Color color,
      ) {

    return Container(

      margin: const EdgeInsets.only(
        bottom: 18,
      ),

      padding: const EdgeInsets.all(22),

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

          Expanded(

            child: Text(
              title,

              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight:
                FontWeight.w600,
              ),
            ),
          ),

          Text(
            value,

            style: TextStyle(
              color: color,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  // GRAPH BAR

  Widget graphBar(
      double height,
      Color color,
      String label,
      ) {

    return Column(

      children: [

        Container(

          width: 45,
          height: height,

          decoration: BoxDecoration(

            color: color,

            borderRadius:
            BorderRadius.circular(15),
          ),
        ),

        const SizedBox(height: 10),

        Text(
          label,

          style: const TextStyle(
            color: Colors.white70,
            fontSize: 15,
          ),
        ),
      ],
    );
  }
}