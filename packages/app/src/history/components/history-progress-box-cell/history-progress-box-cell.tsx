import { MetricMinimumFontScaleConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryProgressCellToneEnum } from '../../enums/history-progress-cell-tone.enum';

import { HistoryProgressBoxCellStyles as styles } from './history-progress-box-cell.styles';

const ShadedCellAlpha = 0.05;
const BoxSize = 3;
const LastRowStartIndex = BoxSize * (BoxSize - 1);

interface Props {
    readonly index: number;
    readonly label: string;
    readonly tone: HistoryProgressCellToneEnum;
    readonly value: string;
}

export const HistoryProgressBoxCell = ({ index, label, tone, value }: Props) => {
    const { theme } = use(ThemeContext);
    const isSelected = tone === HistoryProgressCellToneEnum.SELECTED;
    const cellStyles = [
        styles.cell,
        index % BoxSize < BoxSize - 1 && styles.rightLine,
        index < LastRowStartIndex && styles.bottomLine,
        tone === HistoryProgressCellToneEnum.SHADED && { backgroundColor: applyColorAlpha(theme.colors.ink, ShadedCellAlpha) },
        isSelected && styles.selectedCell
    ];
    const labelStyles = [styles.label, isSelected && styles.selectedLabel];
    const valueStyles = [styles.value, isSelected && styles.selectedValue];

    return (
        <View accessible style={cellStyles}>
            <BlackText adjustsFontSizeToFit minimumFontScale={MetricMinimumFontScaleConstant} numberOfLines={1} style={labelStyles}>
                {label}
            </BlackText>
            <BlackText adjustsFontSizeToFit minimumFontScale={MetricMinimumFontScaleConstant} numberOfLines={1} style={valueStyles}>
                {value}
            </BlackText>
        </View>
    );
};
