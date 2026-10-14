import { givens } from '../../fixtures';
/* oxlint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { SharedPayloadKindEnum } from '../../../src/@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../../src/@generic/enums/timeline-event-kind.enum';
import {
    type EncodableGameStateInterface,
    GameStateBinaryCodecV3
} from '../../../src/game-state-binary-codec/classes/game-state-binary-codec-v3';

const emptyCellIndexes = [2, 3, 5];

const buildChallenge = (overrides: Partial<EncodableGameStateInterface>): EncodableGameStateInterface => ({
    field: givens,
    timelineEvents: emptyCellIndexes.map((cellIndex, index) => ({
        kind: TimelineEventKindEnum.Cell,
        cellIndex,
        value: index + 1,
        ts: 4
    })),
    kind: SharedPayloadKindEnum.Challenge,
    maxMistakes: 3,
    isChallengeRun: true,
    score: 0,
    candidates: {},
    anchorSeconds: 0,
    pencilCount: 2,
    screenshotCount: 1,
    rating: 96,
    isRatingCeiling: false,
    difficulty: 6,
    ...overrides
});

describe('GameStateBinaryCodecV3 hint trailer', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip hint flags alongside techniques', () => {
        expect.assertions(2);

        const decoded = codec.decode(codec.encode(buildChallenge({ techniques: [2, 25, 0], hints: [false, true, true] })));

        expect(decoded.hints).toStrictEqual([false, true, true]);
        expect(decoded.techniques).toStrictEqual([2, 25, 0]);
    });

    it('should not write a hint trailer when no flag is true', () => {
        expect.assertions(2);

        const withoutHints = codec.encode(buildChallenge({ techniques: [2, 25, 0] }));
        const withFalseHints = codec.encode(buildChallenge({ techniques: [2, 25, 0], hints: [false, false, false] }));

        expect(withFalseHints).toBe(withoutHints);
        expect(codec.decode(withFalseHints).hints).toBeNull();
    });

    it('should report null hints when the payload has no technique trailer', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ hints: [true, true, true] })));

        expect(decoded.hints).toBeNull();
    });

    it('should leave decoded techniques identical for readers that ignore hints', () => {
        expect.assertions(1);

        const withHints = codec.decode(codec.encode(buildChallenge({ techniques: [1, 2, 3], hints: [true, false, true] })));
        const withoutHints = codec.decode(codec.encode(buildChallenge({ techniques: [1, 2, 3] })));

        expect({ ...withHints, hints: null }).toStrictEqual(withoutHints);
    });
});
