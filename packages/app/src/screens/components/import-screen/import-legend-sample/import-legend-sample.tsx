import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';
import { interpolateColor } from 'react-native-reanimated';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';

import { ImportLegendSampleStyles as styles } from './import-legend-sample.styles';

const sampleDigit = '5';
const accentForegroundBlend = 0.25;

interface Props {
    readonly tone: ImportCellToneEnum;
    readonly text: string;
}

export const ImportLegendSample = ({ tone, text }: Props) => {
    const { theme } = use(ThemeContext);

    const isEntry = tone === ImportCellToneEnum.ENTRY;
    const accentColor = interpolateColor(
        accentForegroundBlend,
        [0, 1],
        [applyColorAlpha(theme.colors.accent, 1), theme.colors.text.primary]
    );
    const cellStyles = [styles.cell, isEntry && styles.entryCell];
    const digitStyles = [styles.digit, isEntry && styles.entryDigit, isEntry && { color: accentColor }];

    return (
        <View style={styles.sample}>
            <View aria-hidden style={cellStyles}>
                <Text allowFontScaling={false} style={digitStyles}>
                    {sampleDigit}
                </Text>
                {tone === ImportCellToneEnum.UNCERTAIN ? <View style={styles.frame} /> : null}
            </View>
            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.label}>
                {text}
            </BlackText>
        </View>
    );
};
