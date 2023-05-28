#!/bin/sh

# https://developer.apple.com/documentation/xcode/writing-custom-build-scripts

# Set the -e flag to stop running the script in case a command returns
# a nonzero exit code.
set -e

# Install CocoaPods and yarn using Homebrew.
brew install cocoapods
brew install node@18
brew link node@18
brew install yarn

# Install dependencies
yarn
pod install

# A command or script succeeded.
echo "A command or script was successful."
exit 0
