#!/bin/bash

# define the source and destination directories
src_dir="./src/assets"
dist_dir="./dist"

# loop through the specified files and copy them to the destination directory
for file in "16.png" "32.png" "48.png" "64.png" "128.png"; do
  cp "$src_dir/$file" "$dist_dir"
  echo "copied $file to $dist_dir"
done
