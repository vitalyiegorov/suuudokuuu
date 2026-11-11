import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appTestsDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appTestsDirectory));
const seedFixturePath = join(appTestsDirectory, 'fixtures', 'screenshot-seed-state.json');
const migrationsSourcePath = join(
    repositoryRootDirectory,
    'packages',
    'progress',
    'src',
    'legacy',
    'utils',
    'make-legacy-migrations.util.ts'
);
const languagesSourcePath = join(repositoryRootDirectory, 'packages', 'progress', 'src', 'settings', 'constant', 'languages.constant.ts');

const PersistRootKey = 'persist:root';
const PersistVersionPattern = /LegacyPersistVersion\s*=\s*(\d+)/u;
const SeedFixtureBaselinePersistVersion = 40;
const LanguagesPattern = /export const Languages = \[([^\]]+)\]/u;
const LanguageQuotesPattern = /['"]/gu;

interface SeedFixture {
    customThemes: Record<string, unknown>;
    game: Record<string, unknown>;
    sceneStates: Record<string, Record<string, unknown>>;
    settings: Record<string, unknown>;
}

interface ChallengeTimingState {
    elapsedTime?: unknown;
    wallClockStartMs?: unknown;
}

interface SeedOptions {
    appearance: string;
    difficulty: string;
    language: string;
    sceneState?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const reanchorChallengeWallClockStart = (game: ChallengeTimingState): void => {
    const { elapsedTime, wallClockStartMs } = game;

    if (typeof elapsedTime === 'number' && typeof wallClockStartMs === 'number') {
        game.wallClockStartMs = Date.now() - elapsedTime * 1000;
    }
};

const readPersistVersion = (): number => {
    const source = readFileSync(migrationsSourcePath, 'utf8');
    const match = PersistVersionPattern.exec(source);

    if (match === null) {
        throw new Error(`Could not read LegacyPersistVersion from ${migrationsSourcePath}`);
    }

    return Number(match[1]);
};

const resolveSeedPersistVersion = (): number => {
    const livePersistVersion = readPersistVersion();

    if (SeedFixtureBaselinePersistVersion >= livePersistVersion) {
        throw new Error(
            `SeedFixtureBaselinePersistVersion (${SeedFixtureBaselinePersistVersion}) must stay below LegacyPersistVersion ` +
                `(${livePersistVersion}) read from ${migrationsSourcePath}, or persisted-state migrations stop running against the seed fixture.`
        );
    }

    return SeedFixtureBaselinePersistVersion;
};

const readSupportedLanguages = (): string[] => {
    const source = readFileSync(languagesSourcePath, 'utf8');
    const match = LanguagesPattern.exec(source);

    if (match === null) {
        throw new Error(`Could not read Languages from ${languagesSourcePath}`);
    }

    return match[1]
        .split(',')
        .map(entry => entry.trim().replaceAll(LanguageQuotesPattern, ''))
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

    const requestedSceneState = options.sceneState ?? '';
    const hasSceneState = requestedSceneState.length > 0;

    if (hasSceneState && !Object.hasOwn(fixture.sceneStates, requestedSceneState)) {
        throw new Error(`Unknown scene state "${requestedSceneState}". Known: ${Object.keys(fixture.sceneStates).join(', ')}`);
    }

    const { settingsOverrides, ...sceneGame } = hasSceneState ? fixture.sceneStates[requestedSceneState] : {};
    const game = { ...fixture.game, ...sceneGame };
    const settings = {
        ...fixture.settings,
        ...(isRecord(settingsOverrides) && settingsOverrides),
        isDarkColorSchema: options.appearance === 'dark',
        language: options.language,
        lastGameDifficulty: options.difficulty
    };

    reanchorChallengeWallClockStart(game);

    const persistMetadata = { rehydrated: true, version: resolveSeedPersistVersion() };

    return JSON.stringify({
        _persist: JSON.stringify(persistMetadata),
        customThemes: JSON.stringify(fixture.customThemes),
        game: JSON.stringify(game),
        settings: JSON.stringify(settings)
    });
};

const writePersistRootToDatabase = (databasePath: string, value: string): void => {
    mkdirSync(dirname(databasePath), { recursive: true });
    const database = new DatabaseSync(databasePath);

    try {
        database.exec('CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY NOT NULL, value TEXT);');
        database
            .prepare('INSERT INTO storage (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;')
            .run(PersistRootKey, value);
    } finally {
        database.close();
    }
};

export const persistRootDatabase = (options: SeedOptions): Buffer => {
    const directory = mkdtempSync(join(tmpdir(), 'suuudokuuu-persist-'));
    const databasePath = join(directory, 'ExpoSQLiteStorage');

    try {
        writePersistRootToDatabase(databasePath, buildPersistRootValue(options));

        return readFileSync(databasePath);
    } finally {
        rmSync(directory, { force: true, recursive: true });
    }
};
