import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { createAppTestStore } from '../../@generic/utils/create-app-test-store.mock';
import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';
import { gameFindHintStepScript } from '../utils/game-find-hint-step-script.util';
import { gameGetSavePayload } from '../utils/game-get-save-payload.util';

import { gameHintAction, gameSaveAction } from './game.actions';

import type { GameState } from './game.state';
import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';

const runState: Partial<GameState> = {
    sudokuString: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
    difficulty: DifficultyEnum.Medium,
    candidates: {},
    inputMode: 'normal',
    mistakes: 0,
    maxMistakes: 3,
    score: 400,
    elapsedTime: 30
};

const buildStoreWithEngine = () => {
    const store = createAppTestStore({ game: runState });
    const { game } = store.getState();
    const engine = new FieldEngine({
        sudokuString: game.sudokuString,
        difficulty: game.difficulty,
        candidates: game.candidates,
        inputMode: game.inputMode,
        mistakes: game.mistakes
    });

    engine.on('moveApplied', move => void store.dispatch(gameSaveAction(gameGetSavePayload(engine, move))));

    return { engine, store };
};

const withoutTimestamp = (event: GameTimelineEventInterface): GameTimelineEventInterface => ({ ...event, ts: 0 });

const findPlacement = (engine: FieldEngine): StepScriptCandidateInterface => {
    const stepScript = gameFindHintStepScript(engine.Sudoku);

    if (!isDefined(stepScript) || !isDefined(stepScript.placement)) {
        throw new Error('Expected the fixture puzzle to expose a technique that places a value');
    }

    engine.startStepScript(stepScript);

    return stepScript.placement;
};

describe('hint application and manual placement', () => {
    it('produces the same board, save payload and timeline cell event as a manual placement', () => {
        expect.assertions(5);

        const hinted = buildStoreWithEngine();
        const manual = buildStoreWithEngine();

        const placement = findPlacement(hinted.engine);

        hinted.store.dispatch(gameHintAction({ eliminations: [] }));
        hinted.engine.applyStepScript();

        manual.engine.selectCell(placement.cell);
        manual.engine.inputValue(placement.value);

        const hintedGame = hinted.store.getState().game;
        const manualGame = manual.store.getState().game;
        const [, hintedCellEvent] = hintedGame.timelineEvents;
        const [manualCellEvent] = manualGame.timelineEvents;

        expect(hinted.engine.serialize().sudokuString).toBe(manual.engine.serialize().sudokuString);
        expect(hintedGame.sudokuString).toBe(manualGame.sudokuString);
        expect(hintedGame.candidates).toStrictEqual(manualGame.candidates);
        expect(withoutTimestamp(hintedCellEvent)).toStrictEqual(withoutTimestamp(manualCellEvent));
        expect(hintedCellEvent).toHaveProperty('technique');
    });

    it('scores the hinted placement identically and charges only the hint penalty on top', () => {
        expect.assertions(2);

        const hinted = buildStoreWithEngine();
        const manual = buildStoreWithEngine();

        const placement = findPlacement(hinted.engine);

        hinted.store.dispatch(gameHintAction({ eliminations: [] }));
        hinted.engine.applyStepScript();

        manual.engine.selectCell(placement.cell);
        manual.engine.inputValue(placement.value);

        const penalty = new SudokuScoring(defaultScoringConfig).calculateHintPenalty({
            difficulty: DifficultyEnum.Medium,
            maxMistakes: 3
        });

        expect(manual.store.getState().game.score).toBeGreaterThan(400);
        expect(hinted.store.getState().game.score).toBe(manual.store.getState().game.score - penalty);
    });

    it('records the hint marker before the placement it explains', () => {
        expect.assertions(2);

        const hinted = buildStoreWithEngine();

        findPlacement(hinted.engine);

        hinted.store.dispatch(gameHintAction({ eliminations: [] }));
        hinted.engine.applyStepScript();

        const [hintEvent, cellEvent] = hinted.store.getState().game.timelineEvents;

        expect(hintEvent).toStrictEqual({ kind: TimelineEventKindEnum.Hint, ts: 30 });
        expect(cellEvent.kind).toBe(TimelineEventKindEnum.Cell);
    });

    it('stops the step script once it has been applied', () => {
        expect.assertions(2);

        const hinted = buildStoreWithEngine();

        findPlacement(hinted.engine);

        expect(hinted.engine.getSnapshot().stepScript).not.toBeNull();

        hinted.engine.applyStepScript();

        expect(hinted.engine.getSnapshot().stepScript).toBeNull();
    });
});
