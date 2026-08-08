import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReplayShareAction', () => {
    const source = readFileSync(join(__dirname, 'replay-share-action.tsx'), 'utf8');

    it('derives the contextual action from the decoded historical run', () => {
        expect(source).toContain('gameState.isChallengeRun');
        expect(source).toContain('<ChallengeShareButton gameState={gameState}');
        expect(source).toContain('<PuzzleShareButton gameState={gameState}');
        expect(source).toContain('Challenge`');
        expect(source).toContain('Share puzzle`');
    });

    it('never reads the live Redux game', () => {
        expect(source).not.toContain('useAppSelector');
        expect(source).not.toContain('gameSelector');
    });
});
