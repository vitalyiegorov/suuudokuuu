import { describe, expect, it } from '@jest/globals';

import { parseReleaseMetadata } from './parse-release-metadata.util';

const ValidMetadata = {
    branch: 'main',
    builtAt: '2026-07-14T10:20:30.000Z',
    commitSha: '0123456789abcdef0123456789abcdef01234567',
    version: '1.62.5',
    workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/987654321'
};

const createReleaseBody = (metadata: unknown, releaseNotes = 'Fixed a puzzle issue.') =>
    `<!-- suuudokuuu-development-metadata ${JSON.stringify(metadata)} -->\n\n${releaseNotes}`;

describe('parseReleaseMetadata', () => {
    it('parses strict metadata and preserves trimmed plain-text release notes', () => {
        expect(parseReleaseMetadata(createReleaseBody(ValidMetadata, '  First line.\n\nSecond line.  '))).toEqual({
            metadata: ValidMetadata,
            releaseNotes: 'First line.\n\nSecond line.'
        });
    });

    it.each([
        'prefix <!-- suuudokuuu-development-metadata {} -->',
        '<!-- suuudokuuu-development-metadata invalid -->',
        '<!-- suuudokuuu-development-metadata {} -->',
        createReleaseBody({ ...ValidMetadata, extra: true }),
        createReleaseBody({ ...ValidMetadata, runNumber: 123 }),
        createReleaseBody({ ...ValidMetadata, commitSha: 'ABCDEF' }),
        createReleaseBody({ ...ValidMetadata, branch: '' }),
        createReleaseBody({ ...ValidMetadata, version: 'latest' }),
        createReleaseBody({ ...ValidMetadata, builtAt: '2026-07-14T10:20:30+02:00' }),
        createReleaseBody({ ...ValidMetadata, workflowUrl: 'https://example.com/actions/runs/123' }),
        createReleaseBody({ ...ValidMetadata, workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/0' }),
        createReleaseBody({ ...ValidMetadata, workflowUrl: 'https://github.com/vitalyiegorov/suuudokuuu/actions/runs/not-numeric' }),
        `${createReleaseBody(ValidMetadata)}\n<!-- suuudokuuu-development-metadata ${JSON.stringify(ValidMetadata)} -->`
    ])('rejects malformed or duplicate metadata markers', releaseBody => {
        expect(parseReleaseMetadata(releaseBody)).toBeNull();
    });
});
