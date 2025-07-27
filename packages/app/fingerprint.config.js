/** @type {import('@expo/fingerprint').Config} */
const config = {
    sourceSkips: [
        'ExpoConfigRuntimeVersionIfString',
        'ExpoConfigVersions',
        'PackageJsonAndroidAndIosScriptsIfNotContainRun',
        'ExpoConfigIosBundleIdentifier',
        'ExpoConfigAndroidPackage'
    ]
};

module.exports = config;
