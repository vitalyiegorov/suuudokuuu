import { use } from 'react';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsCellMarginSelector } from '../../settings/store/settings.selectors';
import { ThemeContext } from '../../theme/context/theme.context';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { StyleProp, ViewStyle } from 'react-native';

interface UseCellBorderStylesParams {
    sudoku: Sudoku;
    cell: CellInterface;
}

export const useCellBorderStyles = ({ sudoku, cell }: UseCellBorderStylesParams): StyleProp<ViewStyle>[] => {
    const { theme } = use(ThemeContext);

    const cellMargin = useAppSelector(settingsCellMarginSelector);

    const styles: StyleProp<ViewStyle>[] = [{ borderColor: theme.colors.black }];
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
