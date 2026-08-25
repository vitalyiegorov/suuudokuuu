import { expect, test } from '@playwright/test';

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
