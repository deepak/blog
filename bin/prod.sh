#!/usr/bin/env sh

rm -rf static || exit 0
rm -rf data/manifest.json || exit 0
yarn run webpack
# tree static

rm -rf public || exit 0
hugo --quiet=true
# tree public