#!/usr/bin/env bash

EXTENSION_VERSION="${EXTENSION_VERSION:-$(cat EXTENSION_VERSION.txt)}"
ZIP_VERSION="${EXTENSION_ZIP_VERSION:-$EXTENSION_VERSION}"
PACKAGE_DIR_SUFFIX="${PACKAGE_DIR_SUFFIX:-}"
PACKAGE_ZIP_SUFFIX="${PACKAGE_ZIP_SUFFIX:-$PACKAGE_DIR_SUFFIX}"
PACKAGE_DIR_NAME="mtab-v$ZIP_VERSION-chrome$PACKAGE_DIR_SUFFIX"
PACKAGE_ZIP_NAME="mtab-v$ZIP_VERSION-chrome$PACKAGE_ZIP_SUFFIX.zip"

mkdir -p output &&
cd dist &&
mkdir -p "../output/$PACKAGE_DIR_NAME" &&
cp -a . "../output/$PACKAGE_DIR_NAME/" &&
zip -r -FS "../output/$PACKAGE_ZIP_NAME" * --exclude "*.git*" &&
echo "Build complete" &&
echo "Extension: /output/$PACKAGE_DIR_NAME" &&
echo "Zip: /output/$PACKAGE_ZIP_NAME"
