#!/usr/bin/env bash
# Build the Android app and install it on every adb-connected device.
#   npm run install:android            debug dev client (needs `npx expo start` running)
#   npm run install:android -- release standalone build with the JS bundled in
set -euo pipefail
cd "$(dirname "$0")/.."

variant="${1:-debug}"
Variant="$(tr '[:lower:]' '[:upper:]' <<< "${variant:0:1}")${variant:1}"

[ -d android ] || npx expo prebuild --platform android
(cd android && ./gradlew "assemble$Variant")

apk="android/app/build/outputs/apk/$variant/app-$variant.apk"
devices=$(adb devices | awk 'NR > 1 && $2 == "device" { print $1 }')
[ -n "$devices" ] || { echo "No adb devices connected." >&2; exit 1; }

for d in $devices; do
  echo "Installing on $d"
  adb -s "$d" install -r "$apk"
  # lets a debug build reach Metro on this machine
  [ "$variant" = debug ] && adb -s "$d" reverse tcp:8081 tcp:8081
done
