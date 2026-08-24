import { getErrorMessage, isNotEmptyArray, isNotEmptyString } from '@rnw-community/shared';

import { INDEXNOW_ENDPOINT, INDEXNOW_KEY_ENVIRONMENT_VARIABLE } from '../src/indexing/constants/indexnow.constant';
import { buildIndexablePages } from '../src/indexing/utils/build-indexable-pages.util';
import { buildIndexNowKeyLocation } from '../src/indexing/utils/build-indexnow-key-location.util';
import { resolveIndexNowKey } from '../src/indexing/utils/resolve-indexnow-key.util';
import { SITE_ORIGIN } from '../src/seo/constants/site.constant';

const ACCEPTED_STATUS_CODES = [200, 202];

const host = new URL(SITE_ORIGIN).host;
const urlList = buildIndexablePages().map(({ url }) => url);
const foreignUrls = urlList.filter(url => new URL(url).host !== host);

if (isNotEmptyArray(foreignUrls)) {
    throw new Error(`Refusing to submit URLs that do not belong to ${host}: ${foreignUrls.join(', ')}`);
}

const handleSubmitError = (error: unknown): void => {
    console.error(`IndexNow submission failed: ${getErrorMessage(error)}`);
    process.exitCode = 1;
};

const submitToIndexNow = (key: string): void => {
    const keyLocation = buildIndexNowKeyLocation(key);

    fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key, keyLocation, urlList })
    })
        .then(response => {
            if (!ACCEPTED_STATUS_CODES.includes(response.status)) {
                throw new Error(
                    `IndexNow responded ${response.status} ${response.statusText}. Recheck ${keyLocation}, the host and the URL ownership before retrying.`
                );
            }

            console.log(`Submitted ${urlList.length} sitemap-derived URLs for ${host} to IndexNow (${response.status}).`);
        })
        .catch(handleSubmitError);
};

const isDryRun = process.argv.includes('--dry-run');

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
