import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import '../data/auth_service.dart';
import '../data/design_system.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  
  bool _isLoading = true;
  bool _isSaving = false;
  String? _error;
  String? _profilePhotoBase64;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getCurrentUser();
    if (user != null) {
      setState(() {
        _nameController.text = user['name'] ?? '';
        _emailController.text = user['email'] ?? '';
        _profilePhotoBase64 = user['profilePhoto'];
        _isLoading = false;
      });
    } else {
      setState(() {
        _error = "Failed to load user profile.";
        _isLoading = false;
      });
    }
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    try {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery, maxWidth: 400, maxHeight: 400, imageQuality: 70);
      if (pickedFile != null) {
        final bytes = await pickedFile.readAsBytes();
        final base64String = base64Encode(bytes);
        setState(() {
          _profilePhotoBase64 = 'data:image/jpeg;base64,$base64String';
        });
      }
    } catch (e) {
      debugPrint("Error picking image: $e");
    }
  }

  Future<void> _saveChanges() async {
    setState(() {
      _error = null;
      _isSaving = true;
    });

    try {
      final token = await AuthService.getToken();
      if (token == null) throw Exception("No auth token");

      final body = {
        'name': _nameController.text.trim(),
      };
      
      if (_profilePhotoBase64 != null) {
        body['profilePhoto'] = _profilePhotoBase64!;
      }
      
      if (_passwordController.text.isNotEmpty) {
        if (_passwordController.text.length < 6) {
          throw Exception("Password must be at least 6 characters.");
        }
        body['password'] = _passwordController.text;
      }

      final response = await http.put(
        Uri.parse('${AuthService.baseUrl}/auth/update'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // Save new user info locally
        await AuthService.saveUser(data['user']);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Profile updated successfully!')),
          );
          Navigator.pop(context); // Go back to profile screen
        }
      } else {
        throw Exception(data['error'] ?? 'Update failed');
      }
    } catch (e) {
      setState(() {
        _error = e.toString().replaceAll("Exception: ", "");
      });
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FigmaBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          title: const Text("Edit Profile", style: TextStyle(color: FigmaTheme.textPrimary)),
          iconTheme: const IconThemeData(color: FigmaTheme.textPrimary),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator(color: FigmaTheme.neonPurple))
            : SingleChildScrollView(
                padding: const EdgeInsets.all(25),
                child: Column(
                  children: [
                    Center(
                      child: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          GestureDetector(
                            onTap: _pickImage,
                            child: Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: FigmaTheme.buttonGradient,
                                boxShadow: FigmaTheme.purpleGlow(radius: 20, opacity: 0.3),
                                image: _profilePhotoBase64 != null && _profilePhotoBase64!.isNotEmpty
                                    ? DecorationImage(
                                        image: MemoryImage(base64Decode(_profilePhotoBase64!.split(',').last)),
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                              child: _profilePhotoBase64 == null || _profilePhotoBase64!.isEmpty
                                  ? const Icon(Icons.person, size: 60, color: Colors.white)
                                  : null,
                            ),
                          ),
                          GestureDetector(
                            onTap: _pickImage,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: FigmaTheme.spaceMid,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.camera_alt, color: FigmaTheme.neonCyan, size: 20),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 40),
                    
                    if (_error != null) ...[
                      Text(_error!, style: const TextStyle(color: FigmaTheme.danger, fontSize: 14)),
                      const SizedBox(height: 10),
                    ],

                    _buildTextField("Display Name", _nameController, false),
                    const SizedBox(height: 20),
                    _buildTextField("Email (Read Only)", _emailController, true),
                    const SizedBox(height: 20),
                    _buildTextField("New Password (Optional)", _passwordController, false, obscure: true),
                    
                    const SizedBox(height: 40),
                    FigmaGradientButton(
                      onPressed: _isSaving ? () {} : _saveChanges,
                      label: _isSaving ? "SAVING..." : "SAVE CHANGES",
                      fullWidth: true,
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, bool readOnly, {bool obscure = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: FigmaTheme.textMuted, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          readOnly: readOnly,
          obscureText: obscure,
          style: TextStyle(color: readOnly ? FigmaTheme.textMuted : FigmaTheme.textPrimary),
          decoration: InputDecoration(
            filled: true,
            fillColor: FigmaTheme.spaceInput,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
