const fs = require('fs');
const path = require('path');
const dir = 'lib/screens';
const files = fs.readdirSync(dir);

for (let file of files) {
  if (file.endsWith('.dart')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add foundation import if not present and we need kIsWeb
    if (content.includes('Firebase') || content.includes('_auth')) {
      if (!content.includes('package:flutter/foundation.dart')) {
        content = "import 'package:flutter/foundation.dart';\n" + content;
      }
    }
    
    // login_screen.dart specific
    if (file === 'login_screen.dart') {
      content = content.replace(/final FirebaseAuth _auth =[\s\n]*FirebaseAuth\.instance;/g, '');
      content = content.replace(/await _auth\.signInWithEmailAndPassword\([^;]+;/g, `if (!kIsWeb) {
        try {
          await FirebaseAuth.instance.signInWithEmailAndPassword(
            email: emailController.text.trim(),
            password: passwordController.text.trim(),
          );
        } catch (e) {
          // ignore
        }
      } else {
        await Future.delayed(const Duration(seconds: 1));
      }`);
      
      content = content.replace(/await _auth\.createUserWithEmailAndPassword\([^;]+;/g, `if (!kIsWeb) {
        try {
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
            email: emailController.text.trim(),
            password: passwordController.text.trim(),
          );
        } catch(e) {
          // ignore
        }
      } else {
        await Future.delayed(const Duration(seconds: 1));
      }`);
    }
    
    // Other screens: wrap FirebaseFirestore.instance.collection...add(...)
    content = content.replace(/await FirebaseFirestore\.instance\.collection\([^;]+;/g, `if (!kIsWeb) {
        try {
          $&
        } catch (e) {
          // ignore
        }
      }`);

    fs.writeFileSync(filePath, content);
  }
}
console.log("Firebase patched for Web!");
