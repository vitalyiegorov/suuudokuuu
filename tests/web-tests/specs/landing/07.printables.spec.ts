import { expect, test } from '@playwright/test';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const printableHubPath = '/printable';

const printableTierCount = 6;
const okStatus = 200;
const pdfMagicBytes = '%PDF-';
const pdfMagicByteLength = pdfMagicBytes.length;

const DownloadLinkPattern = /<a class="printable-download__cta[^"]*"[^>]*href="([^"]+\.pdf)"/gu;
const TierLinkPattern = /<h3><a href="(\/printable\/[a-z]+)">/gu;

test('the printable hub lists every booklet and publishes the tier list as structured data', async ({ request }) => {
    const html = await fetchPageHtml(request, printableHubPath);
    const tierPaths = Array.from(html.matchAll(TierLinkPattern), match => match[1]);
    const downloadPaths = Array.from(html.matchAll(DownloadLinkPattern), match => match[1]);

    expect(tierPaths).toHaveLength(printableTierCount);
    expect(downloadPaths.length).toBeGreaterThan(printableTierCount);
    expect(new Set(downloadPaths).size).toBe(downloadPaths.length);
    expect(html).toContain('Solutions included on the last pages');
    expect(readJsonLdSchema(html, 'CollectionPage')).toMatchObject({
        mainEntity: { '@type': 'ItemList', numberOfItems: printableTierCount }
    });
});

test('every booklet link downloads a real PDF document', async ({ request }) => {
    const html = await fetchPageHtml(request, printableHubPath);
    const downloadPaths = Array.from(html.matchAll(DownloadLinkPattern), match => match[1]);

    const documents = await Promise.all(
        downloadPaths.map(async path => {
            const response = await request.get(path);
            const body = await response.body();

            return `${path} ${response.status()} ${body.subarray(0, pdfMagicByteLength).toString('latin1')}`;
        })
    );

    expect(documents).toEqual(downloadPaths.map(path => `${path} ${okStatus} ${pdfMagicBytes}`));
});
