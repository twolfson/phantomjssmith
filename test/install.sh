#!/usr/bin/env bash
# Output commands and stop on first error
set -e
set -x

# If we are installing not using the default Travis version
if [[ "$PHANTOMJS_VERSION" != "TRAVIS" ]]; then
  # Uninstall current version
  sudo rm "$(which phantomjs)"

  # Download our version from the internet
  # If we are at a pre-bitbucket version, use Google code
  if [[ "$PHANTOMJS_VERSION" = "1.9.2" ]]; then
    wget "https://phantomjs.googlecode.com/files/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2"
  # Otherwise, use bitbucket
  else
    wget "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2"
  fi

  # Extract and install PhantomJS
  tar xvf "phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2"
  sudo ln -s "$PWD/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs" "/usr/bin/phantomjs"
fi
