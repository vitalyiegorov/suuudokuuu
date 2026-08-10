import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined } from '@rnw-community/shared';

import { GameState } from '../store/game.state';

import { difficultyToDifficultyCode } from './difficulty-to-difficulty-code.util';
import { getIndexedCandidates } from './get-indexed-candidates.util';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { TimelineEventInterface } from '@suuudokuuu/encoder';

const RatingWireScale = 10;

const serializer = new GameStateSerializer();

const shareableEventKinds: TimelineEventKindEnum[] = [
    TimelineEventKindEnum.Cell,
    TimelineEventKindEnum.Mistake,
    TimelineEventKindEnum.AutoCandidates,
    TimelineEventKindEnum.Away,
    TimelineEventKindEnum.Return
];

const countEventsOfKind = (events: GameTimelineEventInterface[], kind: TimelineEventKindEnum): number =>
    events.filter(event => event.kind === kind).length;

const toShareableEvent = (event: GameTimelineEventInterface): TimelineEventInterface =>
    event.kind === TimelineEventKindEnum.Cell ? { kind: event.kind, cellIndex: event.cellIndex, value: event.value, ts: event.ts } : event;

const toShareableTimelineEvents = (events: GameTimelineEventInterface[]): TimelineEventInterface[] => {
    const shareableEvents: TimelineEventInterface[] = [];
    let carriedSeconds = 0;

    for (const event of events) {
        if (shareableEventKinds.includes(event.kind)) {
            shareableEvents.push({ ...toShareableEvent(event), ts: event.ts + carriedSeconds });
            carriedSeconds = 0;
        } else {
            carriedSeconds += event.ts;
        }
    }

    const lastShareableEvent = shareableEvents.at(-1);
    if (carriedSeconds > 0 && isDefined(lastShareableEvent)) {
        lastShareableEvent.ts += carriedSeconds;
    }

    return shareableEvents;
};

export const gameStateToString = (gameState: GameState, kind = SharedPayloadKindEnum.Puzzle): string => {
    try {
        const timelineEvents = toShareableTimelineEvents(gameState.timelineEvents);

        return serializer.encodeState({
            field: gameState.sudokuString,
            timelineEvents,
            kind,
            maxMistakes: gameState.maxMistakes,
            isChallengeRun: gameState.isChallengeRun,
            score: gameState.score,
            candidates: getIndexedCandidates(gameState.candidates),
            anchorSeconds: Math.floor(gameState.wallClockStartMs / 1000),
            pencilCount: countEventsOfKind(gameState.timelineEvents, TimelineEventKindEnum.Pencil),
            screenshotCount: countEventsOfKind(gameState.timelineEvents, TimelineEventKindEnum.Screenshot),
            rating: Math.round(gameState.rating * RatingWireScale),
            isRatingCeiling: gameState.isRatingCeiling,
            difficulty: difficultyToDifficultyCode(gameState.difficulty)
        });
    } catch {
        return '';
    }
};
