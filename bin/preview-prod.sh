#!/usr/bin/env sh

PORT="${PORT:-8000}"
ruby -run -ehttpd ./public/ -p$PORT