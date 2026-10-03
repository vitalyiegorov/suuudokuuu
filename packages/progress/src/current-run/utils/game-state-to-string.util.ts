import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, defaultSudokuConfig } from '@suuudokuuu/generator';
import { isNotNull, isNotUndefined } from 'effect/Predicate';
import * as Result from 'effect/Result';

import { getTimelineCellTechniques } from './get-timeline-cell-techniques.util';

import type { CurrentRunType } from '../type/current-run.type';
import type { TimelineEventType } from '../type/timeline-event.type';

const RatingWireScale = 10;
const MillisecondsPerSecond = 1000;

const serializer = new GameStateSerializer();

const shareableEventKinds: TimelineEventKindEnum[] = [
    TimelineEventKindEnum.Cell,
    TimelineEventKindEnum.Mistake,
    TimelineEventKindEnum.AutoCandidates,
    TimelineEventKindEnum.Away,
    TimelineEventKindEnum.Return
];

const countEventsOfKind = (events: readonly TimelineEventType[], kind: TimelineEventKindEnum): number =>
    events.filter(event => event.kind === kind).length;

const toShareableTimelineEvents = (events: readonly TimelineEventType[]): TimelineEventType[] => {
    const shareableEvents: TimelineEventType[] = [];
    let carriedSeconds = 0;

    for (const event of events) {
        if (shareableEventKinds.includes(event.kind)) {
            shareableEvents.push({ ...event, ts: event.ts + carriedSeconds });
            carriedSeconds = 0;
        } else {
            carriedSeconds += event.ts;
        }
    }

    const lastShareableEvent = shareableEvents.at(-1);
    if (carriedSeconds > 0 && isNotUndefined(lastShareableEvent)) {
        shareableEvents[shareableEvents.length - 1] = { ...lastShareableEvent, ts: lastShareableEvent.ts + carriedSeconds };
    }

    return shareableEvents;
};

const getIndexedCandidates = (candidates: CurrentRunType['candidates']): Record<number, number[]> => {
    const indexedCandidates: Record<number, number[]> = {};

    for (const [cellKey, values] of Object.entries(candidates)) {
        const [y, x] = cellKey.split('-').map(part => parseInt(part, 10));

        indexedCandidates[y * defaultSudokuConfig.fieldSize + x] = [...values];
    }

    return indexedCandidates;
};

export const gameStateToString = (gameState: CurrentRunType, kind = SharedPayloadKindEnum.Puzzle): string => {
    const timelineEvents = toShareableTimelineEvents(gameState.timelineEvents);
    const techniques = getTimelineCellTechniques(timelineEvents);
    const encodedState = Result.try(() =>
        serializer.encodeState({
            field: gameState.sudokuString,
            timelineEvents,
            ...(techniques.some(isNotNull) && { techniques }),
            kind,
            maxMistakes: gameState.maxMistakes,
            isChallengeRun: gameState.isChallengeRun,
            score: gameState.score,
            candidates: getIndexedCandidates(gameState.candidates),
            anchorSeconds: Math.floor(gameState.wallClockStartMs / MillisecondsPerSecond),
            pencilCount: countEventsOfKind(gameState.timelineEvents, TimelineEventKindEnum.Pencil),
            screenshotCount: countEventsOfKind(gameState.timelineEvents, TimelineEventKindEnum.Screenshot),
            rating: Math.round(gameState.rating * RatingWireScale),
            isRatingCeiling: gameState.isRatingCeiling,
            difficulty: Object.values(DifficultyEnum).indexOf(gameState.difficulty)
        })
    );

    return Result.getOrElse(encodedState, () => '');
};
