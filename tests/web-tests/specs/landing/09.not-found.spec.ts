import { expect, test } from '@playwright/test';

const unknownPagePath = '/this-page-does-not-exist';

const notFoundStatus = 404;

test('answers an unknown path with the landing 404 document and its site chrome', async ({ request }) => {
    const response = await request.get(unknownPagePath);

    expect(response.status()).toBe(notFoundStatus);

    const html = await response.text();

    expect(html).toContain('This page could not be found.');
    expect(html).toContain('<header class="site-header">');
    expect(html).toContain('<footer class="site-footer">');
    expect(html).toContain('<meta name="robots" content="noindex"/>');
});
