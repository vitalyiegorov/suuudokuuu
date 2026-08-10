import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isNotEmptyArray } from '@rnw-community/shared';

import { getChallengeRecordingSummary } from '../../challenge/utils/get-challenge-recording-summary.util';

import { getReplayTimeline } from './get-replay-timeline.util';

import type { GameState } from '../../game/store/game.state';
import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { ReplayPaceStatsInterface } from '../interfaces/replay-pace-stats.interface';

const getPlacementCumulativeTimes = (gameState: GameState): number[] => {
    const { events } = getReplayTimeline(gameState);
    const placementCumulativeTimes: number[] = [];
    let cumulativeTime = 0;

    for (const event of events) {
        cumulativeTime += event.ts;

        if (event.kind === TimelineEventKindEnum.Cell) {
            placementCumulativeTimes.push(cumulativeTime);
        }
    }

    return placementCumulativeTimes;
};

const getLongestPauseSeconds = (placementCumulativeTimes: readonly number[]): number => {
    let longestPauseSeconds = 0;

    for (let index = 1; index < placementCumulativeTimes.length; index += 1) {
        const pauseSeconds = placementCumulativeTimes[index] - placementCumulativeTimes[index - 1];

        if (pauseSeconds > longestPauseSeconds) {
            longestPauseSeconds = pauseSeconds;
        }
    }

    return longestPauseSeconds;
};

export const getReplayPaceStats = (gameState: GameState, completedGame: CompletedGameInterface): ReplayPaceStatsInterface => {
    const { events } = getReplayTimeline(gameState);
    const placementCumulativeTimes = getPlacementCumulativeTimes(gameState);
    const { awaySeconds, pencilCount } = getChallengeRecordingSummary(events, completedGame.elapsedTime);
    const autoCandidatesUsed = events.some(event => event.kind === TimelineEventKindEnum.AutoCandidates);
    const averageSecondsPerPlacement = isNotEmptyArray(placementCumulativeTimes)
        ? completedGame.elapsedTime / placementCumulativeTimes.length
        : 0;

    return {
        totalTimeSeconds: completedGame.elapsedTime,
        averageSecondsPerPlacement,
        longestPauseSeconds: getLongestPauseSeconds(placementCumulativeTimes),
        awaySeconds,
        pencilCount: pencilCount ?? 0,
        autoCandidatesUsed,
        mistakesCount: completedGame.mistakes
    };
};
