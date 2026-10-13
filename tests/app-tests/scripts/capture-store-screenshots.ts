import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { getErrorMessage, isDefined, isNotEmptyString, isPositiveNumber } from '@rnw-community/shared';

import {
    type DeviceContext,
    type SceneOutcome,
    applyStatusBarOverride,
    detectBootedIosSimulatorUdid,
    clearAndroidSceneLogs,
    openDeepLink,
    readAndroidAppPid,
    recycleIosDriver,
    rotateSimulator,
    waitForRender,
    writeDeviceScreenshot,
    verifyAndroidScene
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

const DefaultLaunchSettleMilliseconds = 3500;
const DefaultSceneSettleMilliseconds = 2000;
const AndroidScreenshotDeadlineMilliseconds = 10000;
const AndroidScreenshotRetryMilliseconds = 1000;
const MillisecondsPerSecond = 1000;

const parseCommaSeparatedList = (value: string): string[] =>
    value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

const { values: cliOptions } = parseArgs({
    options: {
        'app-id': { type: 'string' },
        appearances: { type: 'string' },
        'device-class': { type: 'string' },
        locales: { type: 'string' },
        orientation: { type: 'string' },
        'output-dir': { type: 'string' },
        'report-dir': { type: 'string' },
        platform: { type: 'string' },
        scenes: { type: 'string' },
        serial: { type: 'string' },
        'status-bar': { type: 'string' },
        udid: { type: 'string' },
        verify: { type: 'boolean' }
    }
});

const {
    ANDROID_SERIAL,
    APP_ID,
    CAPTURE_LAUNCH_SETTLE_MS,
    CAPTURE_SCENE_SETTLE_MS,
    DEVICE_CLASS,
    ORIENTATION,
    SCREENSHOT_OUTPUT_DIR,
    SCREENSHOT_PLATFORM,
    SIMULATOR_UDID,
    STATUS_BAR
} = process.env;

const platform = cliOptions.platform ?? SCREENSHOT_PLATFORM ?? 'ios';
const appId = cliOptions['app-id'] ?? APP_ID;
const deviceClass = platform === 'android' ? 'android' : (cliOptions['device-class'] ?? DEVICE_CLASS ?? 'iphone');
const simulatorUdid = cliOptions.udid ?? SIMULATOR_UDID ?? '';
const orientation = cliOptions.orientation ?? ORIENTATION ?? 'portrait';
const statusBarMode = cliOptions['status-bar'] ?? STATUS_BAR ?? 'clean';
const androidSerial = cliOptions.serial ?? ANDROID_SERIAL ?? '';
const outputRootDirectory = cliOptions['output-dir'] ?? SCREENSHOT_OUTPUT_DIR ?? defaultOutputRootDirectory;
const readSettleMilliseconds = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);

    return isPositiveNumber(parsed) ? parsed : fallback;
};
const launchSettleMilliseconds = readSettleMilliseconds(CAPTURE_LAUNCH_SETTLE_MS, DefaultLaunchSettleMilliseconds);
const sceneSettleMilliseconds = readSettleMilliseconds(CAPTURE_SCENE_SETTLE_MS, DefaultSceneSettleMilliseconds);

const deviceContext: DeviceContext = { androidSerial, platform, scriptDirectory, simulatorUdid, statusBarMode };
const maestroContext: MaestroContext = {
    appId: appId ?? '',
    artifactsDirectory: join(appTestsDirectory, 'artifacts', 'screenshots-debug'),
    configPath,
    flowsDirectory: screenshotsFlowsDirectory,
    platform,
    simulatorUdid
};

if (!['portrait', 'landscape'].includes(orientation)) {
    throw new Error(`Unknown orientation "${orientation}". Use portrait or landscape.`);
}

if (orientation === 'landscape' && deviceClass !== 'ipad') {
    throw new Error('Landscape capture is only supported for the ipad device class; the app locks iPhone to portrait.');
}

const selectedLocales = isDefined(cliOptions.locales) ? parseCommaSeparatedList(cliOptions.locales) : AllLocales;
const selectedAppearances = isDefined(cliOptions.appearances) ? parseCommaSeparatedList(cliOptions.appearances) : AllAppearances;
const selectedSceneNames = isDefined(cliOptions.scenes) ? parseCommaSeparatedList(cliOptions.scenes) : AllScenes.map(scene => scene.name);
const selectedScenes = AllScenes.filter(scene => selectedSceneNames.includes(scene.name));
const verifiesAndroidScenes = cliOptions.verify === true;
const reportDirectory = cliOptions['report-dir'] ?? join(appTestsDirectory, 'artifacts', 'screenshots-debug');

const seedTargetForRun = (): SeedTarget => ({
    appId: isNotEmptyString(appId) ? appId : '',
    platform,
    serial: androidSerial,
    udid: simulatorUdid
});

const seedOptionsForScene = (scene: Scene, locale: string, appearance: string) => ({
    appearance,
    difficulty: isNotEmptyString(scene.seedDifficulty) ? scene.seedDifficulty : DefaultSeedDifficulty,
    language: locale,
    sceneState: scene.sceneState
});

const captureSceneDirectly = (scene: Scene, locale: string, appearance: string, testOutputDirectory: string): SceneOutcome => {
    const target = seedTargetForRun();

    try {
        seedAppState(target, seedOptionsForScene(scene, locale, appearance));
    } catch (error) {
        return { failureOutput: getErrorMessage(error), succeeded: false };
    }

    try {
        if (verifiesAndroidScenes) {
            clearAndroidSceneLogs(deviceContext);
        }

        launchSeededApp(target, locale, localeIdentifierFor(locale));
        waitForRender(launchSettleMilliseconds);
        const launchedProcessId = verifiesAndroidScenes ? readAndroidAppPid(deviceContext, target.appId) : '';

        if (isNotEmptyString(scene.deepLink) && scene.deepLink !== HomeDeepLink) {
            const deepLinkOutcome = openDeepLink(deviceContext, scene.deepLink);

            if (verifiesAndroidScenes && !deepLinkOutcome.succeeded) {
                return { failureOutput: `Could not open deep link for ${scene.name}: ${deepLinkOutcome.failureOutput}`, succeeded: false };
            }

            waitForRender(sceneSettleMilliseconds);
        }

        const screenshotPath = join(testOutputDirectory, `${sceneScreenshotBaseName(scene)}.png`);
        let screenshotOutcome = writeDeviceScreenshot(deviceContext, screenshotPath);

        if (verifiesAndroidScenes && screenshotOutcome.succeeded) {
            const deadline = Date.now() + AndroidScreenshotDeadlineMilliseconds;

            while (screenshotOutcome.succeeded) {
                const verification = verifyAndroidScene(deviceContext, target.appId, launchedProcessId, screenshotPath);

                if (verification.succeeded || Date.now() >= deadline) {
                    return verification;
                }

                waitForRender(AndroidScreenshotRetryMilliseconds);
                screenshotOutcome = writeDeviceScreenshot(deviceContext, screenshotPath);
            }
        }

        return screenshotOutcome;
    } catch (error) {
        if (!verifiesAndroidScenes) {
            throw error;
        }

        return { failureOutput: getErrorMessage(error), succeeded: false };
    }
};

interface CaptureResult {
    appearance: string;
    deviceClass: string;
    durationSeconds: number;
    failureOutput?: string;
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

    return {
        appearance,
        deviceClass,
        durationSeconds,
        locale,
        scene: scene.name,
        status,
        ...(!outcome.succeeded && { failureOutput: outcome.failureOutput })
    };
};

const captureCombination = (locale: string, appearance: string): CaptureResult[] => {
    const deviceClassSegment = orientation === 'landscape' ? `${deviceClass}-landscape` : deviceClass;
    const deviceClassPathSegments = platform === 'ios' ? [deviceClassSegment] : [];
    const testOutputDirectory = join(outputRootDirectory, platform, ...deviceClassPathSegments, locale, appearance);
    mkdirSync(testOutputDirectory, { recursive: true });
    applyStatusBarOverride(deviceContext);

    return selectedScenes.map(scene => {
        const startedAt = Date.now();
        const capturesWithoutMaestro = isNotEmptyString(scene.deepLink);
        const screenshotPath = join(testOutputDirectory, `${sceneScreenshotBaseName(scene)}.png`);
        let sceneOutcome: SceneOutcome;

        if (capturesWithoutMaestro) {
            sceneOutcome = captureSceneDirectly(scene, locale, appearance, testOutputDirectory);
        } else {
            seedAppState(seedTargetForRun(), seedOptionsForScene(scene, locale, appearance));
            const maestroRequest = { appearance, locale, scene, testOutputDirectory };
            sceneOutcome = runMaestroScene(maestroContext, maestroRequest);

            if (!sceneOutcome.succeeded) {
                recycleIosDriver(deviceContext);
                sceneOutcome = runMaestroScene(maestroContext, maestroRequest);
            }
        }

        if (sceneOutcome.succeeded && orientation === 'landscape') {
            const dimensions = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', screenshotPath], { encoding: 'utf8' });
            const width = Number(/pixelWidth: (\d+)/u.exec(dimensions)?.[1]);
            const height = Number(/pixelHeight: (\d+)/u.exec(dimensions)?.[1]);

            if (width < height) {
                execFileSync('sips', ['--rotate', '90', screenshotPath]);
            }

            const metadata = execFileSync('sips', ['-g', 'orientation', screenshotPath], { encoding: 'utf8' });
            const screenshotOrientation = /orientation: (.+)/u.exec(metadata)?.[1].trim();

            if (isDefined(screenshotOrientation) && screenshotOrientation !== '1' && screenshotOrientation !== '<nil>') {
                throw new Error(`Landscape screenshot ${screenshotPath} has unsupported EXIF orientation ${screenshotOrientation}.`);
            }
        }

        return reportSceneOutcome({ appearance, locale, scene, startedAt, suffix: capturesWithoutMaestro ? ', direct' : '' }, sceneOutcome);
    });
};

const validateSelection = (selected: string[], allowed: string[], name: string): void => {
    if (selected.length === 0) {
        throw new Error(`Select at least one ${name}.`);
    }

    const unknown = selected.filter(value => !allowed.includes(value));

    if (unknown.length > 0) {
        throw new Error(`Unknown ${name}: ${unknown.join(', ')}.`);
    }
};

const main = (): void => {
    if (!isNotEmptyString(appId)) {
        process.stderr.write('APP_ID is required. Pass --app-id=<bundle-id> or set the APP_ID environment variable.\n');
        process.exitCode = 1;

        return;
    }

    if (platform === 'ios' && !AllDeviceClasses.includes(deviceClass)) {
        process.stderr.write(`Unknown device class "${deviceClass}". Pass --device-class=iphone or --device-class=ipad.\n`);
        process.exitCode = 1;

        return;
    }

    validateSelection(
        selectedSceneNames,
        AllScenes.map(scene => scene.name),
        'scene'
    );
    validateSelection(selectedLocales, AllLocales, 'locale');
    validateSelection(selectedAppearances, AllAppearances, 'appearance');

    if (verifiesAndroidScenes && platform !== 'android') {
        throw new Error('--verify is only supported on Android.');
    }

    if (verifiesAndroidScenes && !isNotEmptyString(androidSerial)) {
        throw new Error('Android serial is required for --verify. Pass --serial or set ANDROID_SERIAL.');
    }

    if (verifiesAndroidScenes) {
        const unsupportedScenes = selectedScenes.filter(scene => !isNotEmptyString(scene.deepLink));

        if (unsupportedScenes.length > 0) {
            throw new Error(`--verify requires a deep link for every scene: ${unsupportedScenes.map(scene => scene.name).join(', ')}`);
        }
    }

    deviceContext.simulatorUdid = simulatorUdid || (platform === 'ios' ? detectBootedIosSimulatorUdid(deviceClass) : '');
    maestroContext.simulatorUdid = deviceContext.simulatorUdid;

    if (platform === 'ios' && !isNotEmptyString(deviceContext.simulatorUdid)) {
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
    mkdirSync(reportDirectory, { recursive: true });
    writeFileSync(join(reportDirectory, 'report.json'), JSON.stringify(results, null, 2));

    process.stdout.write(`\nCaptured ${results.length - failedResults.length}/${results.length} scenes.\n`);

    if (results.length === 0 || failedResults.length > 0) {
        process.stdout.write(
            `Failed: ${failedResults.map(result => `${result.deviceClass}/${result.locale}/${result.appearance}/${result.scene}`).join(', ')}\n`
        );
        process.exitCode = 1;
    }
};

main();
