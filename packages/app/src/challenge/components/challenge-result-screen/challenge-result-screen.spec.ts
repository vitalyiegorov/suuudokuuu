import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ChallengeResultScreen', () => {
    const source = readFileSync(join(__dirname, 'challenge-result-screen.tsx'), 'utf8');

    it('keeps the accepted-rival comparison of both runs', () => {
        expect(source).toContain('label={t`Your run`}');
        expect(source).toContain("label={t`Rival's run`}");
        expect(source).toContain('<ChallengeResultMarginCard');
        expect(source).toContain('<ChallengeResultRivalTimeCard');
    });

    it('renders both runs through the shared run summary block', () => {
        expect(source).toContain('summary={playerSummary}');
        expect(source).toContain('summary={rivalSummary}');
        expect(source).not.toContain('ChallengeIntegrityBadge');
    });

    it('derives the rival summary from a single decode of the challenge state', () => {
        expect(source).toContain('getChallengeRivalRunSummary(challengeState, challengeTime)');
        expect(source).not.toContain('getChallengeTechniqueEventsFromState');
    });
});
