import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { GameContext } from '../../context/game.context';
import { useGameCreation } from '../../hooks/use-game-creation.hook';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const creation = useGameCreation();
    const snapshot = useFieldSnapshot(creation.engine);
    const value = { ...creation, snapshot };

    return <GameContext value={value}>{children}</GameContext>;
};
