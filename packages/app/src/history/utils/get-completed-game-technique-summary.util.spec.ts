import { describe, expect, it } from '@jest/globals';
import { SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { initialGameState } from '../../game/store/game.state';
import { gameStateToString } from '../../game/utils/game-state-to-string.util';

import { getCompletedGameTechniqueSummary } from './get-completed-game-technique-summary.util';

describe('getCompletedGameTechniqueSummary', () => {
    it('returns an empty list when nothing can be replayed', () => {
        expect(getCompletedGameTechniqueSummary('')).toStrictEqual([]);
    });

    it('summarizes the techniques used across a completed run, newest-SE first, capped to the limit', () => {
        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const gameState = {
            ...initialGameState,
            sudokuString: sudoku.toString(),
            timelineEvents: [{ kind: TimelineEventKindEnum.Cell as const, cellIndex: 8, value: 9, ts: 5 }]
        };
        const encodedState = gameStateToString(gameState, SharedPayloadKindEnum.Handoff);

        const summary = getCompletedGameTechniqueSummary(encodedState);

        expect(summary).toHaveLength(1);
        expect(summary[0]).toMatchObject({ count: 1, technique: SolutionTechniqueEnum.FullHouse });
    });
});
