# Blog

[![Build Status](https://travis-ci.org/deepak/blog.svg?branch=master)](https://travis-ci.org/deepak/blog)

Personal blog of Deepak Kannan, programmer extraordinaire & egoistical megalomaniac.

## Development

```sh
brew install yarn git-hooks
yarn
git hooks --install
echo "to test commit message without actually commiting" | commitlint
hugo check ulimit
./bin/dev.sh
```