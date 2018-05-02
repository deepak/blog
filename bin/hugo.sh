#!/usr/bin/env sh

rm -rf public || exit 0
hugo --source "site" --destination "../public" --config "config.toml" "$@"