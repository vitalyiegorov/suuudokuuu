import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Pressable, Text, View } from 'react-native';

import { ImportCellPadStyles as styles } from '../import-cell-pad/import-cell-pad.styles';
import { ImportScreenSelectors } from '../import-screen.selectors';

import type { PressableStateCallbackType } from 'react-native';

interface Props {
    readonly value: number;
    readonly isDisabled: boolean;
    readonly onInput: (value: number) => void;
}

export const ImportCellPadButton = ({ value, isDisabled, onInput }: Props) => {
    const handlePress = () => void onInput(value);

    const edgeStyle = value % 5 === 1 ? styles.firstButton : value % 5 === 0 && styles.lastButton;

    const getButtonStyles = ({ pressed }: PressableStateCallbackType) => [styles.button, edgeStyle, pressed && styles.pressed];

    return (
        <Pressable
            disabled={isDisabled}
            onPress={handlePress}
            accessibilityRole="button"
            style={getButtonStyles}
            testID={`${ImportScreenSelectors.PadValue}.${value}`}
        >
            <View pointerEvents="none" style={styles.surface}>
                <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.label}>
                    {String(value)}
                </Text>
            </View>
        </Pressable>
    );
};
