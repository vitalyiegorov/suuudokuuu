import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { emptyFn } from '@rnw-community/shared';

import { GameEmptySudokuStringConstant } from '../../game/constant/empty-sudoku-string.constant';
import { GameContext } from '../../game/context/game.context';

import { createAppTestStore } from './create-app-test-store.mock';

import type { GameContextValueInterface } from '../../game/interface/game-context-value.interface';
import type { GameState } from '../../game/store/game.state';
import type { SettingsState } from '../../settings/store/settings.state';
import type { ReactElement } from 'react';

interface RenderWithGameContextOptions {
    readonly create?: GameContextValueInterface['create'];
    readonly createFromState?: GameContextValueInterface['createFromState'];
    readonly engine?: FieldEngine;
    readonly game?: Partial<GameState>;
    readonly isCreatingGame?: boolean;
    readonly settings?: Partial<SettingsState>;
    readonly store?: ReturnType<typeof createAppTestStore>;
}

export const renderWithGameContext = (ui: ReactElement, options: RenderWithGameContextOptions = {}) => {
    const engine = options.engine ?? new FieldEngine({ sudokuString: GameEmptySudokuStringConstant, difficulty: DifficultyEnum.Newbie });
    const gameContextValue: GameContextValueInterface = {
        create: options.create ?? emptyFn,
        createFromState: options.createFromState ?? emptyFn,
        engine,
        isCreatingGame: options.isCreatingGame ?? false,
        snapshot: engine.getSnapshot()
    };

    return render(
        <Provider store={options.store ?? createAppTestStore({ game: options.game, settings: options.settings })}>
            <I18nProvider i18n={i18n}>
                <GameContext value={gameContextValue}>{ui}</GameContext>
            </I18nProvider>
        </Provider>
    );
};
