#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

mkdir -p output &&
zip -r -FS output/mtab-v$EXTENSION_VERSION-source.zip * -x "*.git*" -x "node_modules/*" -x "assets/*" -x ".parcel-cache/*" -x "dist" -x "output/*" -x ".husky/*"
