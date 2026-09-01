import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';

import { AllScenes, DefaultSeedDifficulty, type Scene } from './screenshot-scenes.ts';
import { AndroidStorageRelativePath, IosStorageRelativePath, type SeedOptions, type SeedTarget, seedAppState } from './seed-app-state.ts';

const SupportedPlatforms = ['android', 'ios'];

const readRequiredEnvironment = (name: string): string => {
    const value = process.env[name] ?? '';

    if (value.length === 0) {
        throw new Error(`${name} must be set in the seed hook environment.`);
    }

    return value;
};

const findScene = (sceneName: string): Scene => {
    const scene = AllScenes.find(candidate => candidate.name === sceneName);

    if (scene === undefined) {
        throw new Error(`Unknown scene "${sceneName}". Known: ${AllScenes.map(candidate => candidate.name).join(', ')}`);
    }

    return scene;
};

const ensureIosStorageDirectory = (udid: string, appId: string): void => {
    const container = spawnSync('xcrun', ['simctl', 'get_app_container', udid, appId, 'data'], { encoding: 'utf8' });
    const containerOutput = `${container.stdout}${container.stderr}`.trim();

    if (container.status !== 0) {
        throw new Error(`Could not resolve the data container for ${appId} on ${udid}: ${containerOutput}`);
    }

    mkdirSync(join(container.stdout.trim(), dirname(IosStorageRelativePath)), { recursive: true });
};

const RootProbeAttempts = 15;

const ensureAndroidRoot = (serial: string): void => {
    spawnSync('adb', ['-s', serial, 'root'], { encoding: 'utf8' });

    for (let attempt = 0; attempt < RootProbeAttempts; attempt += 1) {
        spawnSync('adb', ['connect', serial], { encoding: 'utf8' });

        const probe = spawnSync('adb', ['-s', serial, 'shell', 'id'], { encoding: 'utf8' });

        if (probe.status === 0 && `${probe.stdout}`.includes('uid=0')) {
            return;
        }

        spawnSync('sleep', ['1']);
    }

    throw new Error(`adb on ${serial} did not become root after 'adb root'; the persisted store cannot be written.`);
};

const ensureAndroidStorageDatabase = (serial: string, appId: string): void => {
    ensureAndroidRoot(serial);

    const databasePath = posix.join('/data/data', appId, AndroidStorageRelativePath);
    const prepareCommand = `mkdir -p '${posix.dirname(databasePath)}' && touch '${databasePath}'`;
    const prepared = spawnSync('adb', ['-s', serial, 'shell', prepareCommand], { encoding: 'utf8' });
    const preparedOutput = `${prepared.stdout}${prepared.stderr}`.trim();

    if (prepared.status !== 0) {
        throw new Error(`Could not prepare ${databasePath} on ${serial}: ${preparedOutput}`);
    }
};

const main = (): void => {
    const sceneName = readRequiredEnvironment('SCENE');
    const locale = readRequiredEnvironment('LOCALE');
    const appearance = readRequiredEnvironment('APPEARANCE');
    const appId = readRequiredEnvironment('APP_ID');
    const platform = readRequiredEnvironment('PLATFORM');

    if (!SupportedPlatforms.includes(platform)) {
        throw new Error(`Unsupported platform "${platform}". Supported: ${SupportedPlatforms.join(', ')}`);
    }

    const scene = findScene(sceneName);
    const udid = platform === 'ios' ? readRequiredEnvironment('SIMULATOR_UDID') : '';
    const serial = platform === 'android' ? readRequiredEnvironment('ANDROID_SERIAL') : '';

    if (platform === 'ios') {
        ensureIosStorageDirectory(udid, appId);
    } else {
        ensureAndroidStorageDatabase(serial, appId);
    }

    const target: SeedTarget = { appId, platform, serial, udid };
    const options: SeedOptions = {
        appearance,
        difficulty: scene.seedDifficulty ?? DefaultSeedDifficulty,
        language: locale,
        sceneState: scene.sceneState
    };

    seedAppState(target, options);
    process.stdout.write(`Seeded ${platform} state for scene=${sceneName}: language=${locale}, appearance=${appearance}\n`);
};

main();
