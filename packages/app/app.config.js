import rootPkg from './package.json';

const APP_VARIANT = process.env.APP_VARIANT;
const DEVELOPMENT_BUILD_NUMBER = process.env.DEVELOPMENT_BUILD_NUMBER;
const EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL = process.env.EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL;
const DevelopmentBuildNumberPattern = /^[1-9]\d*(?:\.[1-9]\d*){0,2}$/u;
const IS_DEV = APP_VARIANT === 'development';
const IS_E2E = APP_VARIANT === 'e2e';
const IS_PREVIEW = APP_VARIANT === 'preview';

if (DEVELOPMENT_BUILD_NUMBER !== undefined && !DevelopmentBuildNumberPattern.test(DEVELOPMENT_BUILD_NUMBER)) {
    throw new Error('DEVELOPMENT_BUILD_NUMBER must contain one to three positive decimal integer components.');
}

const getUniqueIdentifier = isAndroid => {
    const prefix = isAndroid ? 'com.vitaliiyehorov.suuudokuuu' : 'com.vitalyiegorov.suuudokuuu';

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
        return 'suuudokuuu (Dev)';
    }

    if (IS_PREVIEW) {
        return 'suuudokuuu (Preview)';
    }

    if (IS_E2E) {
        return 'suuudokuuu (E2E)';
    }

    return 'suuudokuuu';
};

const getExpoDevClientConfig = () => ({
    showMenuAtLaunch: false,
    skipOnboarding: true,
    toolsButton: false,
    ...(EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL && {
        defaultLaunchURL: EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL,
        launchMode: 'most-recent'
    })
});

export default ({ config }) => ({
    ...config,
    name: getAppName(),
    slug: 'suuudokuuu',
    scheme: 'suuudokuuu',
    version: rootPkg.version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#000000'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: getUniqueIdentifier(false),
        ...(IS_DEV && DEVELOPMENT_BUILD_NUMBER !== undefined && { buildNumber: DEVELOPMENT_BUILD_NUMBER }),
        config: {
            usesNonExemptEncryption: false
        },
        associatedDomains: ['applinks:suuudokuuu.com', 'applinks:www.suuudokuuu.com'],
        infoPlist: {
            NSPhotoLibraryUsageDescription: 'This app needs access to your photo library to share game results and screenshots.'
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#000000'
        },
        package: getUniqueIdentifier(true),
        intentFilters: [
            {
                action: 'VIEW',
                autoVerify: true,
                data: [
                    {
                        scheme: 'https',
                        host: '*.suuudokuuu.com',
                        pathPrefix: '/'
                    },
                    {
                        scheme: 'https',
                        host: 'suuudokuuu.com',
                        pathPrefix: '/'
                    }
                ],
                category: ['BROWSABLE', 'DEFAULT']
            }
        ]
    },
    web: {
        favicon: './assets/favicon.png',
        bundler: 'metro'
    },
    extra: {
        eas: {
            projectId: '4a70028a-5f9e-4ab6-9389-82d8b8b6c833'
        }
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
        ['expo-router', { origin: 'https://www.suuudokuuu.com/' }],
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
