#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

cd dist &&
zip -r -FS ../mtab-v$EXTENSION_VERSION-firefox.zip * --exclude '*.git*'