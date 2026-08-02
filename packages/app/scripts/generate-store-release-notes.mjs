import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = dirname(scriptDirectory);
const repositoryRootDirectory = dirname(dirname(appDirectory));

const requireFromScript = createRequire(import.meta.url);
const { getErrorMessage, isNotEmptyString } = requireFromScript('@rnw-community/shared');

const iosReleaseNotesCharacterLimit = 4000;
const androidChangelogCharacterLimit = 500;

const storeNotesModel = process.env.STORE_NOTES_MODEL ?? 'claude-opus-5';
const releaseNotesMaxTokens = 64000;
const appStoreNotesCodepointLimit = 3900;
const playChangelogCodepointLimit = 490;

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

const appLocales = localeStoreFolders.map(({ appLocale }) => appLocale);

const releaseNotesSystemPrompt = `You are the release-notes copywriter for suuudokuuu, a free, open-source Sudoku game for iOS and Android.

Voice: confident, playful, and human. Use short, punchy lines, never corporate or hedgy phrasing. Lead every locale's copy with the single most user-visible change in this release, then use benefit-led bullet points starting with "•" for the rest — describe what the player gains, not what the code did. Never mention AI, bots, automation, or any internal tooling; write as if a person on the team shipped this update.

The brand name "suuudokuuu" is always written in Latin script, lowercase, unchanged — even inside otherwise non-Latin text.

Sudoku solving-technique names (for example "naked pair", "X-Wing", "swordfish") should use the term conventionally used for that technique in each target language, never a literal word-for-word translation.

Match the register speakers expect for each locale: Ukrainian uses the informal "ти" form, German uses "du", Indonesian uses "kamu", French uses "vous", Portuguese uses "você", Spanish uses "tú". For every other locale, use the natural informal, friendly register a mobile game would use.

For every locale, write native-quality, idiomatic copy — never a literal translation from English. Produce two variants per locale:
- "appStore": Apple App Store "What's New" release notes, aiming for 600 characters or fewer.
- "play": Google Play changelog, a hard limit of 490 characters, written as 4 to 6 short lines.

Respond with JSON only, matching the provided schema exactly.`;

function runGit(args) {
    return execFileSync('git', args, { cwd: repositoryRootDirectory, encoding: 'utf8' }).trim();
}

function getLatestTag() {
    return runGit(['describe', '--tags', '--abbrev=0']);
}

function getHeadCommit() {
    return runGit(['rev-parse', 'HEAD']);
}

function getTagCommit(tag) {
    return runGit(['rev-list', '-n1', tag]);
}

function readAppVersion() {
    const appPackageJson = JSON.parse(readFileSync(join(appDirectory, 'package.json'), 'utf8'));

    return releaseNotesVersionSchema.parse(appPackageJson.version);
}

function getPreviousTag(latestTag) {
    const sortedTags = runGit(['tag', '--list', 'v*', '--sort=-v:refname'])
        .split('\n')
        .filter(tag => tag.length > 0);
    const latestTagIndex = sortedTags.indexOf(latestTag);
    const hasPreviousTag = latestTagIndex >= 0 && latestTagIndex + 1 < sortedTags.length;

    return hasPreviousTag ? sortedTags[latestTagIndex + 1] : undefined;
}

function getCommitSubjects(baseRef, headRef) {
    const range = baseRef === undefined ? headRef : `${baseRef}..${headRef}`;
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

function getCodepointLength(text) {
    return [...text].length;
}

function trimToCodepointLineBoundary(text, codepointLimit) {
    const codepoints = [...text];

    if (codepoints.length <= codepointLimit) {
        return text;
    }

    const truncatedText = codepoints.slice(0, codepointLimit).join('');
    const lastLineBreakIndex = truncatedText.lastIndexOf('\n');
    const boundaryIndex = lastLineBreakIndex > 0 ? lastLineBreakIndex : truncatedText.length;

    return truncatedText.slice(0, boundaryIndex).trimEnd();
}

function buildReleaseNotesSchema() {
    const localeReleaseNotesSchema = {
        type: 'object',
        properties: {
            appStore: { type: 'string' },
            play: { type: 'string' },
        },
        required: ['appStore', 'play'],
        additionalProperties: false,
    };
    const localeProperties = Object.fromEntries(
        appLocales.map(appLocale => [appLocale, localeReleaseNotesSchema])
    );

    return {
        type: 'object',
        properties: {
            locales: {
                type: 'object',
                properties: localeProperties,
                required: appLocales,
                additionalProperties: false,
            },
        },
        required: ['locales'],
        additionalProperties: false,
    };
}

function buildReleaseNotesUserPrompt(bullets, version) {
    const commitList =
        bullets.length === 0
            ? '(No user-facing changes were recorded for this release; write stability and quality improvement copy.)'
            : bullets.map(bullet => `- ${bullet}`).join('\n');

    return [
        `suuudokuuu version ${version} is releasing with these user-facing changes:`,
        commitList,
        '',
        'Write release notes for every one of the 13 app locales: ar, bn, de, en, es, fr, hi, id, pt, sv, uk, ur, zh.',
        'For each locale write two variants:',
        '- "appStore": Apple App Store "What\'s New" release notes, aiming for 600 characters or fewer.',
        '- "play": Google Play changelog, a hard limit of 490 characters, written as 4 to 6 short lines.',
        'Write native-quality, idiomatic copy for each locale — never a literal translation from English.',
        'Respond with JSON only, matching the provided schema exactly.',
    ].join('\n');
}

function buildShortenRetryPrompt(originalUserPrompt, violations) {
    const violationLines = violations.map(
        ({ appLocale, field, limit, length }) =>
            `- locale "${appLocale}", field "${field}": ${length} characters, must be ${limit} characters or fewer`
    );

    return [
        originalUserPrompt,
        '',
        'Your previous response exceeded the required limits on these fields:',
        ...violationLines,
        '',
        'Return the complete JSON again for all 13 locales, matching the schema exactly, with only the fields listed above shortened to fit their limits. Keep every other field as strong as before.',
    ].join('\n');
}

function buildLocaleReleaseNotesResponseSchema() {
    const localeReleaseNotesSchema = z.object({
        appStore: z.string(),
        play: z.string(),
    });

    return z.object({
        locales: z.object(Object.fromEntries(appLocales.map(appLocale => [appLocale, localeReleaseNotesSchema]))),
    });
}

const localeReleaseNotesResponseSchema = buildLocaleReleaseNotesResponseSchema();

const releaseNotesVersionSchema = z.string().min(1);

const releaseNotesStateSchema = z.object({
    baseRef: z.string(),
    generatedAtCommit: z.string(),
    generatedFor: z.string(),
});

function getReleaseNotesStatePath(metadataDirectory) {
    return join(metadataDirectory, 'release-notes-state.json');
}

function writeReleaseNotesState(metadataDirectory, state) {
    const stateFilePath = getReleaseNotesStatePath(metadataDirectory);

    writeFileSync(stateFilePath, `${JSON.stringify(state, undefined, 4)}\n`, 'utf8');
    console.log(`  ${stateFilePath}`);
}

function checkReleaseNotesFreshness(metadataDirectory) {
    const stateFilePath = getReleaseNotesStatePath(metadataDirectory);

    if (!existsSync(stateFilePath)) {
        console.log(
            '::warning::Store release notes have never been generated in this branch. Run "yarn workspace @suuudokuuu/app store:notes" locally and commit the result.'
        );

        return;
    }

    const state = releaseNotesStateSchema.parse(JSON.parse(readFileSync(stateFilePath, 'utf8')));

    let commitSubjectsSinceGeneration = [];
    try {
        commitSubjectsSinceGeneration = getCommitSubjects(state.generatedAtCommit, 'HEAD');
    } catch {
        console.log(
            `::warning::Store release notes state points at unknown commit ${state.generatedAtCommit}; regenerate with "yarn workspace @suuudokuuu/app store:notes".`
        );

        return;
    }

    const unreflectedBullets = getReleaseNoteBullets(commitSubjectsSinceGeneration);

    if (unreflectedBullets.length === 0) {
        console.log(`Store release notes are fresh (generated for ${state.generatedFor} at ${state.generatedAtCommit}).`);

        return;
    }

    console.log(
        `::warning::Store release notes may be stale: ${unreflectedBullets.length} user-facing commits landed after generation for ${state.generatedFor}.`
    );

    for (const unreflectedBullet of unreflectedBullets) {
        console.log(`  - ${unreflectedBullet}`);
    }
}

async function requestReleaseNotesCompletion(client, schema, userPrompt) {
    const stream = client.beta.messages.stream({
        model: storeNotesModel,
        max_tokens: releaseNotesMaxTokens,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: releaseNotesSystemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        output_config: { format: { type: 'json_schema', schema } },
    });

    return stream.finalMessage();
}

function parseReleaseNotesMessage(message) {
    const responseText = message.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
    const parsedResponse = localeReleaseNotesResponseSchema.parse(JSON.parse(responseText));

    return parsedResponse.locales;
}

function findLengthViolations(localeNotes) {
    const violations = [];

    for (const appLocale of appLocales) {
        const notes = localeNotes[appLocale];
        const appStoreLength = getCodepointLength(notes.appStore);
        const playLength = getCodepointLength(notes.play);

        if (appStoreLength > appStoreNotesCodepointLimit) {
            violations.push({
                appLocale,
                field: 'appStore',
                limit: appStoreNotesCodepointLimit,
                length: appStoreLength,
            });
        }

        if (playLength > playChangelogCodepointLimit) {
            violations.push({ appLocale, field: 'play', limit: playChangelogCodepointLimit, length: playLength });
        }
    }

    return violations;
}

function truncateLocaleNotesToLimits(localeNotes) {
    return Object.fromEntries(
        appLocales.map(appLocale => {
            const notes = localeNotes[appLocale];
            const truncatedNotes = {
                appStore: trimToCodepointLineBoundary(notes.appStore, appStoreNotesCodepointLimit),
                play: trimToCodepointLineBoundary(notes.play, playChangelogCodepointLimit),
            };

            return [appLocale, truncatedNotes];
        })
    );
}

async function generateLocalizedReleaseNotesWithClaude(bullets, version) {
    const client = new Anthropic();
    const schema = buildReleaseNotesSchema();
    const userPrompt = buildReleaseNotesUserPrompt(bullets, version);
    const message = await requestReleaseNotesCompletion(client, schema, userPrompt);

    if (message.stop_reason === 'refusal') {
        throw new Error('Claude refused to generate localized store release notes.');
    }

    const localeNotes = parseReleaseNotesMessage(message);
    const violations = findLengthViolations(localeNotes);

    if (violations.length === 0) {
        return localeNotes;
    }

    const retryPrompt = buildShortenRetryPrompt(userPrompt, violations);
    const retryMessage = await requestReleaseNotesCompletion(client, schema, retryPrompt);

    if (retryMessage.stop_reason === 'refusal') {
        return truncateLocaleNotesToLimits(localeNotes);
    }

    const retriedLocaleNotes = parseReleaseNotesMessage(retryMessage);
    const retryViolations = findLengthViolations(retriedLocaleNotes);

    return retryViolations.length === 0 ? retriedLocaleNotes : truncateLocaleNotesToLimits(retriedLocaleNotes);
}

function writeLocalizedReleaseNotesFiles(localeNotes, metadataDirectory) {
    const writtenFilePaths = [];

    for (const { appLocale, iosLocale, androidLocale } of localeStoreFolders) {
        const notes = localeNotes[appLocale];

        if (iosLocale !== undefined) {
            const iosReleaseNotesPath = join(metadataDirectory, 'ios', iosLocale, 'release_notes.txt');
            writeReleaseNotesFile(iosReleaseNotesPath, notes.appStore);
            writtenFilePaths.push(iosReleaseNotesPath);
        }

        const androidChangelogPath = join(metadataDirectory, 'android', androidLocale, 'changelogs', 'default.txt');
        writeReleaseNotesFile(androidChangelogPath, notes.play);
        writtenFilePaths.push(androidChangelogPath);
    }

    return writtenFilePaths;
}

async function generateLocalizedStoreReleaseNotes(bullets, version, metadataDirectory) {
    const localeNotes = await generateLocalizedReleaseNotesWithClaude(bullets, version);
    const writtenFilePaths = writeLocalizedReleaseNotesFiles(localeNotes, metadataDirectory);

    console.log(`Generated LLM-written localized store release notes for version ${version} using ${storeNotesModel}.`);

    for (const writtenFilePath of writtenFilePaths) {
        console.log(`  ${writtenFilePath}`);
    }
}

function generateFallbackEnglishStoreReleaseNotes(bullets, baseRef, headRef, metadataDirectory) {
    const releaseNotes = renderReleaseNotes(bullets);
    const iosReleaseNotesPath = join(metadataDirectory, 'ios', 'en-US', 'release_notes.txt');
    const androidChangelogPath = join(metadataDirectory, 'android', 'en-US', 'changelogs', 'default.txt');

    writeReleaseNotesFile(iosReleaseNotesPath, trimToCharacterLimit(releaseNotes, iosReleaseNotesCharacterLimit));
    writeReleaseNotesFile(androidChangelogPath, trimToLineBoundary(releaseNotes, androidChangelogCharacterLimit));

    console.log(`Generated store release notes from ${baseRef ?? '(initial commit)'}..${headRef}`);
    console.log(`  ${iosReleaseNotesPath}`);
    console.log(`  ${androidChangelogPath}`);

    reportStaleLocaleReleaseNotes(metadataDirectory);
}

async function main() {
    const metadataDirectory = join(appDirectory, 'fastlane', 'metadata');

    if (process.argv.includes('--check')) {
        checkReleaseNotesFreshness(metadataDirectory);

        return;
    }

    const latestTag = getLatestTag();
    const headCommit = getHeadCommit();
    const isPendingRelease = headCommit !== getTagCommit(latestTag);
    const previousTag = getPreviousTag(latestTag);
    const baseRef = isPendingRelease ? latestTag : previousTag;
    const headRef = isPendingRelease ? 'HEAD' : latestTag;
    const commitSubjects = getCommitSubjects(baseRef, headRef);
    const bullets = getReleaseNoteBullets(commitSubjects);
    const version = isPendingRelease ? `${readAppVersion()} (upcoming release)` : latestTag.replace(/^v/, '');

    let hasGeneratedNotes = false;

    if (isNotEmptyString(process.env.ANTHROPIC_API_KEY)) {
        try {
            await generateLocalizedStoreReleaseNotes(bullets, version, metadataDirectory);
            hasGeneratedNotes = true;
        } catch (error) {
            console.warn(`Falling back to plain English store release notes: ${getErrorMessage(error)}`);
        }
    }

    if (!hasGeneratedNotes) {
        generateFallbackEnglishStoreReleaseNotes(bullets, baseRef, headRef, metadataDirectory);
    }

    writeReleaseNotesState(metadataDirectory, {
        baseRef: baseRef ?? '(initial commit)',
        generatedAtCommit: headCommit,
        generatedFor: version,
    });
}

main().catch(error => {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
});
