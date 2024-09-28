#!/usr/bin/env bash

EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

manifest_content='{
  "manifest_version": 3,
  "version": "'$EXTENSION_VERSION'",
  "name": "mtab",
  "author": "Max Hu",
  "description": "a simple configurable new tab extension",
  "permissions": ["storage", "bookmarks"],
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "chrome_settings_overrides": {
    "homepage": "index.html"
  },
  "icons": {
    "16": "16.png",
    "32": "32.png",
    "48": "48.png",
    "64": "64.png",
    "128": "128.png"
  },
  "action": {
    "default_icon": {
      "16": "16.png",
      "32": "32.png",
      "48": "48.png",
      "64": "64.png",
      "128": "128.png"
    },
    "default_title": "mtab",
    "default_popup": "popup.html"
  },
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "contact@maxhu.dev"
    }
  }
}'

# write the content to manifest.json in the dist folder
echo "$manifest_content" > ./dist/manifest.json