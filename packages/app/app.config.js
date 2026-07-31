import { withAndroidManifest } from '@expo/config-plugins';

import { brandConfig } from './brand.config';
import rootPkg from './package.json';

const APP_VARIANT = process.env.APP_VARIANT;
const DEVELOPMENT_BUILD_NUMBER = process.env.DEVELOPMENT_BUILD_NUMBER;
const EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL = process.env.EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL;
const DevelopmentBuildNumberPattern = /^[1-9]\d{0,3}\.[1-9]\d?$/u;
const IS_DEV = APP_VARIANT === 'development';
const IS_E2E = APP_VARIANT === 'e2e';
const IS_PREVIEW = APP_VARIANT === 'preview';
const IS_PRODUCTION = APP_VARIANT === 'production';
const StoreBuildArchs = ['armeabi-v7a', 'arm64-v8a'];

if (DEVELOPMENT_BUILD_NUMBER !== undefined && !DevelopmentBuildNumberPattern.test(DEVELOPMENT_BUILD_NUMBER)) {
    throw new Error('DEVELOPMENT_BUILD_NUMBER must contain a 1-9999 run number and a 1-99 run attempt.');
}

const getUniqueIdentifier = isAndroid => {
    const prefix = isAndroid ? brandConfig.androidPackage : brandConfig.iosBundleIdentifier;

    if (IS_DEV) {
        return `${prefix}.dev`;
    }

    if (IS_PREVIEW) {
        return `${prefix}.preview`;
    }

    if (IS_E2E) {
        return `${prefix}.e2e`;
    }

    return prefix;
};

const getAppName = () => {
    if (IS_DEV) {
        return `${brandConfig.appName} (Dev)`;
    }

    if (IS_PREVIEW) {
        return `${brandConfig.appName} (Preview)`;
    }

    if (IS_E2E) {
        return `${brandConfig.appName} (E2E)`;
    }

    return brandConfig.appName;
};

const getApexAssociatedDomain = () => brandConfig.associatedDomains.find(domain => !domain.startsWith('www.'));

const withPortraitLockedAndroid = config =>
    withAndroidManifest(config, mod => {
        const mainActivity = mod.modResults.manifest.application?.[0]?.activity?.find(
            activity => activity.$['android:name'] === '.MainActivity'
        );

        if (mainActivity) {
            mainActivity.$['android:screenOrientation'] = 'portrait';
        }

        return mod;
    });

const getExpoDevClientConfig = () => ({
    showMenuAtLaunch: false,
    skipOnboarding: true,
    toolsButton: false,
    ...(EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL && {
        defaultLaunchURL: EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL,
        launchMode: 'most-recent'
    })
});

export default ({ config }) =>
    withPortraitLockedAndroid({
        ...config,
        name: getAppName(),
        slug: brandConfig.slug,
        scheme: brandConfig.scheme,
        version: rootPkg.version,
        icon: brandConfig.assets.icon,
        userInterfaceStyle: 'automatic',
        splash: {
            image: brandConfig.assets.splash,
            resizeMode: 'contain',
            backgroundColor: brandConfig.splashBackgroundColor
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            bundleIdentifier: getUniqueIdentifier(false),
            ...(IS_DEV && DEVELOPMENT_BUILD_NUMBER !== undefined && { buildNumber: DEVELOPMENT_BUILD_NUMBER }),
            config: {
                usesNonExemptEncryption: false
            },
            associatedDomains: brandConfig.associatedDomains.map(domain => `applinks:${domain}`),
            infoPlist: {
                NSPhotoLibraryUsageDescription: 'This app needs access to your photo library to share game results and screenshots.',
                UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
                'UISupportedInterfaceOrientations~ipad': [
                    'UIInterfaceOrientationPortrait',
                    'UIInterfaceOrientationPortraitUpsideDown',
                    'UIInterfaceOrientationLandscapeLeft',
                    'UIInterfaceOrientationLandscapeRight'
                ]
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: brandConfig.assets.adaptiveIcon,
                backgroundColor: brandConfig.splashBackgroundColor
            },
            package: getUniqueIdentifier(true),
            intentFilters: [
                {
                    action: 'VIEW',
                    autoVerify: true,
                    data: [
                        {
                            scheme: 'https',
                            host: `*.${getApexAssociatedDomain()}`,
                            pathPrefix: '/'
                        },
                        {
                            scheme: 'https',
                            host: getApexAssociatedDomain(),
                            pathPrefix: '/'
                        }
                    ],
                    category: ['BROWSABLE', 'DEFAULT']
                }
            ]
        },
        web: {
            favicon: brandConfig.assets.favicon,
            bundler: 'metro'
        },
        extra: {
            eas: {
                projectId: '4a70028a-5f9e-4ab6-9389-82d8b8b6c833'
            },
            brand: {
                appName: brandConfig.appName,
                defaultTheme: brandConfig.defaultTheme,
                links: brandConfig.links
            },
            e2eSeedingEnabled: IS_DEV || IS_E2E
        },
        owner: 'vitalyiegorov',
        updates: {
            enabled: !IS_E2E,
            url: 'https://u.expo.dev/4a70028a-5f9e-4ab6-9389-82d8b8b6c833'
        },
        plugins: [
            [
                'expo-build-properties',
                {
                    buildReactNativeFromSource: false,
                    useHermesV1: true,
                    ...(IS_PRODUCTION && { android: { buildArchs: StoreBuildArchs } }),
                    ios: {
                        ccacheEnabled: true,
                        usePrecompiledModules: true
                    }
                }
            ],
            'expo-localization',
            'expo-sharing',
            'expo-splash-screen',
            'expo-sqlite',
            'expo-status-bar',
            ['expo-dev-client', getExpoDevClientConfig()],
            ['expo-router', { origin: brandConfig.webOrigin }],
            ['expo-font', { fonts: ['../../node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf'] }],
            [
                'react-native-share',
                {
                    ios: ['fb', 'instagram', 'twitter', 'tiktoksharesdk'],
                    android: ['com.facebook.katana', 'com.instagram.android', 'com.twitter.android', 'com.zhiliaoapp.musically'],
                    enableBase64ShareAndroid: true
                }
            ]
        ],
        buildCacheProvider: 'eas',
        experiments: {
            reactCompiler: true
        },
        runtimeVersion: {
            policy: 'fingerprint'
        }
    });
