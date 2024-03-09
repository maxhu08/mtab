#!/bin/bash

# Define the content of the manifest.json
manifest_content='{
  "manifest_version": 3,
  "name": "mtab",
  "description": "simple new tab page for chrome",
  "version": "0.0.1",
  "action": {
    "default_title": "mtab_title"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": []
}'

# Write the content to manifest.json in the dist folder
echo "$manifest_content" > ./dist/manifest.json