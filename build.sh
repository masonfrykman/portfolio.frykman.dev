#!/bin/bash

echo "Clearing build directory"
rm build/*

# TS -> JS in dist/
echo ""
echo "Compiling Typescript to Javascript"
echo "  > tsc"
tsc

echo ""
echo "Bundling & minifying Javascript"
# Bundle & minify JS
echo "  > rollup"
rollup build/index.js --file build/bundle.js --format es
echo "  > minify"
minify build/bundle.js > dist/bundle.min.js

# Copy over assets from src/ -> dist/
echo ""
echo "Copying assets"
cd src
# HTML
for filename in *.html; do
    minify $filename > ../dist/$filename
done

# CSS
for filename in *.css; do
    minify $filename > ../dist/$filename
done
cd ..

cp src/projects_info.json dist/projects_info.json
cp src/sitemap.xml dist/sitemap.xml

echo ""
echo "Bundling js + assets"
# Package for quick upload
tar -cz dist/ > build.tar.gz

echo "Done!"