#!/usr/bin/env sh

rm -rf public || exit 0
hugo --quiet=true
# tree public

rm -rf dist || exit 0
yarn run webpack
# tree dist

# cleanup files to reduce potential fuckups
rm public/index.js || exit 0
rm dist/bundle.js || exit 0
# tree public dist

rm -rf public || exit 0
mv dist public
# cp -r dist public
# tree public