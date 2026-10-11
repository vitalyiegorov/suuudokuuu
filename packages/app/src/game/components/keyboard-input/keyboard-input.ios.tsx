import { requireNativeView } from 'expo';
import { useIsFocused } from 'expo-router';

import { KeyboardInputStyles as styles } from './keyboard-input.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { TextInputKeyPressEvent, ViewProps } from 'react-native';

interface Props {
    readonly onKeyPress: OnEventFn<TextInputKeyPressEvent>;
}

const NativeKeyboardInput = requireNativeView<Props & ViewProps & Record<'active', boolean>>('hardware-keyboard');

export const KeyboardInput = ({ onKeyPress }: Props) => {
    const isFocused = useIsFocused();

    return <NativeKeyboardInput accessible={false} active={isFocused} onKeyPress={onKeyPress} style={styles.hiddenInput} />;
};
