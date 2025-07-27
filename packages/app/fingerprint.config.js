/** @type {import('@expo/fingerprint').Config} */
const config = {
    sourceSkips: [
        'ExpoConfigRuntimeVersionIfString',
        'ExpoConfigVersions',
        'PackageJsonAndroidAndIosScriptsIfNotContainRun',
        'ExpoConfigIosBundleIdentifier',
        'ExpoConfigAndroidPackage',
        'ExpoConfigNames'
    ]
};

module.exports = config;
