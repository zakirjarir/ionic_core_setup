#!/bin/bash

set -euo pipefail

echo "══════════════════════════════════════════"
echo "🚀 Ionic Android Build & Launch Tool"
echo "══════════════════════════════════════════"
echo ""

# Load NVM

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
source "$NVM_DIR/nvm.sh"
fi

# Find Android Studio automatically

ANDROID_STUDIO_PATH=""

if command -v android-studio >/dev/null 2>&1; then
ANDROID_STUDIO_PATH=$(which android-studio)
elif [ -x "/snap/bin/android-studio" ]; then
ANDROID_STUDIO_PATH="/snap/bin/android-studio"
elif [ -x "/opt/android-studio/bin/studio.sh" ]; then
ANDROID_STUDIO_PATH="/opt/android-studio/bin/studio.sh"
fi

if [ -z "$ANDROID_STUDIO_PATH" ]; then
echo "❌ Android Studio not found."
echo "Please install Android Studio or configure the path manually."
exit 1
fi

echo "📍 Android Studio: $ANDROID_STUDIO_PATH"
echo ""

echo "📦 Step 1/3: Building Ionic App..."
ionic build

echo ""
echo "🔄 Step 2/3: Syncing Capacitor..."
npx cap sync android

echo ""
echo "📱 Step 3/3: Opening Android Studio..."
"$ANDROID_STUDIO_PATH" ./android >/dev/null 2>&1 &

echo ""
echo "══════════════════════════════════════════"
echo "✅ Build Completed Successfully"
echo "📂 Android project synced"
echo "🚀 Android Studio launched"
echo "══════════════════════════════════════════"
echo ""
