import { expect, test } from '@playwright/test';

import { fetchPageHtml } from '../../src/utils/fetch-page-html.util';
import { readJsonLdSchema } from '../../src/utils/json-ld.util';

const faqPagePath = '/how-to-play';

test('renders every FAQ entry as a disclosure whose questions are the published FAQPage schema', async ({ page }) => {
    await page.goto(faqPagePath);

    const entries = page.locator('details');

    await expect(entries.first()).toBeVisible();

    const questions = await entries.locator('summary').allTextContents();
    const schema = readJsonLdSchema(await page.content(), 'FAQPage');

    expect(questions.length).toBeGreaterThan(0);
    expect(schema).toMatchObject({
        mainEntity: questions.map(question => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer' } }))
    });

    const firstAnswer = entries.first().locator('p');

    await expect(firstAnswer).toBeHidden();

    await entries.first().locator('summary').click();

    await expect(firstAnswer).toBeVisible();
    expect(await firstAnswer.textContent()).not.toBe('');
});

const ratedFaqPages = [
    { path: '/sudoku/hell', question: 'Is Hell harder than Nightmare?' },
    { path: '/sudoku/nightmare', question: 'How hard is Nightmare sudoku?' },
    { path: '/sudoku/newbie', question: 'How hard is Newbie sudoku?' },
    { path: '/sudoku/infinity', question: 'Is Infinity harder than Hell?' },
    { path: '/guides/sudoku-difficulty-rating', question: 'Is a sudoku with fewer clues always harder?' },
    { path: '/guides/sudoku-clues-vs-difficulty', question: 'Does a sudoku with fewer clues mean it is harder?' }
];

for (const { path, question } of ratedFaqPages) {
    test(`retains numeric SE measurements in the published FAQ answers on ${path}`, async ({ request }) => {
        const schema = readJsonLdSchema(await fetchPageHtml(request, path), 'FAQPage');

        expect(schema).toMatchObject({
            mainEntity: expect.arrayContaining([
                expect.objectContaining({
                    name: question,
                    acceptedAnswer: expect.objectContaining({ text: expect.stringMatching(/\bSE\s+\d+(?:\.\d+)?/u) })
                })
            ])
        });
        expect(JSON.stringify(schema)).not.toMatch(/\bSE\s*(?:[.,;:—–]|(?:and|across|against|to|with|for)\b)/u);
    });
}
