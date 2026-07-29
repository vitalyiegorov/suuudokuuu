import { describe, expect, it } from '@jest/globals';

import { isChallengeRecording } from './is-challenge-recording.util';

describe('isChallengeRecording', () => {
    it('should treat a self authored challenge run as a recording', () => {
        expect.assertions(1);

        expect(isChallengeRecording({ challengeState: '', isChallengeRun: true })).toBe(true);
    });

    it('should not treat an accepted rival challenge as a recording', () => {
        expect.assertions(1);

        expect(isChallengeRecording({ challengeState: '_KGP__challenge', isChallengeRun: true })).toBe(false);
    });

    it('should not treat a normal game as a recording', () => {
        expect.assertions(1);

        expect(isChallengeRecording({ challengeState: '', isChallengeRun: false })).toBe(false);
    });

    it('should not treat a normal game opened from a rival link as a recording', () => {
        expect.assertions(1);

        expect(isChallengeRecording({ challengeState: '_KGP__challenge', isChallengeRun: false })).toBe(false);
    });
});
