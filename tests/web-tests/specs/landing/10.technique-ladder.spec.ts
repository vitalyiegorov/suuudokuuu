import { expect, test } from '@playwright/test';
import { TECHNIQUE_PAGE_LADDER } from '@suuudokuuu/landing/src/techniques/constants/technique-page-ladder.constant';
import { TECHNIQUE_PAGE_PATHS } from '@suuudokuuu/landing/src/techniques/constants/technique-page-path.constant';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';

for (const [techniqueIndex, technique] of TECHNIQUE_PAGE_LADDER.entries()) {
    const path = TECHNIQUE_PAGE_PATHS[technique];

    test(`links to the neighbouring technique ladder pages on ${path}`, async ({ request }) => {
        const html = await fetchPageHtml(request, path);
        const navigation = /<nav aria-label="Technique difficulty chain"[^>]*>(.*?)<\/nav>/u.exec(html)?.[1] ?? '';
        const expectedPaths = [
            ...TECHNIQUE_PAGE_LADDER.slice(Math.max(0, techniqueIndex - 1), techniqueIndex),
            ...TECHNIQUE_PAGE_LADDER.slice(techniqueIndex + 1, techniqueIndex + 2)
        ].map(neighbour => TECHNIQUE_PAGE_PATHS[neighbour]);

        expect(navigation).not.toBe('');
        expect(Array.from(navigation.matchAll(/href="([^"]+)"/gu), match => match[1])).toEqual(expectedPaths);
    });
}
