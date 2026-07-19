import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('LoserScreenActions', () => {
    const source = readFileSync(join(__dirname, 'loser-screen-actions.tsx'), 'utf8');

    it('starts a fresh game using the completed settings while keeping Home as the reset route', () => {
        expect(source).toContain('GameResultActionsLayout');
        expect(source).toContain('GameContext');
        expect(source).toContain('create(difficulty, gameState.maxMistakes)');
        expect(source).toContain('<GameResultActionsLayout');
        expect(source).toContain('onPress={handlePlayAgain}');
        expect(source).toContain('href="/"');
        expect(source).toContain('onPress={handleGoHome}');
        expect(source).toContain('text={t`Play again`}');
        expect(source).toContain('text={t`Home`}');
        expect(source).toContain('LoserScreenSelectors.PlayAgainButton');
        expect(source).toContain('LoserScreenSelectors.BackHomeButton');
    });
});
