import { AppButton, CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui';
import { Text } from 'react-native';

import { ImportCellPadStyles as styles } from '../import-cell-pad/import-cell-pad.styles';
import { ImportScreenSelectors } from '../import-screen.selectors';

interface Props {
    readonly value: number;
    readonly onInput: (value: number) => void;
}

export const ImportCellPadButton = ({ value, onInput }: Props) => {
    const handlePress = () => void onInput(value);

    return (
        <AppButton
            onPress={handlePress}
            size="compact"
            style={styles.button}
            testID={`${ImportScreenSelectors.PadValue}.${value}`}
            variant="secondary"
        >
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.label}>
                {String(value)}
            </Text>
        </AppButton>
    );
};
