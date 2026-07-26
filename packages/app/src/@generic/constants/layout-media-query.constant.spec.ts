import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const sourceRoot = join(__dirname, '..', '..');
const mediaQueryName = 'WideLayoutMediaQuery';

const collectSourceFiles = (directory: string): string[] =>
    readdirSync(directory).flatMap(entry => {
        const entryPath = join(directory, entry);

        if (statSync(entryPath).isDirectory()) {
            return collectSourceFiles(entryPath);
        }

        return entryPath.endsWith('.ts') || entryPath.endsWith('.tsx') ? [entryPath] : [];
    });

describe('WideLayoutMediaQuery', () => {
    it('stays scoped to the game screen so every other screen keeps one column', () => {
        const consumers = collectSourceFiles(sourceRoot)
            .filter(filePath => !filePath.endsWith('layout-media-query.constant.ts'))
            .filter(filePath => !filePath.endsWith('layout-media-query.constant.spec.ts'))
            .filter(filePath => readFileSync(filePath, 'utf8').includes(mediaQueryName))
            .map(filePath => filePath.slice(sourceRoot.length + 1));

        expect(consumers).not.toHaveLength(0);
        consumers.forEach(consumer => {
            expect(consumer).toContain('game-screen');
        });
    });

    it('requires a short viewport so a tall wide screen keeps one column', () => {
        const source = readFileSync(join(__dirname, 'layout-media-query.constant.ts'), 'utf8');

        expect(source).toContain('.and.height(0,');
        expect(source).not.toContain('.and.height(null,');
    });
});
