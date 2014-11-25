#!/usr/bin/env bash
# Output commands and stop on first error
set -e
set -x

# If we are installing not using the default Travis version
if [[ "$PHANTOMJS_VERSION" != "TRAVIS" ]]; then
  # Uninstall current version
  sudo rm "$(which phantomjs)"

  # Download and install our version from website
  wget "https://phantomjs.googlecode.com/files/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2"
  tar xvf "phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2"
  sudo ln -s "$PWD/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs" "/usr/bin/phantomjs"
fi
