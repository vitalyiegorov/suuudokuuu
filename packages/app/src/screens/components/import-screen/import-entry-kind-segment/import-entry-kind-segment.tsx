import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Pressable, Text, View } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { ImportEntryKindSegmentStyles as styles } from './import-entry-kind-segment.styles';

interface Props {
    readonly text: string;
    readonly testID: string;
    readonly isChecked: boolean;
    readonly onPress: () => void;
}

export const ImportEntryKindSegment = ({ text, testID, isChecked, onPress }: Props) => {
    const accessibilityState = { checked: isChecked };
    const handlePress = isChecked ? emptyFn : onPress;
    const surfaceStyles = [styles.surface, isChecked && styles.thumb];
    const labelStyles = [styles.label, isChecked && styles.thumbLabel];

    return (
        <Pressable
            aria-checked={isChecked}
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            style={styles.segment}
            testID={testID}
        >
            <View pointerEvents="none" style={surfaceStyles}>
                <Text
                    adjustsFontSizeToFit
                    maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                    minimumFontScale={0.8}
                    numberOfLines={1}
                    style={labelStyles}
                >
                    {text}
                </Text>
            </View>
        </Pressable>
    );
};
