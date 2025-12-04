#!/bin/bash

# Minify JS
rollup src/index.js --file .intermediate.js --format es
minify .intermediate.js > dist/bundle.min.js
rm .intermediate.js

# Copy over assets

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

# individual files
cp src/projects_info.json dist/projects_info.json
cp src/sitemap.xml dist/sitemap.xml

# Package for quick upload
tar -cz dist/ > build.tar.gz

echo "Done"