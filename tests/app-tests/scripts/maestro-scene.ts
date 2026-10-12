import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

import { type SceneOutcome } from './capture-device.ts';
import { type Scene, localeIdentifierFor } from './screenshot-scenes.ts';

export interface MaestroContext {
    appId: string;
    artifactsDirectory: string;
    configPath: string;
    flowsDirectory: string;
    platform: string;
    simulatorUdid: string;
}

export interface MaestroSceneRequest {
    appearance: string;
    locale: string;
    scene: Scene;
    testOutputDirectory: string;
}

const flattenMaestroScreenshotsDirectory = (testOutputDirectory: string): void => {
    const nestedScreenshotsDirectory = join(testOutputDirectory, 'screenshots');

    if (!existsSync(nestedScreenshotsDirectory)) {
        return;
    }

    for (const screenshotFileName of readdirSync(nestedScreenshotsDirectory)) {
        renameSync(join(nestedScreenshotsDirectory, screenshotFileName), join(testOutputDirectory, screenshotFileName));
    }

    rmdirSync(nestedScreenshotsDirectory);
};

export const runMaestroScene = (context: MaestroContext, request: MaestroSceneRequest): SceneOutcome => {
    const { appearance, locale, scene, testOutputDirectory } = request;
    if (scene.file === undefined) {
        throw new Error(`Scene ${scene.name} has no Maestro flow.`);
    }

    const maestroArguments = [
        'test',
        join(context.flowsDirectory, scene.file),
        '--config',
        context.configPath,
        '-e',
        `APP_ID=${context.appId}`,
        '-e',
        `LOCALE=${locale}`,
        '-e',
        `LOCALE_IDENTIFIER=${localeIdentifierFor(locale)}`,
        '-e',
        `APPEARANCE=${appearance}`,
        '--test-output-dir',
        testOutputDirectory,
        '--debug-output',
        join(context.artifactsDirectory, `${locale}-${appearance}-${scene.name}`)
    ];

    if (context.simulatorUdid.length > 0) {
        maestroArguments.push('--udid', context.simulatorUdid);
    }

    if (context.platform !== 'ios') {
        maestroArguments.push('--platform', context.platform);
    }

    const result = spawnSync('maestro', maestroArguments, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const spawnErrorMessage = result.error?.message ?? '';
    const failureOutput = `${spawnErrorMessage}\n${result.stdout}\n${result.stderr}`.trim();

    flattenMaestroScreenshotsDirectory(testOutputDirectory);

    return { failureOutput, succeeded: result.status === 0 };
};
