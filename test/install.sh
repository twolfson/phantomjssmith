#!/usr/bin/env bash
# Output commands and stop on first error
set -e
set -x

# If we are installing a non-official binary
if [[ "$PHANTOMJS_VERSION" = "2.0.0" ]]; then
  # Uninstall current version
  rm "$(which phantomjs)"

  # Download Travis CI's version
  wget "https://s3.amazonaws.com/travis-phantomjs/phantomjs-$PHANTOMJS_VERSION-ubuntu-12.04.tar.bz2"

  tar xvf "phantomjs-$PHANTOMJS_VERSION-ubuntu-12.04.tar.bz2"
  ln -s "$PWD/phantomjs" "/usr/bin/phantomjs"
# Otherwise if we are installing not using the default Travis version
elif [[ "$PHANTOMJS_VERSION" != "TRAVIS" ]]; then
  # Uninstall current version
  rm "$(which phantomjs)"

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
  ln -s "$PWD/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs" "/usr/bin/phantomjs"
fi
