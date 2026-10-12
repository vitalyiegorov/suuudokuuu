import { AllScenes, DefaultSeedDifficulty, type Scene } from './screenshot-scenes.ts';
import { type SeedOptions, type SeedTarget, seedAppState } from './seed-app-state.ts';

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
