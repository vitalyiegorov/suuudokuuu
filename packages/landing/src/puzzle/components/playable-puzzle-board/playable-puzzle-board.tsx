import { useLingui } from '@lingui/react/macro';

import { DifficultyPlayableBoard } from '../../../difficulty/components/difficulty-playable-board/difficulty-playable-board';
import { PuzzleBoard } from '../puzzle-board/puzzle-board';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
import type { ReactNode } from 'react';

interface Props {
    puzzle: Pick<SerializedPuzzleInterface, 'solutionString' | 'sudokuString'>;
    difficulty: DifficultyEnum;
    children: ReactNode;
}

export const PlayablePuzzleBoard = ({ children, difficulty, puzzle }: Props) => {
    const { t } = useLingui();

    return (
        <DifficultyPlayableBoard
            difficulty={difficulty}
            loadingLabel={t`Loading the board…`}
            playLabel={t`Play this puzzle here`}
            puzzle={puzzle.sudokuString}
            solution={puzzle.solutionString}
        >
            <PuzzleBoard givens={puzzle.sudokuString}>{children}</PuzzleBoard>
        </DifficultyPlayableBoard>
    );
};
