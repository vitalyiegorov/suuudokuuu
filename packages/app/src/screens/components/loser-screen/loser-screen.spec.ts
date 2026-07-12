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
        expect(loserScreenSource).toContain('LoserScreenUkraineCard');
        expect(loserScreenSource).toContain('AppMetricCard');
        expect(loserScreenSource).toContain('AppLinkButton');
        expect(loserScreenSource).not.toContain('Donation');
        expect(loserScreenSource).not.toContain('Header');
    });

    it('shows the loss outcome, progress, and primary actions', () => {
        expect(loserScreenSource).toContain('Better luck next time!');
        expect(loserScreenSource).toContain('You got to');
        expect(loserScreenSource).toContain('Too many mistakes');
        expect(loserScreenSource).toContain('Play again');
        expect(loserScreenSource).toContain('Back to home');
    });
});
