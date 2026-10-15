import { DifficultyPlayableBoard } from '../../../difficulty/components/difficulty-playable-board/difficulty-playable-board';
import { IslandLocaleProvider } from '../../../i18n/components/island-locale-provider/island-locale-provider';
import { PuzzleBoard } from '../puzzle-board/puzzle-board';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
import type { ReactNode } from 'react';

interface Props {
    puzzle: Pick<SerializedPuzzleInterface, 'solutionString' | 'sudokuString'>;
    difficulty: DifficultyEnum;
    children: ReactNode;
}

export const PlayablePuzzleBoard = ({ children, difficulty, puzzle }: Props) => (
    <IslandLocaleProvider>
        <DifficultyPlayableBoard
            difficulty={difficulty}
            loadingLabel="Loading the board…"
            playLabel="Play this puzzle here"
            puzzle={puzzle.sudokuString}
            solution={puzzle.solutionString}
        >
            <PuzzleBoard givens={puzzle.sudokuString}>{children}</PuzzleBoard>
        </DifficultyPlayableBoard>
    </IslandLocaleProvider>
);
