import { getErrorMessage, isNotEmptyArray, isNotEmptyString } from '@rnw-community/shared';

import { buildDailyPuzzlePageMetadata } from '../src/app/(en)/daily-sudoku/[date]/metadata';
import { buildDailyArchivePageMetadata } from '../src/app/(en)/daily-sudoku/archive/[month]/metadata';
import { dailySudokuPageMetadata } from '../src/app/(en)/daily-sudoku/metadata';
import { DAILY_BUILD_DATE, DAILY_MONTH_KEY_LENGTH } from '../src/daily/constants/daily-archive.constant';
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY_ENVIRONMENT_VARIABLE } from '../src/indexing/constants/indexnow.constant';
import { buildIndexablePages } from '../src/indexing/utils/build-indexable-pages.util';
import { buildIndexNowKeyFileName } from '../src/indexing/utils/build-indexnow-key-file-name.util';
import { resolveIndexNowKey } from '../src/indexing/utils/resolve-indexnow-key.util';
import { SITE_ORIGIN } from '../src/seo/constants/site.constant';

const HTTP_OK = 200;
const HTTP_ACCEPTED = 202;
const ACCEPTED_STATUS_CODES = [HTTP_OK, HTTP_ACCEPTED];

const DAILY_CHANGED_PATHS = new Set([
    dailySudokuPageMetadata.path,
    buildDailyPuzzlePageMetadata(DAILY_BUILD_DATE).path,
    buildDailyArchivePageMetadata(DAILY_BUILD_DATE.slice(0, DAILY_MONTH_KEY_LENGTH)).path
]);

const isDryRun = process.argv.includes('--dry-run');
const isDailyRun = process.argv.includes('--daily');
const { host } = new URL(SITE_ORIGIN);
const indexablePages = buildIndexablePages();
const submittedPages = isDailyRun
    ? indexablePages.filter(({ pageMetadata }) => DAILY_CHANGED_PATHS.has(pageMetadata.path))
    : indexablePages;
const urlList = submittedPages.map(({ url }) => url);
const foreignUrls = urlList.filter(url => new URL(url).host !== host);

if (isNotEmptyArray(foreignUrls)) {
    throw new Error(`Refusing to submit URLs that do not belong to ${host}: ${foreignUrls.join(', ')}`);
}

const handleSubmitError = (error: unknown): void => {
    console.error(`IndexNow submission failed: ${getErrorMessage(error)}`);
    process.exitCode = 1;
};

const assertKeyFileServed = async (keyLocation: string, key: string): Promise<void> => {
    const response = await fetch(keyLocation, { cache: 'no-store' });
    const body = await response.text();

    if (response.status !== HTTP_OK) {
        throw new Error(
            `${keyLocation} answered ${response.status}, so IndexNow cannot verify the key. Check that the deployed export contains it.`
        );
    }

    if (body.trim() !== key) {
        throw new Error(
            `${keyLocation} is served as ${response.headers.get('content-type') ?? 'unknown content'} but its ${body.length} characters are not the key.`
        );
    }
};

const submitToIndexNow = (key: string): void => {
    const keyLocation = `${SITE_ORIGIN}/${buildIndexNowKeyFileName(key)}`;

    assertKeyFileServed(keyLocation, key)
        .then(() =>
            fetch(INDEXNOW_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ host, key, keyLocation, urlList })
            })
        )
        .then(response => {
            if (!ACCEPTED_STATUS_CODES.includes(response.status)) {
                throw new Error(
                    `IndexNow responded ${response.status} ${response.statusText}. Recheck ${keyLocation}, the host and the URL ownership before retrying.`
                );
            }

            console.log(`Submitted ${urlList.length} sitemap-derived URLs for ${host} to IndexNow (${response.status}).`);

            return undefined;
        })
        .catch(handleSubmitError);
};

if (isDryRun) {
    console.log(urlList.join('\n'));
    console.log(`${urlList.length} sitemap-derived URLs for ${host}`);
} else {
    const indexNowKey = resolveIndexNowKey();

    if (isNotEmptyString(indexNowKey)) {
        submitToIndexNow(indexNowKey);
    } else {
        console.log(
            `${INDEXNOW_KEY_ENVIRONMENT_VARIABLE} is not set, skipping IndexNow submission. This is expected for forks, contributors and preview builds; see packages/landing/docs/indexing.md.`
        );
    }
}
