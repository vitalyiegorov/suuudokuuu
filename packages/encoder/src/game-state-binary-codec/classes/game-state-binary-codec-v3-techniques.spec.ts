/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';

import { type EncodableGameStateInterface, GameStateBinaryCodecV3 } from './game-state-binary-codec-v3';

import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const emptyCellIndexes = [2, 3, 5, 6, 7, 8, 10, 11, 15, 16, 17, 19, 22, 23, 24, 26];

const buildCellEvents = (count: number): TimelineEventInterface[] =>
    Array.from({ length: count }, (_, index) => ({
        kind: TimelineEventKindEnum.Cell,
        cellIndex: emptyCellIndexes[index],
        value: (index % 9) + 1,
        ts: 4
    }));

const buildChallenge = (overrides: Partial<EncodableGameStateInterface>): EncodableGameStateInterface => ({
    field: givens,
    timelineEvents: buildCellEvents(3),
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

describe('GameStateBinaryCodecV3 technique trailer', () => {
    const codec = new GameStateBinaryCodecV3();

    it('should round-trip one technique per cell event', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ techniques: [2, 25, 0] })));

        expect(decoded.techniques).toStrictEqual([2, 25, 0]);
    });

    it('should report unknown techniques when the producer supplies none', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({})));

        expect(decoded.techniques).toBeNull();
    });

    it('should keep an unclassified move distinguishable from an absent stream', () => {
        expect.assertions(1);

        const decoded = codec.decode(codec.encode(buildChallenge({ techniques: [null, 3, null] })));

        expect(decoded.techniques).toStrictEqual([null, 3, null]);
    });

    it('should report unknown techniques for a trailerless payload at every bit alignment', () => {
        expect.assertions(9);

        for (let cellEventCount = 1; cellEventCount < 10; cellEventCount += 1) {
            const decoded = codec.decode(codec.encode(buildChallenge({ timelineEvents: buildCellEvents(cellEventCount) })));

            expect(decoded.techniques).toBeNull();
        }
    });

    it('should round-trip the stream at every bit alignment', () => {
        expect.assertions(9);

        for (let cellEventCount = 1; cellEventCount < 10; cellEventCount += 1) {
            const techniques = Array.from({ length: cellEventCount }, (_, index) => index + 1);
            const decoded = codec.decode(codec.encode(buildChallenge({ timelineEvents: buildCellEvents(cellEventCount), techniques })));

            expect(decoded.techniques).toStrictEqual(techniques);
        }
    });

    it('should leave every earlier field untouched when the stream is present', () => {
        expect.assertions(1);

        const withStream = codec.decode(codec.encode(buildChallenge({ techniques: [1, 2, 3] })));
        const withoutStream = codec.decode(codec.encode(buildChallenge({})));

        expect({ ...withStream, techniques: null }).toStrictEqual(withoutStream);
    });

    it('should carry the stream on handoff payloads after the metadata trailer', () => {
        expect.assertions(4);

        const handoff = buildChallenge({
            kind: SharedPayloadKindEnum.Handoff,
            score: 4820,
            candidates: { 40: [1, 4, 7] },
            techniques: [31, 0, 12]
        });
        const decoded = codec.decode(codec.encode(handoff));

        expect(decoded.techniques).toStrictEqual([31, 0, 12]);
        expect(decoded.score).toBe(4820);
        expect(decoded.rating).toBe(96);
        expect(decoded.difficulty).toBe(6);
    });

    it('should never write the stream for a puzzle payload', () => {
        expect.assertions(2);

        const puzzle = buildChallenge({ kind: SharedPayloadKindEnum.Puzzle, isChallengeRun: false });
        const withTechniques = codec.encode({ ...puzzle, techniques: [1, 2, 3] });

        expect(withTechniques).toBe(codec.encode(puzzle));
        expect(codec.decode(withTechniques).techniques).toBeNull();
    });

    it('should never write the stream for a run without cell events', () => {
        expect.assertions(2);

        const markerOnly = buildChallenge({ timelineEvents: [{ kind: TimelineEventKindEnum.AutoCandidates, ts: 2 }] });
        const withTechniques = codec.encode({ ...markerOnly, techniques: [1] });

        expect(withTechniques).toBe(codec.encode(markerOnly));
        expect(codec.decode(withTechniques).techniques).toBeNull();
    });
});
