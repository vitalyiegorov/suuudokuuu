import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Pressable, Text } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { ImportEntryKindSegmentStyles as styles } from './import-entry-kind-segment.styles';

interface Props {
    readonly text: string;
    readonly testID: string;
    readonly isChecked: boolean;
    readonly isDisabled: boolean;
    readonly onPress: () => void;
}

export const ImportEntryKindSegment = ({ text, testID, isChecked, isDisabled, onPress }: Props) => {
    const accessibilityState = { checked: isChecked, disabled: isDisabled };
    const handlePress = isChecked ? emptyFn : onPress;
    const segmentStyles = [styles.segment, isChecked && styles.thumb];
    const labelStyles = [styles.label, isChecked && styles.thumbLabel];

    return (
        <Pressable
            aria-checked={isChecked}
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            disabled={isDisabled}
            onPress={handlePress}
            style={segmentStyles}
            testID={testID}
        >
            <Text
                adjustsFontSizeToFit
                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                minimumFontScale={0.8}
                numberOfLines={1}
                style={labelStyles}
            >
                {text}
            </Text>
        </Pressable>
    );
};
