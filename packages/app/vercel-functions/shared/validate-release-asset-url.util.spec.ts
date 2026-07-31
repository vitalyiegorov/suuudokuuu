import { describe, expect, it } from '@jest/globals';

import { DevelopmentIpaAssetName } from './beta-release.constant.js';
import { validateReleaseAssetUrl } from './validate-release-asset-url.util.js';

const TagName = 'development-123-1-1';
const ValidUrl = 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/development-123-1-1/suuudokuuu-development.ipa';

describe('validateReleaseAssetUrl', () => {
    it('accepts the exact HTTPS release asset URL', () => {
        expect(validateReleaseAssetUrl(ValidUrl, TagName, DevelopmentIpaAssetName)).toBe(true);
    });

    it.each([
        ValidUrl.replace('https:', 'http:'),
        ValidUrl.replace('github.com', 'example.com'),
        ValidUrl.replace('vitalyiegorov', 'another-owner'),
        ValidUrl.replace('suuudokuuu/releases', 'another-repo/releases'),
        ValidUrl.replace(TagName, 'development-122-1-1'),
        ValidUrl.replace(TagName, 'development-123'),
        ValidUrl.replace(DevelopmentIpaAssetName, 'other.ipa'),
        `${ValidUrl}?download=1`,
        `${ValidUrl}#asset`,
        ValidUrl.replace(TagName, `${TagName}/../development-122-1-1`),
        ValidUrl.replace(TagName, 'development-123-1-1%2F..%2Fdevelopment-122-1-1')
    ])('rejects a non-canonical release asset URL', releaseAssetUrl => {
        expect(validateReleaseAssetUrl(releaseAssetUrl, TagName, DevelopmentIpaAssetName)).toBe(false);
    });

    it('rejects traversal supplied as an expected tag or asset name', () => {
        const traversalTag = 'development-123-1-1/../development-122-1-1';
        const traversalAssetName = '../suuudokuuu-development.ipa';

        expect(
            validateReleaseAssetUrl(
                `https://github.com/vitalyiegorov/suuudokuuu/releases/download/${traversalTag}/${DevelopmentIpaAssetName}`,
                traversalTag,
                DevelopmentIpaAssetName
            )
        ).toBe(false);
        expect(
            validateReleaseAssetUrl(
                `https://github.com/vitalyiegorov/suuudokuuu/releases/download/${TagName}/${traversalAssetName}`,
                TagName,
                traversalAssetName
            )
        ).toBe(false);
    });
});
