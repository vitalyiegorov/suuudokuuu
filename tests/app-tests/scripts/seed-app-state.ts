import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appTestsDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appTestsDirectory));
const seedFixturePath = join(appTestsDirectory, 'fixtures', 'screenshot-seed-state.json');
const migrationsSourcePath = join(repositoryRootDirectory, 'packages', 'app', 'src', '@generic', 'app-root-migrations.ts');
const languagesSourcePath = join(repositoryRootDirectory, 'packages', 'app', 'src', 'settings', 'constant', 'languages.constant.ts');

const PersistRootKey = 'persist:root';
export const IosStorageRelativePath = join('Documents', 'SQLite', 'ExpoSQLiteStorage');
export const AndroidStorageRelativePath = 'files/SQLite/ExpoSQLiteStorage';
const PersistVersionPattern = /appRootPersistVersion\s*=\s*(\d+)/u;
const LanguagesPattern = /export const Languages = \[([^\]]+)\]/u;
const QuotePattern = /'/gu;
const LanguageQuotesPattern = /['"]/gu;

interface SeedFixture {
    customThemes: Record<string, unknown>;
    game: Record<string, unknown>;
    sceneStates: Record<string, Record<string, unknown>>;
    settings: Record<string, unknown>;
}

interface CommandResult {
    output: string;
    succeeded: boolean;
}

export interface SeedTarget {
    appId: string;
    platform: string;
    serial: string;
    udid: string;
}

export interface SeedOptions {
    appearance: string;
    difficulty: string;
    language: string;
    sceneState?: string;
}

const runCommand = (command: string, commandArguments: string[]): CommandResult => {
    const result = spawnSync(command, commandArguments, { encoding: 'utf8' });
    const output = `${result.stdout}${result.stderr}`.trim();

    return { output, succeeded: result.status === 0 };
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const readPersistVersion = (): number => {
    const source = readFileSync(migrationsSourcePath, 'utf8');
    const match = source.match(PersistVersionPattern);

    if (match === null) {
        throw new Error(`Could not read appRootPersistVersion from ${migrationsSourcePath}`);
    }

    return Number(match[1]);
};

const readSupportedLanguages = (): string[] => {
    const source = readFileSync(languagesSourcePath, 'utf8');
    const match = source.match(LanguagesPattern);

    if (match === null) {
        throw new Error(`Could not read Languages from ${languagesSourcePath}`);
    }

    return match[1]
        .split(',')
        .map(entry => entry.trim().replace(LanguageQuotesPattern, ''))
        .filter(entry => entry.length > 0);
};

const readSeedFixture = (): SeedFixture => {
    const parsed: unknown = JSON.parse(readFileSync(seedFixturePath, 'utf8'));

    if (!isRecord(parsed)) {
        throw new Error(`${seedFixturePath} is not a valid seed fixture`);
    }

    const { customThemes, game, sceneStates, settings } = parsed;

    if (!isRecord(customThemes) || !isRecord(game) || !isRecord(settings)) {
        throw new Error(`${seedFixturePath} must contain game, settings and customThemes objects`);
    }

    const parsedSceneStates: Record<string, Record<string, unknown>> = {};

    if (isRecord(sceneStates)) {
        for (const [sceneName, sceneState] of Object.entries(sceneStates)) {
            if (isRecord(sceneState)) {
                parsedSceneStates[sceneName] = sceneState;
            }
        }
    }

    return { customThemes, game, sceneStates: parsedSceneStates, settings };
};

const buildPersistRootValue = (options: SeedOptions): string => {
    const fixture = readSeedFixture();
    const supportedLanguages = readSupportedLanguages();

    if (!supportedLanguages.includes(options.language)) {
        throw new Error(`Unsupported language "${options.language}". Supported: ${supportedLanguages.join(', ')}`);
    }

    const settings = {
        ...fixture.settings,
        isDarkColorSchema: options.appearance === 'dark',
        language: options.language,
        lastGameDifficulty: options.difficulty
    };
    const requestedSceneState = options.sceneState ?? '';
    const hasSceneState = requestedSceneState.length > 0;

    if (hasSceneState && !Object.hasOwn(fixture.sceneStates, requestedSceneState)) {
        throw new Error(`Unknown scene state "${requestedSceneState}". Known: ${Object.keys(fixture.sceneStates).join(', ')}`);
    }

    const game = { ...fixture.game, ...(hasSceneState && fixture.sceneStates[requestedSceneState]) };
    const persistMetadata = { rehydrated: true, version: readPersistVersion() };

    return JSON.stringify({
        _persist: JSON.stringify(persistMetadata),
        customThemes: JSON.stringify(fixture.customThemes),
        game: JSON.stringify(game),
        settings: JSON.stringify(settings)
    });
};

const writePersistRootToDatabase = (databasePath: string, value: string): void => {
    const escapedValue = value.replace(QuotePattern, "''");
    const statements = [
        'CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY NOT NULL, value TEXT);',
        `INSERT INTO storage (key, value) VALUES ('${PersistRootKey}', '${escapedValue}') ` +
            'ON CONFLICT(key) DO UPDATE SET value = excluded.value;'
    ].join('\n');
    const result = spawnSync('sqlite3', [databasePath], { encoding: 'utf8', input: statements });

    if (result.status !== 0) {
        throw new Error(`Could not write ${PersistRootKey} into ${databasePath}: ${result.stderr}`);
    }
};

const getIosStorageDatabasePath = (udid: string, appId: string): string => {
    const container = runCommand('xcrun', ['simctl', 'get_app_container', udid, appId, 'data']);

    if (!container.succeeded) {
        throw new Error(`Could not resolve the data container for ${appId} on ${udid}: ${container.output}`);
    }

    return join(container.output.trim(), IosStorageRelativePath);
};

const seedIosState = (target: SeedTarget, value: string): void => {
    runCommand('xcrun', ['simctl', 'terminate', target.udid, target.appId]);
    writePersistRootToDatabase(getIosStorageDatabasePath(target.udid, target.appId), value);
};

const adbArguments = (serial: string, commandArguments: string[]): string[] => {
    const serialArguments = serial.length > 0 ? ['-s', serial] : [];

    return [...serialArguments, ...commandArguments];
};

const isAndroidRootAvailable = (serial: string): boolean => {
    runCommand('adb', adbArguments(serial, ['root']));

    const probe = runCommand('adb', adbArguments(serial, ['shell', 'id']));

    return probe.succeeded && probe.output.includes('uid=0');
};

const seedAndroidState = (target: SeedTarget, value: string): void => {
    runCommand('adb', adbArguments(target.serial, ['shell', 'am', 'force-stop', target.appId]));

    if (!isAndroidRootAvailable(target.serial)) {
        throw new Error(
            'adb root is unavailable on this emulator, so the persisted store cannot be written directly. ' +
                'Create the AVD from a "google_apis" system image (not "google_apis_playstore"), which is rootable.'
        );
    }

    const databasePath = `/data/data/${target.appId}/${AndroidStorageRelativePath}`;
    const localPath = join(tmpdir(), `suuudokuuu-persist-${process.pid}.db`);
    const pulled = runCommand('adb', adbArguments(target.serial, ['pull', databasePath, localPath]));

    if (!pulled.succeeded) {
        throw new Error(`Could not pull ${databasePath}: ${pulled.output}`);
    }

    writePersistRootToDatabase(localPath, value);

    const pushed = runCommand('adb', adbArguments(target.serial, ['push', localPath, databasePath]));

    if (!pushed.succeeded) {
        throw new Error(`Could not push ${databasePath}: ${pushed.output}`);
    }

    runCommand('adb', adbArguments(target.serial, ['shell', 'rm', '-f', `${databasePath}-wal`, `${databasePath}-shm`]));
};

export const seedAppState = (target: SeedTarget, options: SeedOptions): void => {
    const value = buildPersistRootValue(options);

    if (target.platform === 'ios') {
        seedIosState(target, value);

        return;
    }

    seedAndroidState(target, value);
};

export const launchSeededApp = (target: SeedTarget, language: string, localeIdentifier: string): void => {
    if (target.platform === 'ios') {
        runCommand('xcrun', [
            'simctl',
            'launch',
            target.udid,
            target.appId,
            '-AppleLanguages',
            `(${language})`,
            '-AppleLocale',
            localeIdentifier
        ]);

        return;
    }

    runCommand('adb', adbArguments(target.serial, ['shell', 'cmd', 'locale', 'set-app-locales', target.appId, '--locales', language]));
    runCommand('adb', adbArguments(target.serial, ['shell', 'am', 'start', '-n', `${target.appId}/.MainActivity`]));
};

const main = (): void => {
    const { values: cliOptions } = parseArgs({
        options: {
            appearance: { type: 'string' },
            'app-id': { type: 'string' },
            difficulty: { type: 'string' },
            language: { type: 'string' },
            platform: { type: 'string' },
            'scene-state': { type: 'string' },
            serial: { type: 'string' },
            udid: { type: 'string' }
        }
    });
    const { ANDROID_SERIAL, APP_ID, SIMULATOR_UDID } = process.env;
    const appId = cliOptions['app-id'] ?? APP_ID ?? '';

    if (appId.length === 0) {
        throw new Error('APP_ID is required. Pass --app-id=<bundle-id> or set the APP_ID environment variable.');
    }

    const target: SeedTarget = {
        appId,
        platform: cliOptions.platform ?? 'ios',
        serial: cliOptions.serial ?? ANDROID_SERIAL ?? '',
        udid: cliOptions.udid ?? SIMULATOR_UDID ?? ''
    };
    const options: SeedOptions = {
        appearance: cliOptions.appearance ?? 'dark',
        difficulty: cliOptions.difficulty ?? 'Hell',
        language: cliOptions.language ?? 'en',
        sceneState: cliOptions['scene-state']
    };

    seedAppState(target, options);
    process.stdout.write(`Seeded ${target.platform} state: language=${options.language}, appearance=${options.appearance}\n`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
