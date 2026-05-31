import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'screens/splash_screen.dart';
import 'data/design_system.dart';

void main() {
  runApp(
    const TruthPulseApp(),
  );
}

class TruthPulseApp extends StatelessWidget {
  const TruthPulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "TruthPulse",
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: FigmaTheme.spaceBg,
        primaryColor: FigmaTheme.neonPurple,
        colorScheme: const ColorScheme.dark(
          primary: FigmaTheme.neonPurple,
          secondary: FigmaTheme.neonBlue,
          surface: FigmaTheme.spaceMid,
          error: FigmaTheme.danger,
        ),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
          bodyLarge: GoogleFonts.outfit(color: FigmaTheme.textPrimary),
          bodyMedium: GoogleFonts.outfit(color: FigmaTheme.textPrimary),
          displayLarge: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          iconTheme: IconThemeData(color: FigmaTheme.textPrimary),
          titleTextStyle: TextStyle(
            color: FigmaTheme.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.w600,
            fontFamily: 'Outfit',
          ),
        ),
        snackBarTheme: SnackBarThemeData(
          backgroundColor: FigmaTheme.spaceCard,
          contentTextStyle: GoogleFonts.outfit(color: FigmaTheme.textPrimary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: FigmaTheme.glassBorder),
          ),
          behavior: SnackBarBehavior.floating,
        ),
      ),
      home: const SplashScreen(),
    );
  }
}