import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { HomeScreenIntentSpotlightStyles as styles } from '../home-screen-intent-spotlight/home-screen-intent-spotlight.styles';

interface Props {
    readonly label: string;
}

export const HomeScreenIntentChip = ({ label }: Props) => (
    <View style={styles.chip}>
        <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.chipLabel}>
            {label}
        </BlackText>
    </View>
);
