#!/usr/bin/env bash

set -euo pipefail

TARGET="${1:-}"

if [[ "$TARGET" != "chrome" && "$TARGET" != "firefox" ]]; then
  echo "Usage: $0 <chrome|firefox>"
  exit 1
fi

read -r -p "Enter release candidate version (example: 1.10.8-rc1): " RC_VERSION

if [[ ! "$RC_VERSION" =~ ^([0-9]+\.[0-9]+\.[0-9]+)-rc([0-9A-Za-z.-]*)$ ]]; then
  echo "Invalid RC version. Expected format like 1.10.8-rc1."
  exit 1
fi

BASE_VERSION="${BASH_REMATCH[1]}"

bun clean

if [[ "$TARGET" == "chrome" ]]; then
  mkdir -p dist
  bun x parcel build src/**/*.html --no-source-maps --no-scope-hoist
  EXTENSION_VERSION="$BASE_VERSION" ./scripts/linux/create_manifest_chrome.sh
  ./scripts/linux/copy_assets.sh
  ./scripts/linux/copy_sw.sh
else
  mkdir -p dist
  bun x parcel build src/**/*.html --no-source-maps --no-scope-hoist
  EXTENSION_VERSION="$BASE_VERSION" ./scripts/linux/create_manifest_firefox.sh
  ./scripts/linux/copy_assets.sh
  ./scripts/linux/copy_sw.sh
fi

for FILE in dist/options.html dist/index.html; do
  if [[ ! -f "$FILE" ]]; then
    echo "Missing expected file: $FILE"
    exit 1
  fi

  if [[ "$FILE" == "dist/index.html" ]]; then
    perl -i -pe 'if (!$done) { s/<html\b([^>]*)>/<html$1 data-display-version="'"$RC_VERSION"'" extension-version="'"$RC_VERSION"'">/ and $done = 1 }' "$FILE"
  else
    perl -i -pe 'if (!$done) { s/<html\b([^>]*)>/<html$1 data-display-version="'"$RC_VERSION"'">/ and $done = 1 }' "$FILE"
  fi
done

if [[ "$TARGET" == "chrome" ]]; then
  EXTENSION_VERSION="$BASE_VERSION" EXTENSION_ZIP_VERSION="$RC_VERSION" PACKAGE_DIR_SUFFIX="" PACKAGE_ZIP_SUFFIX="-rc" ./scripts/linux/package_chrome.sh
else
  EXTENSION_VERSION="$BASE_VERSION" EXTENSION_ZIP_VERSION="$RC_VERSION" PACKAGE_DIR_SUFFIX="" PACKAGE_ZIP_SUFFIX="-rc" ./scripts/linux/package_firefox.sh
fi

echo "RC package complete."
echo "Manifest version: $BASE_VERSION"
echo "Display version: $RC_VERSION"
