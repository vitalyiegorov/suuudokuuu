import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const WaitBufferByteLength = 4;
const ScreenshotMaxBufferBytes = 67108864;
const BootedUdidPattern = /\(([0-9A-F-]{36})\) \(Booted\)/u;
const PngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export const detectBootedIosSimulatorUdid = (targetDeviceClass: string): string => {
    const result = spawnSync('xcrun', ['simctl', 'list', 'devices', 'booted'], { encoding: 'utf8' });
    const bootedDeviceLines = result.stdout.split('\n').filter(line => line.includes('(Booted)'));
    const deviceClassPattern = targetDeviceClass === 'ipad' ? /ipad/iu : /iphone/iu;
    const matchingLine = bootedDeviceLines.find(line => deviceClassPattern.test(line)) ?? bootedDeviceLines[0];

    if (typeof matchingLine !== 'string') {
        return '';
    }

    const match = matchingLine.match(BootedUdidPattern);

    return match === null ? '' : match[1];
};

export interface DeviceContext {
    androidSerial: string;
    platform: string;
    scriptDirectory: string;
    simulatorUdid: string;
    statusBarMode: string;
}

export interface SceneOutcome {
    failureOutput: string;
    succeeded: boolean;
}

const adbBaseArguments = (context: DeviceContext): string[] => (context.androidSerial.length > 0 ? ['-s', context.androidSerial] : []);

const applyAndroidStatusBarOverride = (context: DeviceContext): void => {
    const serialArguments = adbBaseArguments(context);

    spawnSync('adb', [...serialArguments, 'shell', 'settings', 'put', 'global', 'sysui_demo_allowed', '1']);

    const demoCommands = [
        ['command', 'enter'],
        ['command', 'clock', '-e', 'hhmm', '0941'],
        ['command', 'battery', '-e', 'level', '100', '-e', 'plugged', 'false'],
        ['command', 'network', '-e', 'wifi', 'show', '-e', 'level', '4'],
        ['command', 'network', '-e', 'mobile', 'show', '-e', 'level', '4', '-e', 'datatype', 'none'],
        ['command', 'notifications', '-e', 'visible', 'false']
    ];

    for (const demoCommand of demoCommands) {
        spawnSync('adb', [...serialArguments, 'shell', 'am', 'broadcast', '-a', 'com.android.systemui.demo', '-e', ...demoCommand]);
    }
};

export const applyStatusBarOverride = (context: DeviceContext): void => {
    if (context.statusBarMode !== 'clean') {
        return;
    }

    if (context.platform !== 'ios') {
        applyAndroidStatusBarOverride(context);

        return;
    }

    spawnSync('xcrun', [
        'simctl',
        'status_bar',
        context.simulatorUdid,
        'override',
        '--time',
        '9:41',
        '--dataNetwork',
        'wifi',
        '--wifiMode',
        'active',
        '--wifiBars',
        '3',
        '--cellularMode',
        'active',
        '--cellularBars',
        '4',
        '--batteryState',
        'discharging',
        '--batteryLevel',
        '100'
    ]);
};

export const waitForRender = (milliseconds: number): void => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(WaitBufferByteLength)), 0, 0, milliseconds);
};

export const openDeepLink = (context: DeviceContext, deepLink: string): SceneOutcome => {
    if (context.platform === 'ios') {
        const result = spawnSync('xcrun', ['simctl', 'openurl', context.simulatorUdid, deepLink]);

        return { failureOutput: String(result.stderr), succeeded: result.status === 0 };
    }

    const result = spawnSync('adb', [
        ...adbBaseArguments(context),
        'shell',
        'am',
        'start',
        '-a',
        'android.intent.action.VIEW',
        '-d',
        deepLink
    ]);

    return { failureOutput: String(result.stderr), succeeded: result.status === 0 };
};

export const readAndroidAppPid = (context: DeviceContext, appId: string): string => {
    const result = spawnSync('adb', [...adbBaseArguments(context), 'shell', 'pidof', appId], { encoding: 'utf8' });
    const processId = result.stdout.trim();

    if (result.status !== 0 || !/^\d+$/u.test(processId)) {
        throw new Error(`Could not read a single app PID for ${appId}: ${result.stderr.trim() || processId || 'no running process'}`);
    }

    return processId;
};

export const launchVerifiedAndroidApp = (context: DeviceContext, appId: string, language: string): void => {
    const localeResult = spawnSync(
        'adb',
        [...adbBaseArguments(context), 'shell', 'cmd', 'locale', 'set-app-locales', appId, '--locales', language],
        {
            encoding: 'utf8'
        }
    );

    if (localeResult.status !== 0) {
        throw new Error(`Could not set app locale: ${localeResult.stderr.trim() || localeResult.stdout.trim()}`);
    }

    const launchResult = spawnSync('adb', [...adbBaseArguments(context), 'shell', 'am', 'start', '-n', `${appId}/.MainActivity`], {
        encoding: 'utf8'
    });

    if (launchResult.status !== 0) {
        throw new Error(`Could not launch app: ${launchResult.stderr.trim() || launchResult.stdout.trim()}`);
    }
};

export const verifyAndroidReadyScene = (context: DeviceContext, readyTestId: string): void => {
    const hierarchyPath = '/sdcard/store-capture-window.xml';
    const serialArguments = adbBaseArguments(context);
    const clearResult = spawnSync('adb', [...serialArguments, 'shell', 'rm', '-f', hierarchyPath], { encoding: 'utf8' });

    if (clearResult.status !== 0) {
        throw new Error(`Could not clear previous active-window hierarchy: ${clearResult.stderr.trim()}`);
    }

    const dumpResult = spawnSync('adb', [...serialArguments, 'shell', 'uiautomator', 'dump', hierarchyPath], {
        encoding: 'utf8',
        maxBuffer: ScreenshotMaxBufferBytes
    });

    if (dumpResult.status !== 0) {
        throw new Error(`Could not dump active-window hierarchy: ${dumpResult.stderr.trim() || dumpResult.stdout.trim()}`);
    }

    const hierarchyResult = spawnSync('adb', [...serialArguments, 'shell', 'cat', hierarchyPath], {
        encoding: 'utf8',
        maxBuffer: ScreenshotMaxBufferBytes
    });

    if (hierarchyResult.status !== 0 || !hierarchyResult.stdout.includes('<hierarchy')) {
        throw new Error(
            `Could not read active-window hierarchy: ${hierarchyResult.stderr.trim() || dumpResult.stdout.trim() || hierarchyResult.stdout.trim()}`
        );
    }

    if (!hierarchyResult.stdout.includes(`resource-id="${readyTestId}"`)) {
        throw new Error(`Expected active-window resource-id "${readyTestId}" was absent from the hierarchy.`);
    }
};

export const writeDeviceScreenshot = (context: DeviceContext, screenshotPath: string, verifyPng = false): SceneOutcome => {
    if (context.platform === 'ios') {
        const result = spawnSync('xcrun', ['simctl', 'io', context.simulatorUdid, 'screenshot', '--type=png', screenshotPath], {
            encoding: 'utf8'
        });

        return { failureOutput: `${result.stdout}${result.stderr}`.trim(), succeeded: result.status === 0 };
    }

    const result = spawnSync('adb', [...adbBaseArguments(context), 'exec-out', 'screencap', '-p'], {
        maxBuffer: ScreenshotMaxBufferBytes
    });

    if (result.status !== 0) {
        return { failureOutput: `Could not capture screenshot: ${String(result.stderr).trim()}`, succeeded: false };
    }

    if (
        verifyPng &&
        (result.stdout.length < 24 ||
            !result.stdout.subarray(0, 8).equals(PngSignature) ||
            result.stdout.toString('ascii', 12, 16) !== 'IHDR' ||
            result.stdout.readUInt32BE(16) === 0 ||
            result.stdout.readUInt32BE(20) === 0)
    ) {
        return { failureOutput: 'Screenshot is not a PNG with a valid IHDR and positive dimensions.', succeeded: false };
    }

    writeFileSync(screenshotPath, result.stdout);

    return { failureOutput: '', succeeded: true };
};

export const rotateSimulator = (context: DeviceContext, targetOrientation: string): void => {
    const detachResult = spawnSync('npx', ['serve-sim', '--detach', '-q', context.simulatorUdid], { encoding: 'utf8' });

    if (detachResult.status !== 0) {
        throw new Error('Failed to start serve-sim for rotation. Install it with "npx serve-sim" once, then retry.');
    }

    const rotateResult = spawnSync('npx', ['serve-sim', 'rotate', targetOrientation, '-d', context.simulatorUdid], {
        encoding: 'utf8'
    });

    if (rotateResult.status !== 0) {
        throw new Error(`Failed to rotate simulator to ${targetOrientation}: ${rotateResult.stderr}`);
    }
};

export const recycleIosDriver = (context: DeviceContext): void => {
    if (context.platform !== 'ios' || context.simulatorUdid.length === 0) {
        return;
    }

    spawnSync('bash', [join(context.scriptDirectory, 'recycle-ios-driver.sh'), context.simulatorUdid], { encoding: 'utf8' });
};
