import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameToggleInputModeAction } from '../../store/game.actions';

import { UseKeyboardControlsStyles as styles } from './use-keyboard-controls.styles';
import { keyboardKeyToAction } from './utils/keyboard-key-to-action.util';

import type { KeyboardHandlersInterface } from './interface/keyboard-handlers.interface';
import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

interface UseKeyboardControlsParams {
    readonly handlers: KeyboardHandlersInterface;
    readonly onSelectCell: OnEventFn<CellInterface | undefined>;
    readonly onSelectValue: OnEventFn<number>;
    readonly selectedCell: CellInterface | undefined;
    readonly sudoku: Sudoku;
}

export const useKeyboardControls = ({ handlers, onSelectCell, onSelectValue, selectedCell, sudoku }: UseKeyboardControlsParams) => {
    const dispatch = useAppDispatch();
    const hiddenInputRef = useRef<TextInput>(null);

    useEffect(() => {
        hiddenInputRef.current?.focus();
    }, []);

    const handleBlur = () => {
        hiddenInputRef.current?.focus();
    };

    const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const action = keyboardKeyToAction(event.nativeEvent.key, sudoku, selectedCell);

        if (action.type === 'select-cell') {
            onSelectCell(action.cell);
        } else if (action.type === 'toggle-input-mode') {
            dispatch(gameToggleInputModeAction());
        } else if (action.type === 'exit') {
            handlers.onExit();
        } else if (action.type === 'undo') {
            handlers.onUndo();
        } else if (action.type === 'redo') {
            handlers.onRedo();
        } else if (action.type === 'select-value') {
            onSelectValue(action.value);
        }
    };

    return (
        <TextInput
            autoFocus
            autoCorrect={false}
            caretHidden
            disableKeyboardShortcuts
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            ref={hiddenInputRef}
            showSoftInputOnFocus={false}
            spellCheck={false}
            style={styles.hiddenInput}
            value=""
        />
    );
};
