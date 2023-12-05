#!/bin/bash
set -ex

bun install

bun build index.ts --compile --outfile mattcl-aoc2023-js

# step out of the repo dir
cd ../

VERSION=$(cat repo/package.json | grep version | head -1 | cut -d '"' -f 4)

# we need a way to reference the version
echo "$VERSION" > release/VERSION

echo "Packaging $VERSION"

mkdir dist
cp "repo/mattcl-aoc2023-js" dist/

cd dist
ARCHIVE="aoc-js-${VERSION}.tar.gz"
tar czf "$ARCHIVE" "mattcl-aoc2023-js"
cd ../

mv "dist/$ARCHIVE" "release/$ARCHIVE"

# we need a way to reference the file name
echo "$ARCHIVE" > release/ARCHIVE_NAME
