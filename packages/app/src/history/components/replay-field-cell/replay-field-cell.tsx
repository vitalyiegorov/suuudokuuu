import { use } from 'react';
import { Text, View } from 'react-native';

import { CellStyles as cellStyles } from '../../../@generic/styles/cell.styles';
import { useCellBorderStyles } from '../../../game/hooks/use-cell-border-styles.hook';
import { useCellFontSize } from '../../../game/hooks/use-cell-font-size.hook';
import { ThemeContext } from '../../../theme/context/theme.context';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

interface Props {
    readonly sudoku: Sudoku;
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly isHighlighted: boolean;
}

export const ReplayFieldCell = ({ sudoku, cell, cellSize, isHighlighted }: Props) => {
    const { theme } = use(ThemeContext);
    const fontSize = useCellFontSize(cellSize);

    const value = String(cell.value);
    const isEmpty = sudoku.isBlankCell(cell);
    const cellBackgroundColor = isHighlighted ? theme.colors.board.selected : theme.colors.surface.raised;

    const containerStyles = [
        cellStyles.container(cellSize),
        { backgroundColor: cellBackgroundColor },
        ...useCellBorderStyles(sudoku, cell)
    ];

    const textColor = isEmpty ? theme.colors.board.emptyText : theme.colors.ink;
    const textStyles = [{ fontSize, color: textColor }];
    const cellValue = isEmpty ? '' : value;

    return (
        <View key={`cell-${cell.y}-${cell.x}`} style={containerStyles}>
            <Text allowFontScaling={false} style={textStyles}>
                {cellValue}
            </Text>
        </View>
    );
};
