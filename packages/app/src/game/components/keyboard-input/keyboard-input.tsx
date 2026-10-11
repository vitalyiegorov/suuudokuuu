import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

import { UseKeyboardControlsStyles as styles } from '../../hooks/use-keyboard-controls/use-keyboard-controls.styles';

import type { KeyboardInputPropsInterface } from './keyboard-input-props.interface';
import type { TextInputInstance } from 'react-native';

interface Props {
    readonly onKeyPress: KeyboardInputPropsInterface['onKeyPress'];
}

export const KeyboardInput = ({ onKeyPress }: Props) => {
    const hiddenInputRef = useRef<TextInputInstance>(null);

    useEffect(() => {
        hiddenInputRef.current?.focus();
    }, []);

    const handleBlur = () => {
        hiddenInputRef.current?.focus();
    };

    return (
        <TextInput
            autoFocus
            autoCorrect={false}
            caretHidden
            disableKeyboardShortcuts
            onBlur={handleBlur}
            onKeyPress={onKeyPress}
            ref={hiddenInputRef}
            showSoftInputOnFocus={false}
            spellCheck={false}
            style={styles.hiddenInput}
            value=""
        />
    );
};
