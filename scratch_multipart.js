const fs = require('fs');

// 1. batch_scan_screen.dart
let batch = fs.readFileSync('lib/screens/batch_scan_screen.dart', 'utf8');
batch = batch.replace(
/await http\.MultipartFile\.fromPath\(\s*'media',\s*image\.path,\s*\)/g,
`http.MultipartFile.fromBytes('media', await image.readAsBytes(), filename: image.name)`
);
fs.writeFileSync('lib/screens/batch_scan_screen.dart', batch);

// 2. camera_screen.dart
let cam = fs.readFileSync('lib/screens/camera_screen.dart', 'utf8');
cam = cam.replace(/File imageFile = File\(image\.path\);/, 'final bytes = await image.readAsBytes();');
cam = cam.replace(
/await http\.MultipartFile\.fromPath\(\s*'media',\s*imageFile\.path,\s*\)/g,
`http.MultipartFile.fromBytes('media', bytes, filename: image.name)`
);
fs.writeFileSync('lib/screens/camera_screen.dart', cam);

// 3. audio_analysis_screen.dart
let audio = fs.readFileSync('lib/screens/audio_analysis_screen.dart', 'utf8');
audio = audio.replace(/FilePicker\.pickFiles\(\s*type:\s*FileType\.audio,\s*\)/g, `FilePicker.pickFiles(type: FileType.audio, withData: true)`);
audio = audio.replace(/if\s*\(result\s*==\s*null\s*\|\|\s*result\.files\.single\.path\s*==\s*null\)\s*return;/g, `if (result == null) return;`);
audio = audio.replace(/final\s*file\s*=\s*File\(result\.files\.single\.path!\);/g, `final bytes = result.files.single.bytes; final name = result.files.single.name; if (bytes == null) return;`);
audio = audio.replace(
/await http\.MultipartFile\.fromPath\(\s*'media',\s*file\.path,\s*\)/g,
`http.MultipartFile.fromBytes('media', bytes, filename: name)`
);
fs.writeFileSync('lib/screens/audio_analysis_screen.dart', audio);

console.log("All fromPath calls replaced with fromBytes!");
