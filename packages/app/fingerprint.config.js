/** @type {import('@expo/fingerprint').Config} */
const config = {
    sourceSkips: ['ExpoConfigRuntimeVersionIfString', 'ExpoConfigVersions', 'PackageJsonAndroidAndIosScriptsIfNotContainRun']
};

module.exports = config;
