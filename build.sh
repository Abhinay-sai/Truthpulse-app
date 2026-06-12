#!/bin/bash
# Install Flutter and build the web app on Netlify
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"
flutter config --enable-web
flutter pub get
flutter build web
