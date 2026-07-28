const reactNativeResolver = require('@react-native/jest-preset/jest/resolver.js');
const workletsResolver = require('react-native-worklets/jest/resolver.js');

module.exports = (request, options) => {
    const isWorkletsRequest = options.basedir.includes('react-native-worklets') || request.includes('react-native-worklets');

    return isWorkletsRequest ? workletsResolver(request, options) : reactNativeResolver(request, options);
};
