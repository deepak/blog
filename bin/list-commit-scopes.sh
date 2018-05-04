#!/usr/bin/env sh

git log --oneline                     \
  | cut -d ':' -f 1                   \
  | cut -d ' ' -f 2                   \
  | grep '('                          \
  | sort | uniq                       \
  | cut -d '(' -f 2                   \
  | cut -d ')' -f 1                   \
  | sort | uniq