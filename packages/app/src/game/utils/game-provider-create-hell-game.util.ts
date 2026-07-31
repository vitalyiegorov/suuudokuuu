import { t } from '@lingui/core/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { appRootStore } from '../../@generic/app-root.store';
import { hellQueueConsumeAction } from '../../hell-queue/store/hell-queue.actions';
import { hellQueueFirstEntrySelector } from '../../hell-queue/store/hell-queue.selectors';
import { gameStartAction } from '../store/game.actions';

import type { AppDispatch } from '../../@generic/app-root.store';
import type { GameSetupInterface } from '../interface/game-setup.interface';

interface GameProviderCreateHellGameDependenciesInterface {
    readonly dispatch: AppDispatch;
    readonly pushToGame: () => void;
    readonly setSudoku: (sudoku: Sudoku) => void;
}

export const gameProviderCreateHellGame = (
    setup: GameSetupInterface,
    dependencies: GameProviderCreateHellGameDependenciesInterface
): void => {
    const { dispatch, pushToGame, setSudoku } = dependencies;
    const hellEntry = hellQueueFirstEntrySelector(appRootStore.getState());

    if (!isDefined(hellEntry)) {
        throw new Error(t`No Hell puzzles are ready yet`);
    }

    const hellSudoku = Sudoku.fromString(hellEntry.puzzle, defaultSudokuConfig);
    dispatch(hellQueueConsumeAction({ id: hellEntry.id }));
    setSudoku(hellSudoku);

    dispatch(gameStartAction({ ...setup, sudokuString: hellSudoku.toString() }));
    pushToGame();
};
