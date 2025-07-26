import rootPkg from './package.json';

const APP_VARIANT = process.env.APP_VARIANT;
const IS_DEV = APP_VARIANT === 'development';
const IS_PREVIEW = APP_VARIANT === 'preview';

const getUniqueIdentifier = isAndroid => {
    const prefix = isAndroid ? 'com.vitaliiyehorov.suuudokuuu' : 'com.vitalyiegorov.suuudokuuu';

    if (IS_DEV) {
        return `${prefix}.dev`;
    }

    if (IS_PREVIEW) {
        return `${prefix}.preview`;
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

    return 'suuudokuuu';
};

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
        config: {
            usesNonExemptEncryption: false
        },
        buildNumber: '7',
        associatedDomains: ['applinks:suuudokuuu.com']
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#000000'
        },
        package: getUniqueIdentifier(true),
        versionCode: 7
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
        url: 'https://u.expo.dev/4a70028a-5f9e-4ab6-9389-82d8b8b6c833'
    },
    plugins: [
        ['expo-router', { origin: 'https://www.suuudokuuu.com/' }],
        ['expo-font', { fonts: ['../../node_modules/@expo-google-fonts/inter/Inter_900Black.ttf'] }]
    ],
    experiments: {
        reactCompiler: true
    },
    runtimeVersion: {
        policy: 'sdkVersion'
    }
});
