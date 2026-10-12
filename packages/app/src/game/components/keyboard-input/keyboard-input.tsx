import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

import { KeyboardInputStyles as styles } from './keyboard-input.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { NativeSyntheticEvent, TextInputInstance } from 'react-native';

interface Props {
    readonly onKeyPress: OnEventFn<NativeSyntheticEvent<{ readonly key: string }>>;
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
