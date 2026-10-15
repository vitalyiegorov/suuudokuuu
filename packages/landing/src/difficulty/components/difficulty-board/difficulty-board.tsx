import { forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';

import { PlayablePuzzleBoard } from '../../../puzzle/components/playable-puzzle-board/playable-puzzle-board';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const DIFFICULTY_BOARD_SEED = 1;

interface Props {
    difficulty: DifficultyEnum;
    children: ReactNode;
}

export const DifficultyBoard = ({ children, difficulty }: Props) => (
    <PlayablePuzzleBoard difficulty={difficulty} puzzle={forgeSerializablePuzzle(difficulty, DIFFICULTY_BOARD_SEED)}>
        {children}
    </PlayablePuzzleBoard>
);
