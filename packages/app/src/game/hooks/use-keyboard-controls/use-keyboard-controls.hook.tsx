import { isDefined } from '@rnw-community/shared';

import { KeyboardInput } from '../../components/keyboard-input/keyboard-input';
import { gameToggleInputMode } from '../../utils/game-toggle-input-mode.util';

import { keyboardKeyToAction } from './utils/keyboard-key-to-action.util';

import type { OnEventFn } from '@rnw-community/shared';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';
import type { NativeSyntheticEvent } from 'react-native';

// oxlint-disable-next-line max-params
export const useKeyboardControls = (
    engine: FieldEngine,
    selectedCell: CellInterface | undefined,
    onSelectCell: OnEventFn<CellInterface | undefined>,
    onSelectValue: OnEventFn<number>,
    onExit: OnEventFn<void>
) => {
    const handleKeyPress = (event: NativeSyntheticEvent<{ readonly key: string }>) => {
        const action = keyboardKeyToAction(event.nativeEvent.key, engine.Sudoku, selectedCell);

        if (isDefined(engine.getSnapshot().stepScript)) {
            if (action.type === 'exit') {
                engine.stopStepScript();
            }

            return;
        }

        if (action.type === 'select-cell') {
            onSelectCell(action.cell);
        } else if (action.type === 'toggle-input-mode') {
            gameToggleInputMode(engine);
        } else if (action.type === 'exit') {
            onExit();
        } else if (action.type === 'select-value') {
            onSelectValue(action.value);
        }
    };

    return <KeyboardInput onKeyPress={handleKeyPress} />;
};
