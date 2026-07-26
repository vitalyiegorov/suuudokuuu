import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameToggleInputModeAction } from '../../store/game.actions';

import { UseKeyboardControlsStyles as styles } from './use-keyboard-controls.styles';
import { keyboardKeyToAction } from './utils/keyboard-key-to-action.util';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export const useKeyboardControls = (
    sudoku: Sudoku,
    selectedCell: CellInterface | undefined,
    onSelectCell: OnEventFn<CellInterface | undefined>,
    onSelectValue: OnEventFn<number>,
    onExit: OnEventFn<void>
    // eslint-disable-next-line @typescript-eslint/max-params
) => {
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
            onExit();
        } else if (action.type === 'select-value') {
            onSelectValue(action.value);
        }
    };

    return (
        <TextInput
            autoFocus
            caretHidden
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            ref={hiddenInputRef}
            showSoftInputOnFocus={false}
            style={styles.hiddenInput}
            value=""
        />
    );
};
