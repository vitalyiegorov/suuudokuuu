import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appDirectory));

const iosReleaseNotesCharacterLimit = 4000;
const androidChangelogCharacterLimit = 500;

const userFacingCommitTypes = new Set(['feat', 'fix', 'perf', 'i18n']);
const userFacingCommitScopes = new Set(['app', 'ui']);

const conventionalCommitPattern =
    /^(?<type>[a-z]+)(?:\((?<scope>[a-z0-9,-]+)\))?(?<breaking>!)?:\s*(?<subject>.+)$/i;

const localeStoreFolders = [
    { appLocale: 'ar', iosLocale: 'ar-SA', androidLocale: 'ar' },
    { appLocale: 'bn', iosLocale: undefined, androidLocale: 'bn-BD' },
    { appLocale: 'de', iosLocale: 'de-DE', androidLocale: 'de-DE' },
    { appLocale: 'en', iosLocale: 'en-US', androidLocale: 'en-US' },
    { appLocale: 'es', iosLocale: 'es-ES', androidLocale: 'es-ES' },
    { appLocale: 'fr', iosLocale: 'fr-FR', androidLocale: 'fr-FR' },
    { appLocale: 'hi', iosLocale: 'hi', androidLocale: 'hi-IN' },
    { appLocale: 'id', iosLocale: 'id', androidLocale: 'id' },
    { appLocale: 'pt', iosLocale: 'pt-BR', androidLocale: 'pt-BR' },
    { appLocale: 'sv', iosLocale: 'sv', androidLocale: 'sv-SE' },
    { appLocale: 'uk', iosLocale: 'uk', androidLocale: 'uk' },
    { appLocale: 'ur', iosLocale: undefined, androidLocale: 'ur' },
    { appLocale: 'zh', iosLocale: 'zh-Hans', androidLocale: 'zh-CN' },
];

function runGit(args) {
    return execFileSync('git', args, { cwd: repositoryRootDirectory, encoding: 'utf8' }).trim();
}

function getLatestTag() {
    return runGit(['describe', '--tags', '--abbrev=0']);
}

function getPreviousTag(latestTag) {
    const sortedTags = runGit(['tag', '--list', 'v*', '--sort=-v:refname'])
        .split('\n')
        .filter(tag => tag.length > 0);
    const latestTagIndex = sortedTags.indexOf(latestTag);
    const hasPreviousTag = latestTagIndex >= 0 && latestTagIndex + 1 < sortedTags.length;

    return hasPreviousTag ? sortedTags[latestTagIndex + 1] : undefined;
}

function getCommitSubjects(previousTag, latestTag) {
    const range = previousTag === undefined ? latestTag : `${previousTag}..${latestTag}`;
    const log = runGit(['log', range, '--pretty=%s']);

    return log.length === 0 ? [] : log.split('\n');
}

function isUserFacingCommit(commitMatch) {
    const { type, scope } = commitMatch.groups;
    const hasUserFacingType = userFacingCommitTypes.has(type.toLowerCase());

    if (!hasUserFacingType) {
        return false;
    }

    if (scope === undefined) {
        return true;
    }

    const scopeSegments = scope.toLowerCase().split(',');

    return scopeSegments.every(scopeSegment => userFacingCommitScopes.has(scopeSegment));
}

function toSentenceCase(text) {
    const trimmedText = text.trim();

    return trimmedText.length === 0
        ? trimmedText
        : trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
}

function getReleaseNoteBullets(commitSubjects) {
    const seenNormalizedBullets = new Set();
    const bullets = [];

    for (const commitSubject of commitSubjects) {
        const commitMatch = conventionalCommitPattern.exec(commitSubject);

        if (commitMatch === null || !isUserFacingCommit(commitMatch)) {
            continue;
        }

        const bullet = toSentenceCase(commitMatch.groups.subject);
        const normalizedBullet = bullet.toLowerCase();

        if (bullet.length === 0 || seenNormalizedBullets.has(normalizedBullet)) {
            continue;
        }

        seenNormalizedBullets.add(normalizedBullet);
        bullets.push(bullet);
    }

    return bullets;
}

function renderReleaseNotes(bullets) {
    if (bullets.length === 0) {
        return "What's new:\n- Stability and quality improvements.";
    }

    const bulletLines = bullets.map(bullet => `- ${bullet}`);

    return ["What's new:", ...bulletLines].join('\n');
}

function trimToCharacterLimit(text, characterLimit) {
    return text.length <= characterLimit ? text : text.slice(0, characterLimit);
}

function trimToLineBoundary(text, characterLimit) {
    if (text.length <= characterLimit) {
        return text;
    }

    const truncatedText = text.slice(0, characterLimit);
    const lastLineBreakIndex = truncatedText.lastIndexOf('\n');
    const boundaryIndex = lastLineBreakIndex > 0 ? lastLineBreakIndex : characterLimit;

    return truncatedText.slice(0, boundaryIndex).trimEnd();
}

function writeReleaseNotesFile(filePath, content) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
}

function reportStaleLocaleReleaseNotes(metadataDirectory) {
    const staleFilePaths = [
        ...localeStoreFolders
            .filter(({ iosLocale }) => iosLocale !== undefined && iosLocale !== 'en-US')
            .map(({ iosLocale }) => join(metadataDirectory, 'ios', iosLocale, 'release_notes.txt')),
        ...localeStoreFolders
            .filter(({ androidLocale }) => androidLocale !== 'en-US')
            .map(({ androidLocale }) =>
                join(metadataDirectory, 'android', androidLocale, 'changelogs', 'default.txt')
            ),
    ].filter(filePath => existsSync(filePath));

    if (staleFilePaths.length === 0) {
        return;
    }

    console.warn('Locale release notes that may now be stale against the refreshed en-US copy:');

    for (const staleFilePath of staleFilePaths) {
        const { mtime } = statSync(staleFilePath);
        console.warn(`  ${staleFilePath} (last modified ${mtime.toISOString()})`);
    }
}

function main() {
    const latestTag = getLatestTag();
    const previousTag = getPreviousTag(latestTag);
    const commitSubjects = getCommitSubjects(previousTag, latestTag);
    const bullets = getReleaseNoteBullets(commitSubjects);
    const releaseNotes = renderReleaseNotes(bullets);

    const metadataDirectory = join(appDirectory, 'fastlane', 'metadata');
    const iosReleaseNotesPath = join(metadataDirectory, 'ios', 'en-US', 'release_notes.txt');
    const androidChangelogPath = join(
        metadataDirectory,
        'android',
        'en-US',
        'changelogs',
        'default.txt'
    );

    writeReleaseNotesFile(
        iosReleaseNotesPath,
        trimToCharacterLimit(releaseNotes, iosReleaseNotesCharacterLimit)
    );
    writeReleaseNotesFile(
        androidChangelogPath,
        trimToLineBoundary(releaseNotes, androidChangelogCharacterLimit)
    );

    console.log(`Generated store release notes from ${previousTag ?? '(initial commit)'}..${latestTag}`);
    console.log(`  ${iosReleaseNotesPath}`);
    console.log(`  ${androidChangelogPath}`);

    reportStaleLocaleReleaseNotes(metadataDirectory);
}

main();
