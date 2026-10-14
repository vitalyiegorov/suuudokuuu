import { useLingui } from '@lingui/react/macro';
import { forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';

import { IslandLocaleProvider } from '../../../i18n/components/island-locale-provider/island-locale-provider';
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
    const { t } = useLingui();
    const { solutionString, sudokuString } = forgeSerializablePuzzle(difficulty, DIFFICULTY_BOARD_SEED);

    return (
        <IslandLocaleProvider>
            <DifficultyPlayableBoard
                difficulty={difficulty}
                loadingLabel={t`Loading the board…`}
                playLabel={t`Play this puzzle here`}
                puzzle={sudokuString}
                solution={solutionString}
            >
                <PuzzleBoard givens={sudokuString}>{children}</PuzzleBoard>
            </DifficultyPlayableBoard>
        </IslandLocaleProvider>
    );
};
