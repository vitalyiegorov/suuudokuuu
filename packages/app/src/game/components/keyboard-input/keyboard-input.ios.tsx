import { requireNativeView } from 'expo';
import { useIsFocused } from 'expo-router';

import { UseKeyboardControlsStyles as styles } from '../../hooks/use-keyboard-controls/use-keyboard-controls.styles';

import type { KeyboardInputPropsInterface } from './keyboard-input-props.interface';
import type { ViewProps } from 'react-native';

interface Props {
    readonly onKeyPress: KeyboardInputPropsInterface['onKeyPress'];
}

const NativeKeyboardInput = requireNativeView<Props & ViewProps & Record<'active', boolean>>('hardware-keyboard');

export const KeyboardInput = ({ onKeyPress }: Props) => {
    const isFocused = useIsFocused();

    return <NativeKeyboardInput accessible={false} active={isFocused} onKeyPress={onKeyPress} style={styles.hiddenInput} />;
};
