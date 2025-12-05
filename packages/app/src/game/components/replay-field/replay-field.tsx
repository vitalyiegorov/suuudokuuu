import { use } from 'react';
import { Text, View } from 'react-native';

import { cs } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { CellFontSizeConstant } from '../constants/dimensions.contant';
import { FieldStyles as styles } from '../field/field.styles';

import { ReplayFieldCellStyles as cellStyles } from './replay-field-cell.styles';
import { ReplayFieldStyles as replayStyles } from './replay-field.styles';

import type { Sudoku } from '@suuudokuuu/generator';

interface Props {
    readonly sudoku: Sudoku;
    readonly highlightedCellKey?: string;
}

export const ReplayField = ({ sudoku, highlightedCellKey }: Props) => {
    const { theme } = use(ThemeContext);
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);
    const fontSize = CellFontSizeConstant * fontSizeMultiplier;

    const getCellValue = (value: number, isEmpty: boolean): string => isEmpty ? '' : String(value);

    return (
        <View style={styles.wrapper}>
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        const cellKey = getCellKey(cell);
                        const isHighlighted = cellKey === highlightedCellKey;
                        const isEmpty = sudoku.isBlankCell(cell);
                        const cellBackgroundColor = isHighlighted ? theme.colors.cell.active : theme.colors.white;

                        const containerStyles = [
                            cellStyles.container,
                            { borderColor: theme.colors.black, backgroundColor: cellBackgroundColor },
                            cs(sudoku.isLastInCellGroupX(cell), cellStyles.groupXEnd),
                            cs(sudoku.isLastInCellGroupY(cell), cellStyles.groupYEnd),
                            cs(sudoku.isLastInRow(cell), cellStyles.lastRow),
                            cs(sudoku.isLastInColumn(cell), cellStyles.lastCol)
                        ];

                        const textColor = isEmpty ? theme.colors.cell.emptyValueText : theme.colors.black;
                        const textStyles = [replayStyles.cellText, { fontSize, color: textColor }];

                        return (
                            <View key={`cell-${cell.y}-${cell.x}`} style={containerStyles}>
                                <Text allowFontScaling={false} style={textStyles}>
                                    {getCellValue(cell.value, isEmpty)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
