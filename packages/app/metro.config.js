// Learn more https://docs.expo.io/guides/customizing-metro
const { existsSync } = require('node:fs');
const path = require('node:path');

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const WebPlatform = 'web';
const SourceFileResolution = 'sourceFile';
const BrowserFieldPackages = ['@rnw-community/react-native-screen-chrome', '@rnw-community/react-native-collapsible-header'];
const WaSqliteFactoryModule = '@effect/wa-sqlite/dist/wa-sqlite.mjs';
const WaSqliteFactoryShimPath = path.resolve(__dirname, 'metro/wa-sqlite-factory.web.js');

config.resolver.assetExts.push('wasm');

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === WebPlatform && moduleName === WaSqliteFactoryModule && context.originModulePath !== WaSqliteFactoryShimPath) {
        return { type: SourceFileResolution, filePath: WaSqliteFactoryShimPath };
    }

    const resolution = context.resolveRequest(context, moduleName, platform);

    if (platform !== WebPlatform || resolution.type !== SourceFileResolution) {
        return resolution;
    }

    if (!BrowserFieldPackages.some(packageName => resolution.filePath.includes(packageName))) {
        return resolution;
    }

    const webFilePath = resolution.filePath.replace(/\.js$/u, '.web.js');

    return existsSync(webFilePath) ? { ...resolution, filePath: webFilePath } : resolution;
};

module.exports = config;
