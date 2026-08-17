import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReplayShareAction', () => {
    const source = readFileSync(join(__dirname, 'replay-share-action.tsx'), 'utf8');

    it('derives the contextual action from the decoded historical run', () => {
        expect(source).toContain('isChallengeRun');
        expect(source).toContain('useShareChallenge(gameState)');
        expect(source).toContain('useShareGameState(SharedPayloadKindEnum.Puzzle, gameState)');
        expect(source).toContain('Challenge`');
        expect(source).toContain('Share puzzle`');
    });

    it('renders as a compact icon-only button', () => {
        expect(source).toContain('<AppIconButton');
        expect(source).not.toContain('text=');
    });

    it('never reads the live Redux game', () => {
        expect(source).not.toContain('useAppSelector');
        expect(source).not.toContain('gameSelector');
    });
});
