import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { bakeLandscapeScreenshot } from './bake-landscape-screenshot.ts';
import {
    type DeviceContext,
    type SceneOutcome,
    applyStatusBarOverride,
    detectBootedIosSimulatorUdid,
    openDeepLink,
    recycleIosDriver,
    rotateSimulator,
    waitForRender,
    writeDeviceScreenshot
} from './capture-device.ts';
import { type MaestroContext, runMaestroScene } from './maestro-scene.ts';
import {
    AllAppearances,
    AllDeviceClasses,
    AllLocales,
    AllScenes,
    DefaultSeedDifficulty,
    HomeDeepLink,
    type Scene,
    localeIdentifierFor,
    sceneScreenshotBaseName
} from './screenshot-scenes.ts';
import { type SeedTarget, launchSeededApp, seedAppState } from './seed-app-state.ts';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appTestsDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appTestsDirectory));
const configPath = join(appTestsDirectory, 'config.yaml');
const screenshotsFlowsDirectory = join(appTestsDirectory, 'flows', 'screenshots');
const defaultOutputRootDirectory = join(repositoryRootDirectory, 'packages', 'app', 'fastlane', 'screenshots', 'raw');

const LaunchSettleMilliseconds = 3500;
const DeepLinkSettleMilliseconds = 2000;
const MillisecondsPerSecond = 1000;

const parseCommaSeparatedList = (value: string): string[] =>
    value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

const isDefinedString = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

const { values: cliOptions } = parseArgs({
    options: {
        'app-id': { type: 'string' },
        appearances: { type: 'string' },
        'capture-mode': { type: 'string' },
        'device-class': { type: 'string' },
        locales: { type: 'string' },
        orientation: { type: 'string' },
        'output-dir': { type: 'string' },
        platform: { type: 'string' },
        scenes: { type: 'string' },
        serial: { type: 'string' },
        'status-bar': { type: 'string' },
        udid: { type: 'string' }
    }
});

const {
    ANDROID_SERIAL,
    APP_ID,
    CAPTURE_MODE,
    DEVICE_CLASS,
    ORIENTATION,
    OS_LANGUAGE_MODE,
    SCREENSHOT_OUTPUT_DIR,
    SCREENSHOT_PLATFORM,
    SIMULATOR_UDID,
    STATUS_BAR
} = process.env;

const platform = cliOptions.platform ?? SCREENSHOT_PLATFORM ?? 'ios';
const appId = cliOptions['app-id'] ?? APP_ID;
const deviceClass = cliOptions['device-class'] ?? DEVICE_CLASS ?? 'iphone';
const simulatorUdid = cliOptions.udid ?? SIMULATOR_UDID ?? (platform === 'ios' ? detectBootedIosSimulatorUdid(deviceClass) : '');
const orientation = cliOptions.orientation ?? ORIENTATION ?? 'portrait';
const captureMode = cliOptions['capture-mode'] ?? CAPTURE_MODE ?? 'fast';
const statusBarMode = cliOptions['status-bar'] ?? STATUS_BAR ?? 'clean';
const androidSerial = cliOptions.serial ?? ANDROID_SERIAL ?? '';
const skipsLanguageSheet = captureMode === 'fast' || OS_LANGUAGE_MODE === 'true';
const osLanguageMode = skipsLanguageSheet ? 'true' : 'false';
const outputRootDirectory = cliOptions['output-dir'] ?? SCREENSHOT_OUTPUT_DIR ?? defaultOutputRootDirectory;

const deviceContext: DeviceContext = { androidSerial, platform, scriptDirectory, simulatorUdid, statusBarMode };
const maestroContext: MaestroContext = {
    appId: appId ?? '',
    artifactsDirectory: join(appTestsDirectory, 'artifacts', 'screenshots-debug'),
    configPath,
    flowsDirectory: screenshotsFlowsDirectory,
    osLanguageMode,
    platform,
    simulatorUdid
};

if (!['portrait', 'landscape'].includes(orientation)) {
    throw new Error(`Unknown orientation "${orientation}". Use portrait or landscape.`);
}

if (orientation === 'landscape' && deviceClass !== 'ipad') {
    throw new Error('Landscape capture is only supported for the ipad device class; the app locks iPhone to portrait.');
}

const selectedLocales = isDefinedString(cliOptions.locales) ? parseCommaSeparatedList(cliOptions.locales) : AllLocales;
const selectedAppearances = isDefinedString(cliOptions.appearances) ? parseCommaSeparatedList(cliOptions.appearances) : AllAppearances;
const selectedSceneNames = isDefinedString(cliOptions.scenes)
    ? parseCommaSeparatedList(cliOptions.scenes)
    : AllScenes.map(scene => scene.name);
const selectedScenes = AllScenes.filter(scene => selectedSceneNames.includes(scene.name));

const seedTargetForRun = (): SeedTarget => ({
    appId: isDefinedString(appId) ? appId : '',
    platform,
    serial: androidSerial,
    udid: simulatorUdid
});

const seedOptionsForScene = (scene: Scene, locale: string, appearance: string) => ({
    appearance,
    difficulty: isDefinedString(scene.seedDifficulty) ? scene.seedDifficulty : DefaultSeedDifficulty,
    language: locale,
    sceneState: scene.sceneState
});

const captureSceneDirectly = (scene: Scene, locale: string, appearance: string, testOutputDirectory: string): SceneOutcome => {
    const target = seedTargetForRun();

    try {
        seedAppState(target, seedOptionsForScene(scene, locale, appearance));
    } catch (error) {
        return { failureOutput: error instanceof Error ? error.message : String(error), succeeded: false };
    }

    launchSeededApp(target, locale, localeIdentifierFor(locale));
    waitForRender(LaunchSettleMilliseconds);

    if (isDefinedString(scene.deepLink) && scene.deepLink !== HomeDeepLink) {
        openDeepLink(deviceContext, scene.deepLink);
        waitForRender(DeepLinkSettleMilliseconds);
    }

    return writeDeviceScreenshot(deviceContext, join(testOutputDirectory, `${sceneScreenshotBaseName(scene)}.png`));
};

interface CaptureResult {
    appearance: string;
    deviceClass: string;
    durationSeconds: number;
    locale: string;
    scene: string;
    status: 'success' | 'failure';
}

interface SceneReport {
    appearance: string;
    locale: string;
    scene: Scene;
    startedAt: number;
    suffix: string;
}

const reportSceneOutcome = (report: SceneReport, outcome: SceneOutcome): CaptureResult => {
    const { appearance, locale, scene, startedAt, suffix } = report;
    const durationSeconds = Math.round((Date.now() - startedAt) / MillisecondsPerSecond);
    const status = outcome.succeeded ? 'success' : 'failure';

    process.stdout.write(`[${deviceClass}/${locale}/${appearance}] ${scene.name}: ${status} (${durationSeconds}s${suffix})\n`);

    if (!outcome.succeeded) {
        process.stderr.write(`${outcome.failureOutput}\n`);
    }

    return { appearance, deviceClass, durationSeconds, locale, scene: scene.name, status };
};

const captureCombination = (locale: string, appearance: string): CaptureResult[] => {
    const deviceClassSegment = orientation === 'landscape' ? `${deviceClass}-landscape` : deviceClass;
    const deviceClassPathSegments = platform === 'ios' ? [deviceClassSegment] : [];
    const testOutputDirectory = join(outputRootDirectory, platform, ...deviceClassPathSegments, locale, appearance);
    const usesDirectCapture = captureMode === 'fast';

    mkdirSync(testOutputDirectory, { recursive: true });

    if (usesDirectCapture) {
        applyStatusBarOverride(deviceContext);
    }

    // eslint-disable-next-line max-statements -- Per-scene branch between direct capture and the Maestro fallback
    return selectedScenes.map(scene => {
        const startedAt = Date.now();
        const capturesWithoutMaestro = usesDirectCapture && isDefinedString(scene.deepLink);
        const screenshotPath = join(testOutputDirectory, `${sceneScreenshotBaseName(scene)}.png`);

        if (capturesWithoutMaestro) {
            const directOutcome = captureSceneDirectly(scene, locale, appearance, testOutputDirectory);

            if (directOutcome.succeeded && orientation === 'landscape') {
                bakeLandscapeScreenshot(screenshotPath);
            }

            return reportSceneOutcome({ appearance, locale, scene, startedAt, suffix: ', direct' }, directOutcome);
        }

        if (usesDirectCapture) {
            seedAppState(seedTargetForRun(), seedOptionsForScene(scene, locale, appearance));
        }

        const maestroRequest = { appearance, locale, scene, testOutputDirectory };
        const firstAttempt = runMaestroScene(maestroContext, maestroRequest);
        let sceneOutcome = firstAttempt;

        if (!firstAttempt.succeeded) {
            recycleIosDriver(deviceContext);
            sceneOutcome = runMaestroScene(maestroContext, maestroRequest);
        }

        if (sceneOutcome.succeeded && orientation === 'landscape') {
            bakeLandscapeScreenshot(screenshotPath);
        }

        return reportSceneOutcome({ appearance, locale, scene, startedAt, suffix: '' }, sceneOutcome);
    });
};

// eslint-disable-next-line max-statements -- CLI orchestration: argument validation, rotation, capture loop and reporting
const main = (): void => {
    if (!isDefinedString(appId)) {
        process.stderr.write('APP_ID is required. Pass --app-id=<bundle-id> or set the APP_ID environment variable.\n');
        process.exitCode = 1;

        return;
    }

    if (!AllDeviceClasses.includes(deviceClass)) {
        process.stderr.write(`Unknown device class "${deviceClass}". Pass --device-class=iphone or --device-class=ipad.\n`);
        process.exitCode = 1;

        return;
    }

    if (platform === 'ios' && !isDefinedString(simulatorUdid)) {
        process.stderr.write('No booted iOS simulator found. Boot one or pass --udid=<simulator-udid>.\n');
        process.exitCode = 1;

        return;
    }

    recycleIosDriver(deviceContext);

    if (orientation === 'landscape') {
        rotateSimulator(deviceContext, 'landscape_left');
    }

    const results: CaptureResult[] = [];

    for (const locale of selectedLocales) {
        for (const appearance of selectedAppearances) {
            results.push(...captureCombination(locale, appearance));
        }
    }

    if (orientation === 'landscape') {
        rotateSimulator(deviceContext, 'portrait');
    }

    const failedResults = results.filter(result => result.status === 'failure');
    const reportDirectory = join(appTestsDirectory, 'artifacts', 'screenshots-debug');

    mkdirSync(reportDirectory, { recursive: true });
    writeFileSync(join(reportDirectory, 'report.json'), JSON.stringify(results, null, 2));

    process.stdout.write(`\nCaptured ${results.length - failedResults.length}/${results.length} scenes.\n`);

    if (failedResults.length > 0) {
        process.stdout.write(
            `Failed: ${failedResults.map(result => `${result.deviceClass}/${result.locale}/${result.appearance}/${result.scene}`).join(', ')}\n`
        );
        process.exitCode = 1;
    }
};

main();
