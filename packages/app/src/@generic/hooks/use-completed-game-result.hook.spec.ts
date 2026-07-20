import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('useCompletedGameResult', () => {
    it('returns a ready-or-redirect result after preserving the completed snapshot and safely parsing Sudoku', () => {
        const source = readFileSync(join(__dirname, 'use-completed-game-result.hook.ts'), 'utf8');

        expect(source).toContain('useResetGame()');
        expect(source).toContain('useTimerText(gameState.elapsedTime)');
        expect(source).toContain('Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig)');
        expect(source).toContain('difficultyText');
        expect(source).toContain('mistakesTypeText');
        expect(source).toContain("kind: 'redirect'");
        expect(source).toContain("kind: 'ready'");
    });
});
