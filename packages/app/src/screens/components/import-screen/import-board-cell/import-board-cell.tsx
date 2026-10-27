import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { use } from 'react';
import { Pressable, Text } from 'react-native';

import { CellStyles as cellStyles } from '../../../../@generic/styles/cell.styles';
import { useCellBorderStyles } from '../../../../game/hooks/use-cell-border-styles.hook';
import { useCellFontSize } from '../../../../game/hooks/use-cell-font-size.hook';
import { gameGetCellAccessibilityLabel } from '../../../../game/utils/game-get-cell-accessibility-label.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import type { CellInterface } from '@suuudokuuu/generator';

const boardSudoku = new Sudoku();

interface Props {
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly cellMargin: number;
    readonly isSelected: boolean;
    readonly isConflict: boolean;
    readonly onSelect: (cell: CellInterface) => void;
}

export const ImportBoardCell = ({ cell, cellSize, cellMargin, isSelected, isConflict, onSelect }: Props) => {
    const { i18n } = useLingui();
    const { theme } = use(ThemeContext);
    const fontSize = useCellFontSize(cellSize);
    const borderStyles = useCellBorderStyles(boardSudoku, cell, cellMargin);

    const isEmpty = cell.value === defaultSudokuConfig.blankCellValue;
    const valueBackgroundColor = isEmpty ? theme.colors.surface.raised : theme.colors.board.filled;
    const unselectedBackgroundColor = isConflict ? theme.colors.board.error : valueBackgroundColor;
    const backgroundColor = isSelected ? theme.colors.board.selected : unselectedBackgroundColor;
    const color = isSelected ? theme.colors.board.selectedText : theme.colors.ink;
    const containerStyles = [cellStyles.container(cellSize), { backgroundColor }, ...borderStyles];
    const cellText = isEmpty ? '' : String(cell.value);
    const accessibilityLabel = i18n._(gameGetCellAccessibilityLabel({ candidates: [], cell, isEmpty, isWrong: isConflict }));
    const accessibilityState = { selected: isSelected };
    const textStyles = { color, fontSize };

    const handlePress = () => void onSelect(cell);

    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            style={containerStyles}
            tabIndex={-1}
            testID={`${ImportScreenSelectors.Cell}.${cell.y}-${cell.x}`}
        >
            <Text allowFontScaling={false} style={textStyles}>
                {cellText}
            </Text>
        </Pressable>
    );
};
