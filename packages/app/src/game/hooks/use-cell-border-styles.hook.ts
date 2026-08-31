import { use } from 'react';

import { ThemeContext } from '../../theme/context/theme.context';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { StyleProp, ViewStyle } from 'react-native';

export const useCellBorderStyles = (sudoku: Sudoku, cell: CellInterface, cellMargin: number): StyleProp<ViewStyle>[] => {
    const { theme } = use(ThemeContext);

    const styles: StyleProp<ViewStyle>[] = [{ borderColor: theme.colors.ink }];
    if (sudoku.isLastInCellGroupX(cell)) {
        styles.push([{ borderRightWidth: 1, marginRight: cellMargin }]);
    }

    if (sudoku.isLastInCellGroupY(cell)) {
        styles.push([{ borderBottomWidth: 1, marginBottom: cellMargin }]);
    }

    if (sudoku.isLastInRow(cell)) {
        styles.push({ borderBottomWidth: 1 });
    }

    if (sudoku.isLastInColumn(cell)) {
        styles.push({ borderRightWidth: 1 });
    }

    return styles;
};
