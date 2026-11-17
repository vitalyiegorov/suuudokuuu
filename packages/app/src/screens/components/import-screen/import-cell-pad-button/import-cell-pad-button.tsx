import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Pressable, Text, View } from 'react-native';

import { ImportCellPadStyles as styles } from '../import-cell-pad/import-cell-pad.styles';
import { ImportScreenSelectors } from '../import-screen.selectors';

interface Props {
    readonly value: number;
    readonly isDisabled: boolean;
    readonly onInput: (value: number) => void;
}

export const ImportCellPadButton = ({ value, isDisabled, onInput }: Props) => {
    const handlePress = () => void onInput(value);

    return (
        <Pressable
            disabled={isDisabled}
            onPress={handlePress}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
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
