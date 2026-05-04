#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=${1:?project id required}
BUILD_ID=${2:?build id required}
WORKDIR=/workspace/builds/${BUILD_ID}

mkdir -p "$WORKDIR"
echo "[build:$BUILD_ID] starting for project $PROJECT_ID"

if [ ! -f "$WORKDIR/gradlew" ]; then
  echo "[build:$BUILD_ID] warning: gradlew missing in workspace snapshot"
fi

cd "$WORKDIR"
./gradlew assembleDebug --stacktrace || {
  echo "[build:$BUILD_ID] gradle build failed"
  exit 1
}

APK_PATH=$(find . -type f -name "*debug*.apk" | head -n 1 || true)
if [ -z "${APK_PATH}" ]; then
  echo "[build:$BUILD_ID] no APK found"
  exit 2
fi

echo "[build:$BUILD_ID] apk artifact: $APK_PATH"
