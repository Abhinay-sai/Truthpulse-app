import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../data/auth_service.dart';
import '../data/design_system.dart';
import 'quiz_result_screen.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  List<dynamic> questions = [];
  bool isLoading = true;
  String? error;
  int currentIndex = 0;
  int score = 0;

  @override
  void initState() {
    super.initState();
    _fetchQuiz();
  }

  Future<void> _fetchQuiz() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        setState(() {
          error = 'Please log in to take the quiz.';
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse('${AuthService.baseUrl}/quiz'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          questions = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed to load quiz questions.';
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

  void _answerQuestion(bool isAiSelected) {
    final currentQ = questions[currentIndex];
    final bool isActuallyAi = currentQ['isAiGenerated'];
    final bool correct = (isAiSelected == isActuallyAi);

    if (correct) {
      score++;
    }

    // Show feedback bottom sheet
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isDismissible: false,
      enableDrag: false,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: FigmaTheme.spaceMid,
          borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
          border: Border(top: BorderSide(color: FigmaTheme.glassBorder, width: 2)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  correct ? Icons.check_circle : Icons.cancel,
                  color: correct ? FigmaTheme.success : FigmaTheme.danger,
                  size: 30,
                ),
                const SizedBox(width: 10),
                Text(
                  correct ? "Correct!" : "Incorrect!",
                  style: TextStyle(
                    color: correct ? FigmaTheme.success : FigmaTheme.danger,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            Text(
              currentQ['explanation'] ?? '',
              style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 25),
            FigmaGradientButton(
              onPressed: () {
                Navigator.pop(context);
                _nextQuestion();
              },
              label: currentIndex < questions.length - 1 ? "Next Question" : "View Results",
              fullWidth: true,
            ),
          ],
        ),
      ),
    );
  }

  void _nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setState(() {
        currentIndex++;
      });
    } else {
      Navigator.pushReplacement(context, FigmaPageRoute(child: QuizResultScreen(score: score, total: questions.length)));
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
          title: const Text("Spot the Fake", style: TextStyle(color: FigmaTheme.textPrimary)),
          iconTheme: const IconThemeData(color: FigmaTheme.textPrimary),
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
            : error != null
                ? Center(
                    child: Text(error!, style: const TextStyle(color: FigmaTheme.danger, fontSize: 16)),
                  )
                : Padding(
                    padding: const EdgeInsets.all(25),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Question ${currentIndex + 1} of ${questions.length}",
                          style: const TextStyle(color: FigmaTheme.neonPurple, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 15),
                        const Text(
                          "Is this image Real or AI?",
                          style: TextStyle(color: FigmaTheme.textPrimary, fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 30),
                        Container(
                          height: 300,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: FigmaTheme.glassBorder, width: 2),
                            image: DecorationImage(
                              image: NetworkImage(questions[currentIndex]['imageUrl']),
                              fit: BoxFit.cover,
                            ),
                            boxShadow: FigmaTheme.purpleGlow(radius: 20, opacity: 0.2),
                          ),
                        ),
                        const SizedBox(height: 50),
                        Row(
                          children: [
                            Expanded(
                              child: FigmaAnimatedTap(
                                onTap: () => _answerQuestion(false),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 18),
                                  decoration: BoxDecoration(
                                    color: FigmaTheme.success.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(15),
                                    border: Border.all(color: FigmaTheme.success, width: 2),
                                  ),
                                  child: const Center(
                                    child: Text(
                                      "REAL",
                                      style: TextStyle(color: FigmaTheme.success, fontWeight: FontWeight.bold, fontSize: 18),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: FigmaAnimatedTap(
                                onTap: () => _answerQuestion(true),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 18),
                                  decoration: BoxDecoration(
                                    color: FigmaTheme.danger.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(15),
                                    border: Border.all(color: FigmaTheme.danger, width: 2),
                                  ),
                                  child: const Center(
                                    child: Text(
                                      "AI",
                                      style: TextStyle(color: FigmaTheme.danger, fontWeight: FontWeight.bold, fontSize: 18),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }
}
