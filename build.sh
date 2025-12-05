#!/bin/bash

echo "Clearing build & dist directories"
rm -rf build/
rm -rf dist/

# TS -> JS in build/
echo ""
echo "Compiling Typescript to Javascript"
echo "  > tsc"
tsc
if [[ $? -ne 0 ]]; then
    echo "BUILD FAILED"
    exit 1
fi

echo ""
echo "Bundling & minifying Javascript"
# Bundle & minify JS
echo "  > rollup"
rollup build/index.js --file build/bundle.js --format es
if [[ $? -ne 0 ]]; then
    echo "BUILD FAILED"
    exit 1
fi

echo "  > minify"
mkdir dist
minify build/bundle.js > dist/bundle.min.js
if [[ $? -ne 0 ]]; then
    echo "BUILD FAILED"
    exit 1
fi

# Copy over assets from src/ -> dist/
echo ""
echo "Copying assets"
cd src
# HTML
for filename in *.html; do
    minify $filename > ../dist/$filename
    if [[ $? -ne 0 ]]; then
        echo "BUILD FAILED"
        exit 1
    fi
done

# CSS
for filename in *.css; do
    minify $filename > ../dist/$filename
    if [[ $? -ne 0 ]]; then
        echo "BUILD FAILED"
        exit 1
    fi
done
cd ..

cp src/projects_info.json dist/projects_info.json
if [[ $? -ne 0 ]]; then
    echo "BUILD FAILED"
    exit 1
fi

cp src/sitemap.xml dist/sitemap.xml
if [[ $? -ne 0 ]]; then
    echo "BUILD FAILED"
    exit 1
fi

echo ""
echo "Bundling js + assets"
# Package for quick upload
tar -cz dist/ > build.tar.gz

echo ""
echo "Done!"