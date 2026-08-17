import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { initialGameState } from '../../game/store/game.state';

import { getReplayRunTechniqueEvents } from './get-replay-run-technique-events.util';

describe('getReplayRunTechniqueEvents', () => {
    it('should return an empty list when the run has no cell steps', () => {
        expect.assertions(1);

        expect(getReplayRunTechniqueEvents(initialGameState)).toStrictEqual([]);
    });

    it('should classify every placement across the full run, not only the steps replayed so far', () => {
        expect.assertions(2);

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
            challengeTimelineEvents: [{ kind: TimelineEventKindEnum.Cell as const, cellIndex: 8, value: 9, ts: 5 }]
        };

        const events = getReplayRunTechniqueEvents(gameState);

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ technique: SolutionTechniqueEnum.FullHouse });
    });
});
