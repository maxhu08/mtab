EXTENSION_VERSION=$(cat EXTENSION_VERSION.txt)

zip -r -FS ../mtab-v$EXTENSION_VERSION-source.zip * -x "*.git*" -x "node_modules/*" -x "assets/*" -x ".parcel-cache/*" -x "dist" -x "package/*" -x ".husky/*"