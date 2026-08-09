import { describe, expect, it } from '@jest/globals';
import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getChallengeRivalRunSummary } from './get-challenge-rival-run-summary.util';

import type { EncodableGameStateInterface, TimelineEventInterface } from '@suuudokuuu/encoder';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const rivalTotalTime = 120;
const manyPencilMarks = 14;
const someScreenshots = 3;
const serializer = new GameStateSerializer();

const awayEvents: TimelineEventInterface[] = [
    { kind: TimelineEventKindEnum.Away, ts: 40 },
    { kind: TimelineEventKindEnum.Return, ts: 20 }
];

const encodeRivalChallenge = (overrides: Partial<EncodableGameStateInterface>): string =>
    serializer.encodeState({
        field: solvedBoard,
        timelineEvents: [],
        kind: SharedPayloadKindEnum.Challenge,
        maxMistakes: 3,
        isChallengeRun: true,
        score: 0,
        candidates: {},
        anchorSeconds: 0,
        pencilCount: 0,
        screenshotCount: 0,
        rating: 0,
        isRatingCeiling: false,
        difficulty: 0,
        ...overrides
    });

describe('getChallengeRivalRunSummary', () => {
    it('should report the pencil and screenshot counts a new challenge link carries', () => {
        expect.assertions(2);

        const summary = getChallengeRivalRunSummary(
            encodeRivalChallenge({ pencilCount: manyPencilMarks, screenshotCount: someScreenshots }),
            rivalTotalTime
        );

        expect(summary.pencilCount).toBe(manyPencilMarks);
        expect(summary.screenshotCount).toBe(someScreenshots);
    });

    it('should keep a genuine zero pencil count instead of reporting it as unknown', () => {
        expect.assertions(1);

        expect(getChallengeRivalRunSummary(encodeRivalChallenge({ pencilCount: 0 }), rivalTotalTime).pencilCount).toBe(0);
    });

    it('should report unknown counts for a challenge link without the aggregate trailer', () => {
        expect.assertions(2);

        const summary = getChallengeRivalRunSummary(encodeRivalChallenge({ pencilCount: null, screenshotCount: null }), rivalTotalTime);

        expect(summary.pencilCount).toBeNull();
        expect(summary.screenshotCount).toBeNull();
    });

    it('should derive exits and away seconds from the shared timeline', () => {
        expect.assertions(2);

        const summary = getChallengeRivalRunSummary(encodeRivalChallenge({ timelineEvents: awayEvents }), rivalTotalTime);

        expect(summary.exitCount).toBe(1);
        expect(summary.awaySeconds).toBe(20);
    });

    it('should report no exits for an uninterrupted rival run', () => {
        expect.assertions(1);

        expect(getChallengeRivalRunSummary(encodeRivalChallenge({}), rivalTotalTime).exitCount).toBe(0);
    });

    it('should fall back to an empty summary for a corrupt challenge state', () => {
        expect.assertions(3);

        const summary = getChallengeRivalRunSummary('not-a-challenge-payload', rivalTotalTime);

        expect(summary.exitCount).toBe(0);
        expect(summary.pencilCount).toBeNull();
        expect(summary.techniqueEvents).toStrictEqual([]);
    });
});
