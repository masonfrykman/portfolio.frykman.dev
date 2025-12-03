#!/bin/bash

# Minify JS
rollup public/index.js --file .intermediate.js --format es
minify .intermediate.js > dist/bundle.min.js
rm .intermediate.js

# Copy over assets

# HTML
for filename in public/*.html; do
    cp $filename dist/
done

# CSS
for filename in public/*.css; do
    cp $filename dist/
done

tar -cz dist/ > build.tar.gz

echo "Done"