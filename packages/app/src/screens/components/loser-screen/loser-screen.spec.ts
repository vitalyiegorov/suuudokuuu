import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('LoserScreen', () => {
    const readSourceFiles = (directory: string): string =>
        readdirSync(directory, { withFileTypes: true })
            .flatMap(directoryEntry => {
                const entryPath = join(directory, directoryEntry.name);

                if (directoryEntry.isDirectory()) {
                    return readSourceFiles(entryPath);
                }

                if (!directoryEntry.name.endsWith('.tsx')) {
                    return '';
                }

                return readFileSync(entryPath, 'utf8');
            })
            .join('\n');

    const loserScreenSource = readSourceFiles(__dirname);

    it('uses the shared result surface instead of legacy donation/header components', () => {
        expect(loserScreenSource).toContain('LoserScreenResultHero');
        expect(loserScreenSource).toContain('GameResultPage');
        expect(loserScreenSource).toContain('CompletedGameResultDetails');
        expect(loserScreenSource).toContain('GameResultHero');
        expect(loserScreenSource).toContain('LoserScreenActions');
        expect(loserScreenSource).toContain('mistakesTestID={LoserScreenSelectors.MistakesValue}');
        expect(loserScreenSource).toContain('timeTestID={LoserScreenSelectors.TimeValue}');
        expect(loserScreenSource).toContain('ukraineSupportTestID={LoserScreenSelectors.UkraineCta}');
        expect(loserScreenSource).not.toContain('LoserScreenUkraineCard');
        expect(loserScreenSource).not.toContain('Donation');
        expect(loserScreenSource).not.toContain('Header');
    });

    it('shows the loss outcome, progress, and primary actions', () => {
        expect(loserScreenSource).toContain('Better luck next time!');
        expect(loserScreenSource).toContain('Incomplete');
        expect(loserScreenSource).toContain('You got to');
        expect(loserScreenSource).toContain('Too many mistakes');
        expect(loserScreenSource).toContain('Play again');
        expect(loserScreenSource).toContain('Home');
    });
});
