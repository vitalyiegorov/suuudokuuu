import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { GameState } from '../store/game.state';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { TimelineEventInterface } from '@suuudokuuu/encoder';

const serializer = new GameStateSerializer();

const shareableEventKinds: TimelineEventKindEnum[] = [
    TimelineEventKindEnum.Cell,
    TimelineEventKindEnum.Mistake,
    TimelineEventKindEnum.AutoCandidates,
    TimelineEventKindEnum.Away,
    TimelineEventKindEnum.Return
];

const toShareableEvent = (event: GameTimelineEventInterface): TimelineEventInterface =>
    event.kind === TimelineEventKindEnum.Cell ? { kind: event.kind, cellIndex: event.cellIndex, value: event.value, ts: event.ts } : event;

export const gameStateToString = (gameState: GameState, kind = SharedPayloadKindEnum.Puzzle): string => {
    try {
        const timelineEvents = gameState.timelineEvents.filter(event => shareableEventKinds.includes(event.kind)).map(toShareableEvent);

        return serializer.encodeState({
            field: gameState.sudokuString,
            timelineEvents,
            kind,
            maxMistakes: gameState.maxMistakes,
            isChallengeRun: gameState.isChallengeRun,
            score: gameState.score,
            candidates: gameState.candidates,
            anchorSeconds: Math.floor(gameState.wallClockStartMs / 1000)
        });
    } catch {
        return '';
    }
};
