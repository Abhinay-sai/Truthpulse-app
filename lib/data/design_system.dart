import 'dart:ui';
import 'package:flutter/material.dart';

// ============================================================
// FIGMA DESIGN SYSTEM — Exact tokens from figmaappidea theme
// ============================================================
class FigmaTheme {
  // Core colors
  static const Color spaceBg = Color(0xFF0A0118);
  static const Color spaceMid = Color(0xFF1A0A30);
  static const Color spaceCard = Color(0x66110A28); // rgba(17,10,40,0.4)
  static const Color spaceInput = Color(0x99110A28); // rgba(17,10,40,0.6)

  // Neon accents
  static const Color neonPurple = Color(0xFF8B5CF6);
  static const Color neonBlue = Color(0xFF3B82F6);
  static const Color neonCyan = Color(0xFF06B6D4);

  // Glass borders
  static const Color glassBorder = Color(0x4D8B5CF6); // rgba(139,92,246,0.3)
  static const Color glassBorderDim = Color(0x1A8B5CF6); // rgba(139,92,246,0.1)

  // Typography
  static const Color textPrimary = Color(0xFFE4E4F0);
  static const Color textMuted = Color(0xFFA8A8C0);

  // Status colors
  static const Color success = Color(0xFF4ADE80);
  static const Color danger = Color(0xFFEF4444);

  // Gradients
  static const LinearGradient buttonGradient = LinearGradient(
    colors: [neonPurple, neonBlue],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient backgroundGradient = LinearGradient(
    colors: [spaceBg, spaceMid, spaceBg],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // Glow shadows
  static List<BoxShadow> purpleGlow({double radius = 20, double opacity = 0.3}) => [
        BoxShadow(
          color: neonPurple.withValues(alpha: opacity),
          blurRadius: radius,
          spreadRadius: radius * 0.1,
        ),
      ];

  static List<BoxShadow> cardShadow = [
    BoxShadow(
      color: neonPurple.withValues(alpha: 0.15),
      blurRadius: 32,
      offset: const Offset(0, 8),
    ),
  ];
}

// ============================================================
// 1. FIGMA BACKGROUND — matches App.tsx gradient
// ============================================================
class FigmaBackground extends StatelessWidget {
  final Widget child;
  const FigmaBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [FigmaTheme.spaceBg, FigmaTheme.spaceMid, FigmaTheme.spaceBg],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Stack(
        children: [
          // Ambient purple glow top-left (from App.tsx radial gradients)
          Positioned(
            top: -80,
            left: -80,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    FigmaTheme.neonPurple.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          // Ambient blue glow bottom-right
          Positioned(
            bottom: -60,
            right: -60,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    FigmaTheme.neonBlue.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

// ============================================================
// 2. FIGMA GLASS CARD — matches GlassCard.tsx exactly
// ============================================================
class FigmaGlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final bool dashedBorder;
  final Color? borderColor;

  const FigmaGlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.borderRadius = 20,
    this.dashedBorder = false,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: FigmaTheme.cardShadow,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: FigmaTheme.spaceCard,
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: borderColor ?? FigmaTheme.glassBorder,
                width: 1.5,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

// ============================================================
// 3. FIGMA GRADIENT BUTTON — matches GradientButton.tsx
// ============================================================
class FigmaGradientButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final String label;
  final Widget? icon;
  final double height;
  final bool isOutline;
  final bool isSecondary;
  final bool fullWidth;

  const FigmaGradientButton({
    super.key,
    required this.onPressed,
    required this.label,
    this.icon,
    this.height = 52,
    this.isOutline = false,
    this.isSecondary = false,
    this.fullWidth = false,
  });

  @override
  State<FigmaGradientButton> createState() => _FigmaGradientButtonState();
}

class _FigmaGradientButtonState extends State<FigmaGradientButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 120));
    _scale = Tween(begin: 1.0, end: 0.95)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool disabled = widget.onPressed == null;

    return GestureDetector(
      onTapDown: (_) => disabled ? null : _controller.forward(),
      onTapUp: (_) => disabled ? null : _controller.reverse(),
      onTapCancel: () => disabled ? null : _controller.reverse(),
      onTap: widget.onPressed,
      child: AnimatedBuilder(
        animation: _scale,
        builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
        child: SizedBox(
          width: widget.fullWidth ? double.infinity : null,
          height: widget.height,
          child: widget.isOutline
              ? Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(color: FigmaTheme.neonPurple, width: 2),
                  ),
                  child: Center(
                    child: _buildContent(color: FigmaTheme.neonPurple),
                  ),
                )
              : Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(100),
                    gradient: disabled
                        ? LinearGradient(colors: [
                            Colors.grey.shade800,
                            Colors.grey.shade700
                          ])
                        : widget.isSecondary
                            ? const LinearGradient(
                                colors: [FigmaTheme.neonBlue, FigmaTheme.neonCyan],
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                              )
                            : FigmaTheme.buttonGradient,
                    boxShadow: disabled
                        ? null
                        : [
                            BoxShadow(
                              color: FigmaTheme.neonPurple.withValues(alpha: 0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 4),
                            ),
                          ],
                  ),
                  child: Center(
                    child: _buildContent(color: Colors.white),
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildContent({required Color color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.icon != null) ...[
          widget.icon!,
          const SizedBox(width: 8),
        ],
        Text(
          widget.label,
          style: TextStyle(
            color: color,
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }
}

// ============================================================
// 4. FIGMA TEXT FIELD — matches input styles in LoginScreen.tsx
// ============================================================
class FigmaTextField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final String placeholder;
  final IconData prefixIcon;
  final bool obscureText;

  const FigmaTextField({
    super.key,
    required this.controller,
    required this.label,
    required this.placeholder,
    required this.prefixIcon,
    this.obscureText = false,
  });

  @override
  State<FigmaTextField> createState() => _FigmaTextFieldState();
}

class _FigmaTextFieldState extends State<FigmaTextField> {
  final FocusNode _focus = FocusNode();
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() => _focused = _focus.hasFocus));
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label,
          style: const TextStyle(
            color: FigmaTheme.textMuted,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            boxShadow: _focused ? FigmaTheme.purpleGlow(radius: 8, opacity: 0.25) : null,
          ),
          child: TextField(
            controller: widget.controller,
            focusNode: _focus,
            obscureText: widget.obscureText,
            style: const TextStyle(color: FigmaTheme.textPrimary, fontSize: 16),
            decoration: InputDecoration(
              prefixIcon: Icon(
                widget.prefixIcon,
                color: _focused ? FigmaTheme.neonPurple : FigmaTheme.textMuted,
                size: 20,
              ),
              hintText: widget.placeholder,
              hintStyle: TextStyle(color: FigmaTheme.textMuted.withValues(alpha: 0.6)),
              filled: true,
              fillColor: FigmaTheme.spaceInput,
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: FigmaTheme.glassBorder,
                  width: 1.5,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: FigmaTheme.neonPurple,
                  width: 2,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ============================================================
// 5. FIGMA PROGRESS BAR — matches trust score bar in Dashboard
// ============================================================
class FigmaProgressBar extends StatelessWidget {
  final double value; // 0.0 to 1.0

  const FigmaProgressBar({super.key, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 8,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(100),
      ),
      child: FractionallySizedBox(
        widthFactor: value.clamp(0.0, 1.0),
        alignment: Alignment.centerLeft,
        child: Container(
          decoration: BoxDecoration(
            gradient: FigmaTheme.buttonGradient,
            borderRadius: BorderRadius.circular(100),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// 6. FIGMA ICON BADGE — matches icon containers in MenuScreen/Dashboard
// ============================================================
class FigmaIconBadge extends StatelessWidget {
  final IconData? icon;
  final String? imageAsset;
  final Color? iconColor;
  final double size;

  const FigmaIconBadge({
    super.key,
    this.icon,
    this.imageAsset,
    this.iconColor,
    this.size = 40,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        gradient: LinearGradient(
          colors: [
            FigmaTheme.neonPurple.withValues(alpha: 0.2),
            FigmaTheme.neonBlue.withValues(alpha: 0.2),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: imageAsset != null
          ? ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.asset(imageAsset!, fit: BoxFit.cover),
            )
          : Icon(
              icon,
              color: iconColor ?? FigmaTheme.neonPurple,
              size: size * 0.5,
            ),
    );
  }
}

// ============================================================
// 7. FIGMA ANIMATED TAP — Adds a micro-bounce effect on tap
// ============================================================
class FigmaAnimatedTap extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;

  const FigmaAnimatedTap({
    super.key,
    required this.child,
    this.onTap,
  });

  @override
  State<FigmaAnimatedTap> createState() => _FigmaAnimatedTapState();
}

class _FigmaAnimatedTapState extends State<FigmaAnimatedTap>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 150));
    _scale = Tween(begin: 1.0, end: 0.94)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        if (widget.onTap != null) _controller.forward();
      },
      onTapUp: (_) {
        if (widget.onTap != null) {
          _controller.reverse();
          widget.onTap!();
        }
      },
      onTapCancel: () {
        if (widget.onTap != null) _controller.reverse();
      },
      child: AnimatedBuilder(
        animation: _scale,
        builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
        child: widget.child,
      ),
    );
  }
}

// ============================================================
// 8. FIGMA STAGGERED ENTRANCE — Slides and fades elements in sequentially
// ============================================================
class FigmaStaggeredEntrance extends StatefulWidget {
  final Widget child;
  final int index;
  final double delayMultiplier;

  const FigmaStaggeredEntrance({
    super.key,
    required this.child,
    required this.index,
    this.delayMultiplier = 0.1, // 100ms per index
  });

  @override
  State<FigmaStaggeredEntrance> createState() => _FigmaStaggeredEntranceState();
}

class _FigmaStaggeredEntranceState extends State<FigmaStaggeredEntrance> {
  bool _isVisible = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(
      Duration(milliseconds: (widget.index * widget.delayMultiplier * 1000).toInt() + 100),
      () {
        if (mounted) {
          setState(() {
            _isVisible = true;
          });
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSlide(
      duration: const Duration(milliseconds: 800),
      curve: Curves.easeOutQuart,
      offset: _isVisible ? Offset.zero : const Offset(0, 0.15),
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeOut,
        opacity: _isVisible ? 1.0 : 0.0,
        child: widget.child,
      ),
    );
  }
}

// ============================================================
// 9. FIGMA PAGE ROUTE — Custom smooth fade and slide transition
// ============================================================
class FigmaPageRoute<T> extends PageRouteBuilder<T> {
  final Widget child;

  FigmaPageRoute({required this.child})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => child,
          transitionDuration: const Duration(milliseconds: 400),
          reverseTransitionDuration: const Duration(milliseconds: 300),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curvedAnimation = CurvedAnimation(parent: animation, curve: Curves.easeOutCubic);
            return FadeTransition(
              opacity: curvedAnimation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.05), // Starts slightly below
                  end: Offset.zero,
                ).animate(curvedAnimation),
                child: child,
              ),
            );
          },
        );
}

