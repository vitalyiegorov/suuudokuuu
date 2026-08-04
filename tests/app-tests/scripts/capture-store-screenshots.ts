#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { bakeLandscapeScreenshot } from './bake-landscape-screenshot.ts';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appTestsDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appTestsDirectory));
const configPath = join(appTestsDirectory, 'config.yaml');
const screenshotsFlowsDirectory = join(appTestsDirectory, 'flows', 'screenshots');
const defaultOutputRootDirectory = join(repositoryRootDirectory, 'packages', 'app', 'fastlane', 'screenshots', 'raw');

const AllLocales = ['en', 'uk', 'de', 'es', 'fr', 'sv', 'zh', 'hi', 'ar', 'bn', 'pt', 'id', 'ur'];
const AllAppearances = ['light', 'dark'];
const AllDeviceClasses = ['iphone', 'ipad'];

interface Scene {
    file: string;
    name: string;
}

const AllScenes: Scene[] = [
    { file: '01.hero-board.flow.yaml', name: 'hero-board' },
    { file: '02.hell.flow.yaml', name: 'hell' },
    { file: '03.themes.flow.yaml', name: 'themes' },
    { file: '04.editor.flow.yaml', name: 'editor' },
    { file: '05.win.flow.yaml', name: 'win' },
    { file: '06.rival.flow.yaml', name: 'rival' },
    { file: '07.replay.flow.yaml', name: 'replay' },
    { file: '08.settings.flow.yaml', name: 'settings' },
    { file: '09.home.flow.yaml', name: 'home' },
    { file: '10.stats.flow.yaml', name: 'stats' },
    { file: '11.pause.flow.yaml', name: 'pause' },
    { file: '12.scoring.flow.yaml', name: 'scoring' },
    { file: '13.history.flow.yaml', name: 'history' },
    { file: '14.challenge-live.flow.yaml', name: 'challenge-live' }
];

function parseCommaSeparatedList(value: string): string[] {
    return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

function isDefinedString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

const { values: cliOptions } = parseArgs({
    options: {
        'app-id': { type: 'string' },
        appearances: { type: 'string' },
        'device-class': { type: 'string' },
        locales: { type: 'string' },
        orientation: { type: 'string' },
        'output-dir': { type: 'string' },
        platform: { type: 'string' },
        scenes: { type: 'string' },
        udid: { type: 'string' }
    }
});

function detectBootedIosSimulatorUdid(targetDeviceClass: string): string {
    const result = spawnSync('xcrun', ['simctl', 'list', 'devices', 'booted'], { encoding: 'utf8' });
    const bootedDeviceLines = (result.stdout ?? '').split('\n').filter(line => line.includes('(Booted)'));
    const deviceClassPattern = targetDeviceClass === 'ipad' ? /ipad/i : /iphone/i;
    const matchingLine = bootedDeviceLines.find(line => deviceClassPattern.test(line)) ?? bootedDeviceLines[0];
    const match = matchingLine?.match(/\(([0-9A-F-]{36})\) \(Booted\)/);

    return match?.[1] ?? '';
}

const platform = cliOptions.platform ?? process.env['SCREENSHOT_PLATFORM'] ?? 'ios';
const appId = cliOptions['app-id'] ?? process.env['APP_ID'];
const deviceClass = cliOptions['device-class'] ?? process.env['DEVICE_CLASS'] ?? 'iphone';
const simulatorUdid =
    cliOptions.udid ?? process.env['SIMULATOR_UDID'] ?? (platform === 'ios' ? detectBootedIosSimulatorUdid(deviceClass) : '');
const orientation = cliOptions.orientation ?? process.env['ORIENTATION'] ?? 'portrait';
const outputRootDirectory = cliOptions['output-dir'] ?? process.env['SCREENSHOT_OUTPUT_DIR'] ?? defaultOutputRootDirectory;

if (!['portrait', 'landscape'].includes(orientation)) {
    process.stderr.write(`Unknown orientation "${orientation}". Use portrait or landscape.\n`);
    process.exit(1);
}

if (orientation === 'landscape' && deviceClass !== 'ipad') {
    process.stderr.write('Landscape capture is only supported for the ipad device class; the app locks iPhone to portrait.\n');
    process.exit(1);
}

const selectedLocales = isDefinedString(cliOptions.locales) ? parseCommaSeparatedList(cliOptions.locales) : AllLocales;
const selectedAppearances = isDefinedString(cliOptions.appearances) ? parseCommaSeparatedList(cliOptions.appearances) : AllAppearances;
const selectedSceneNames = isDefinedString(cliOptions.scenes)
    ? parseCommaSeparatedList(cliOptions.scenes)
    : AllScenes.map(scene => scene.name);
const selectedScenes = AllScenes.filter(scene => selectedSceneNames.includes(scene.name));

function flattenMaestroScreenshotsDirectory(testOutputDirectory: string): void {
    const nestedScreenshotsDirectory = join(testOutputDirectory, 'screenshots');

    if (!existsSync(nestedScreenshotsDirectory)) {
        return;
    }

    for (const screenshotFileName of readdirSync(nestedScreenshotsDirectory)) {
        renameSync(join(nestedScreenshotsDirectory, screenshotFileName), join(testOutputDirectory, screenshotFileName));
    }

    rmdirSync(nestedScreenshotsDirectory);
}

interface MaestroSceneOutcome {
    failureOutput: string;
    succeeded: boolean;
}

function runMaestroScene(scene: Scene, locale: string, appearance: string, testOutputDirectory: string): MaestroSceneOutcome {
    const flowPath = join(screenshotsFlowsDirectory, scene.file);
    const maestroArguments = [
        'test',
        flowPath,
        '--config',
        configPath,
        '-e',
        `APP_ID=${appId}`,
        '-e',
        `LOCALE=${locale}`,
        '-e',
        `APPEARANCE=${appearance}`,
        '--test-output-dir',
        testOutputDirectory,
        '--debug-output',
        join(appTestsDirectory, 'artifacts', 'screenshots-debug', `${locale}-${appearance}-${scene.name}`)
    ];

    if (isDefinedString(simulatorUdid)) {
        maestroArguments.push('--udid', simulatorUdid);
    }

    if (platform !== 'ios') {
        maestroArguments.push('--platform', platform);
    }

    const result = spawnSync('maestro', maestroArguments, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const spawnErrorMessage = result.error?.message ?? '';
    const failureOutput = `${spawnErrorMessage}\n${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();

    flattenMaestroScreenshotsDirectory(testOutputDirectory);

    return { failureOutput, succeeded: result.status === 0 };
}

function sceneScreenshotBaseName(scene: Scene): string {
    const sceneNumberPrefix = scene.file.split('.')[0];

    return `${sceneNumberPrefix}-${scene.name}`;
}

function rotateSimulator(targetOrientation: string): void {
    const detachResult = spawnSync('npx', ['serve-sim', '--detach', '-q', simulatorUdid], { encoding: 'utf8' });

    if (detachResult.status !== 0) {
        process.stderr.write('Failed to start serve-sim for rotation. Install it with "npx serve-sim" once, then retry.\n');
        process.exit(1);
    }

    const rotateResult = spawnSync('npx', ['serve-sim', 'rotate', targetOrientation, '-d', simulatorUdid], {
        encoding: 'utf8'
    });

    if (rotateResult.status !== 0) {
        process.stderr.write(`Failed to rotate simulator to ${targetOrientation}: ${rotateResult.stderr}\n`);
        process.exit(1);
    }
}

interface CaptureResult {
    appearance: string;
    deviceClass: string;
    durationSeconds: number;
    locale: string;
    scene: string;
    status: 'success' | 'failure';
}

function captureCombination(locale: string, appearance: string): CaptureResult[] {
    const deviceClassSegment = orientation === 'landscape' ? `${deviceClass}-landscape` : deviceClass;
    const deviceClassPathSegments = platform === 'ios' ? [deviceClassSegment] : [];
    const testOutputDirectory = join(outputRootDirectory, platform, ...deviceClassPathSegments, locale, appearance);

    mkdirSync(testOutputDirectory, { recursive: true });

    return selectedScenes.map(scene => {
        const startedAt = Date.now();
        const firstAttempt = runMaestroScene(scene, locale, appearance, testOutputDirectory);
        let sceneOutcome = firstAttempt;

        if (!firstAttempt.succeeded) {
            recycleIosDriver();
            sceneOutcome = runMaestroScene(scene, locale, appearance, testOutputDirectory);
        }

        const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
        const status = sceneOutcome.succeeded ? 'success' : 'failure';

        process.stdout.write(`[${deviceClass}/${locale}/${appearance}] ${scene.name}: ${status} (${durationSeconds}s)\n`);

        if (!sceneOutcome.succeeded) {
            process.stderr.write(`${sceneOutcome.failureOutput}\n`);
        }

        if (sceneOutcome.succeeded && orientation === 'landscape') {
            bakeLandscapeScreenshot(join(testOutputDirectory, `${sceneScreenshotBaseName(scene)}.png`));
        }

        return { appearance, deviceClass, durationSeconds, locale, scene: scene.name, status };
    });
}

function recycleIosDriver(): void {
    if (platform !== 'ios' || simulatorUdid.length === 0) {
        return;
    }

    spawnSync('bash', [join(scriptDirectory, 'recycle-ios-driver.sh'), simulatorUdid], { encoding: 'utf8' });
}

function main(): void {
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

    recycleIosDriver();

    if (orientation === 'landscape') {
        rotateSimulator('landscape_left');
    }

    const results: CaptureResult[] = [];

    for (const locale of selectedLocales) {
        for (const appearance of selectedAppearances) {
            results.push(...captureCombination(locale, appearance));
        }
    }

    if (orientation === 'landscape') {
        rotateSimulator('portrait');
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
}

main();
