import { forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';

import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { DifficultyPlayableBoard } from '../difficulty-playable-board/difficulty-playable-board';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const DIFFICULTY_BOARD_SEED = 1;

interface Props {
    difficulty: DifficultyEnum;
    children: ReactNode;
}

export const DifficultyBoard = ({ children, difficulty }: Props) => {
    const { solutionString, sudokuString } = forgeSerializablePuzzle(difficulty, DIFFICULTY_BOARD_SEED);

    return (
        <DifficultyPlayableBoard difficulty={difficulty} puzzle={sudokuString} solution={solutionString}>
            <PuzzleBoard givens={sudokuString}>{children}</PuzzleBoard>
        </DifficultyPlayableBoard>
    );
};
