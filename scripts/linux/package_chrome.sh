#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

mkdir -p package &&
cd dist &&
# messy but need it in case zip command runs before parcel is done buildling
sleep 5 &&
zip -r -FS ../package/mtab-v$EXTENSION_VERSION-chrome.zip * --exclude '*.git*'