#!/bin/sh

# Install CocoaPods and yarn using Homebrew.
brew install cocoapods
brew install node@18
brew link node@18
brew install yarn

# Install dependencies
yarn
pod install
