const fs = require('fs');
const path = require('path');
const dir = 'lib/screens';
const files = fs.readdirSync(dir);

for (let file of files) {
  if (file.endsWith('.dart')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('http://10.0.2.2:5000')) {
      if (!content.includes('package:flutter/foundation.dart')) {
        content = "import 'package:flutter/foundation.dart';\n" + content;
      }
      
      content = content.replace(/'http:\/\/10\.0\.2\.2:5000([^']+)'/g, "(kIsWeb ? 'http://localhost:5000$1' : 'http://10.0.2.2:5000$1')");
      
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + file);
    }
  }
}
