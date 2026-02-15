#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

mkdir -p package &&
cd dist &&
zip -r -FS ../package/mtab-v$EXTENSION_VERSION-firefox.zip * --exclude "*.git*"
