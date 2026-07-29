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

    it('keeps an integrity badge composed into every rival comparison tape', () => {
        expect(source).toContain('<ChallengeIntegrityBadge ranges={playerAwayRanges} />');
        expect(source).toContain('<ChallengeIntegrityBadge ranges={rivalAwayRanges} />');
    });

    it('labels the technique breakdown as the rival playbook', () => {
        expect(source).toContain("label={t`Rival's playbook`}");
    });
});
