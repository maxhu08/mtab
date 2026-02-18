#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

mkdir -p output &&
cd dist &&
zip -r -FS ../output/mtab-v$EXTENSION_VERSION-firefox.zip * --exclude "*.git*"
