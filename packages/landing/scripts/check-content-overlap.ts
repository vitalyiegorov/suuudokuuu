import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { isDefined, isNumber, isRecord } from '@rnw-community/shared';

import { readCanonical } from './utils/read-canonical.util';
import { readMainText } from './utils/read-main-text.util';

const EXPORT_DIRECTORY = join(import.meta.dirname, '..', 'out');
const BASELINE_FILE = join(import.meta.dirname, 'content-overlap.baseline.json');
const THRESHOLD = 0.3;
const TOLERANCE = 0.02;
const SHINGLE_SIZE = 5;

const readShingles = (main: string): Set<string> => {
    const tokens = main.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

    return new Set(
        tokens
            .slice(0, Math.max(0, tokens.length - SHINGLE_SIZE + 1))
            .map((_, index) => tokens.slice(index, index + SHINGLE_SIZE).join(' '))
    );
};

const similarity = (left: Set<string>, right: Set<string>): number => {
    const smaller = left.size <= right.size ? left : right;
    const larger = left.size <= right.size ? right : left;
    let shared = 0;
    for (const shingle of smaller) {
        if (larger.has(shingle)) {
            shared += 1;
        }
    }
    const union = left.size + right.size - shared;

    return union === 0 ? 0 : shared / union;
};

const pages = readdirSync(EXPORT_DIRECTORY, { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.html'))
    .flatMap(file => {
        const markup = readFileSync(join(EXPORT_DIRECTORY, file), 'utf8');
        const canonical = readCanonical(markup);
        if (!isDefined(canonical)) {
            return [];
        }
        const path = new URL(canonical).pathname;
        const lang = /<html\b[^>]*\slang="([^"]+)"/u.exec(markup)?.[1];
        const main = readMainText(markup);
        if (!isDefined(lang) || !isDefined(main)) {
            throw new Error(`${file} has a canonical but is missing <html lang> or <main>`);
        }

        return [{ path, lang, shingles: readShingles(main) }];
    })
    .sort((left, right) => left.path.localeCompare(right.path));

if (pages.length === 0) {
    throw new Error('No canonical pages found in the landing export; build it first');
}

const comparisons: { readonly key: string; readonly score: number }[] = [];
for (const [index, left] of pages.entries()) {
    for (const right of pages.slice(index + 1)) {
        if (left.lang === right.lang) {
            comparisons.push({
                key: `${left.lang} ${left.path} ${right.path}`.replaceAll(/\d{4}-\d{2}(?:-\d{2})?/gu, ':date'),
                score: similarity(left.shingles, right.shingles)
            });
        }
    }
}

const pairs = comparisons.filter(({ score }) => score >= THRESHOLD);
const current = Object.fromEntries(
    pairs
        .toSorted((left, right) => left.key.localeCompare(right.key) || left.score - right.score)
        .map(({ key, score }) => [key, Math.round(score * 1000) / 1000])
);
if (process.argv.includes('--write-baseline')) {
    writeFileSync(BASELINE_FILE, `${JSON.stringify(current, null, 4)}\n`);
}
const baseline: unknown = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
if (!isRecord(baseline) || !Object.values(baseline).every(isNumber)) {
    throw new Error('Content overlap baseline must be an object of numeric scores');
}
const problems = pairs.flatMap(({ key, score }) => {
    const previous = baseline[key];

    return !isNumber(previous) || score > previous + TOLERANCE
        ? [
              `${key}: ${score.toFixed(3)} overlap (${isNumber(previous) ? `baseline ${previous.toFixed(3)} + ${TOLERANCE}` : 'missing from baseline'})`
          ]
        : [];
});
const resolved = Object.keys(baseline).filter(key => !Object.hasOwn(current, key));
const highest = comparisons
    .toSorted((left, right) => right.score - left.score)
    .slice(0, 5)
    .map(({ key, score }) => `${key}: ${score.toFixed(3)}`);

process.stdout.write(
    `${pages.length} pages checked; ${pairs.length} pairs >= ${THRESHOLD}; top 5: ${highest.join('; ')}${resolved.length > 0 ? `; ${resolved.length} resolved — rerun with --write-baseline: ${resolved.join('; ')}` : ''}\n`
);
if (problems.length > 0) {
    throw new Error(`Content overlap regressions:\n${problems.join('\n')}`);
}
