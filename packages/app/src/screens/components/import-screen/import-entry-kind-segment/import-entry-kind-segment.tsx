import { AppButton } from '@suuudokuuu/ui';

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
    const accessibilityState = { checked: isChecked };
    const handlePress = isChecked ? emptyFn : onPress;
    const variant = isChecked ? 'boardSelected' : 'secondary';

    return (
        <AppButton
            aria-checked={isChecked}
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            disabled={isDisabled}
            onPress={handlePress}
            size="compact"
            style={styles.segment}
            testID={testID}
            text={text}
            variant={variant}
        />
    );
};
