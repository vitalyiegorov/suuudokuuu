import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const sourceRoot = join(__dirname, '..');
const specFileName = 'wide-layout-gate.spec.ts';
const gateSymbolNames = ['useAppLayout', 'appLayoutScreenIsWide'];
const boardScreenDirectories = ['game-screen', 'replay-screen', 'challenge-race-hud', 'challenge-record-hud'];

const collectSourceFiles = (directory: string): string[] =>
    readdirSync(directory).flatMap(entry => {
        const entryPath = join(directory, entry);

        if (statSync(entryPath).isDirectory()) {
            return collectSourceFiles(entryPath);
        }

        return entryPath.endsWith('.ts') || entryPath.endsWith('.tsx') ? [entryPath] : [];
    });

const fileUsesWideLayoutGate = (filePath: string): boolean => {
    const fileContent = readFileSync(filePath, 'utf8');

    return gateSymbolNames.some(gateSymbolName => fileContent.includes(gateSymbolName));
};

describe('wide layout gate', () => {
    it('stays scoped to the board screens so every other screen keeps one column', () => {
        const consumers = collectSourceFiles(sourceRoot)
            .filter(filePath => !filePath.endsWith(specFileName))
            .filter(fileUsesWideLayoutGate)
            .map(filePath => filePath.slice(sourceRoot.length + 1));

        expect(consumers).not.toHaveLength(0);
        consumers.forEach(consumer => {
            expect(boardScreenDirectories.some(directory => consumer.includes(directory))).toBe(true);
        });
    });

    it('does not reintroduce an absolute-height clamp on the wide layout gate', () => {
        const consumers = collectSourceFiles(sourceRoot)
            .filter(filePath => !filePath.endsWith(specFileName))
            .filter(fileUsesWideLayoutGate);

        consumers.forEach(filePath => {
            expect(readFileSync(filePath, 'utf8')).not.toMatch(/\.and\.height\(/u);
        });
    });
});
