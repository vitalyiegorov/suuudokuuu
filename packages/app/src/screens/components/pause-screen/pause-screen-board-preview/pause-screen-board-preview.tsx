import { Sudoku } from '@suuudokuuu/generator';
import { use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';

import { PauseScreenBoardPreviewStyles as styles } from './pause-screen-board-preview.styles';

interface Props {
    readonly sudoku: Sudoku;
}

export const PauseScreenBoardPreview = ({ sudoku }: Props) => {
    const { theme } = use(ThemeContext);
    const containerStyles = [styles.container, { backgroundColor: theme.colors.background }];
    const filledCellStyles = [styles.cell, { backgroundColor: theme.colors.ink }];
    const emptyCellStyles = [styles.cell, { backgroundColor: theme.colors.surface.subtle }];

    return (
        <View accessibilityElementsHidden importantForAccessibility="no" style={containerStyles}>
            {sudoku.Field.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, cellIndex) => {
                        const cellStyles = sudoku.isBlankCell(cell) ? emptyCellStyles : filledCellStyles;

                        return <View key={cellIndex} style={cellStyles} />;
                    })}
                </View>
            ))}
        </View>
    );
};
