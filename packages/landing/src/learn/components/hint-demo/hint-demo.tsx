import { DifficultyEnum } from '@suuudokuuu/generator';
import { forgeSerializablePuzzle } from '@suuudokuuu/puzzle-forge';

import { IslandLocaleProvider } from '../../../i18n/components/island-locale-provider/island-locale-provider';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { HintDemoPlayableBoard } from '../hint-demo-playable-board/hint-demo-playable-board';

import type { ReactNode } from 'react';

const HINT_DEMO_SEED = 3;

interface Props {
    children: ReactNode;
}

export const HintDemo = ({ children }: Props) => {
    const { sudokuString } = forgeSerializablePuzzle(DifficultyEnum.Medium, HINT_DEMO_SEED);

    return (
        <IslandLocaleProvider>
            <HintDemoPlayableBoard puzzle={sudokuString}>
                <PuzzleBoard givens={sudokuString}>{children}</PuzzleBoard>
            </HintDemoPlayableBoard>
        </IslandLocaleProvider>
    );
};
