#!/usr/bin/env bash

# If we are installing PhantomJS@1.9.2
if [[ "$PHANTOMJS_VERSION" == "latest" ]]; then
  sudo apt-get install phantomjs -y
fi