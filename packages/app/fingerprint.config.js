/**
 * Read by two consumers: the app's own `runtimeVersion: { policy: 'fingerprint' }`, and
 * rnw-community/mobile-ci's native key, which addresses the base binary a pull request
 * repacks instead of compiling (see the mobile-ci docs/repack.md contract).
 *
 * `ignorePaths` is the repack's correctness boundary: anything listed here can change
 * native code without moving the key, so a pull request would repack onto a stale native
 * shell. ios/ and android/ are generated and never committed, and every CI lane runs
 * `expo prebuild --clean` before fingerprinting, so both are pure outputs of
 * app.config.js, the dependency set and the config plugins - all of which this
 * fingerprint already hashes. Hashing generated output on top of its own inputs only
 * moves the key for reasons that do not change the built binary. If a package that does
 * change native code independently ever lands under one of these paths, re-warm with
 * seed-native-cache.yml and `force-base: true`.
 *
 * `sourceSkips` are values rewritten per build rather than compiled in. They are the
 * app's existing OTA contract - every variant shares one runtime version - and are left
 * exactly as they were: the identity values they hide (name, bundle identifier, package)
 * are asserted instead by each caller's `expect-config`, and the e2e and production
 * bases never share an address because the key's toolchain segment carries the workspace
 * and scheme.
 *
 * @type {import('@expo/fingerprint').Config}
 */
const config = {
    ignorePaths: ['ios', 'ios/**', 'android', 'android/**', '**/.DS_Store'],
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
