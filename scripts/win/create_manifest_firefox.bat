@echo off
setlocal enabledelayedexpansion

REM Set the extension version
set EXTENSION_VERSION=1.0.8

REM Create the dist directory if it doesn't exist
if not exist dist mkdir dist

REM Write the content to manifest.json in the dist folder
(
echo {
echo   "manifest_version": 3,
echo   "version": "!EXTENSION_VERSION!",
echo   "name": "mtab",
echo   "author": "Max Hu",
echo   "description": "a simple configurable new tab extension",
echo   "permissions": ["storage", "bookmarks"],
echo   "background": { "scripts": ["sw.js"] },
echo   "host_permissions": ["https://duckduckgo.com/*"],
echo   "chrome_url_overrides": {
echo     "newtab": "index.html"
echo   },
echo   "icons": {
echo     "16": "16.png",
echo     "32": "32.png",
echo     "48": "48.png",
echo     "64": "64.png",
echo     "128": "128.png"
echo   },
echo   "action": {
echo     "default_icon": {
echo       "16": "16.png",
echo       "32": "32.png",
echo       "48": "48.png",
echo       "64": "64.png",
echo       "128": "128.png"
echo     },
echo     "default_title": "mtab",
echo     "default_popup": "popup.html"
echo   },
echo   "options_ui": {
echo     "page": "options.html"
echo   },
echo   "browser_specific_settings": {
echo     "gecko": {
echo       "id": "contact@maxhu.dev"
echo     }
echo   }
echo }
) > dist\manifest.json

REM Zip the contents of the dist folder
powershell -Command "Compress-Archive -Path dist\* -DestinationPath my-extension.zip -Force"
