import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { use } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { animationEaseOutCurveConstant } from '../../../../@generic/constants/animation.constant';
import { useReduceMotion } from '../../../../@generic/hooks/use-reduce-motion.hook';
import { CellStyles as cellStyles } from '../../../../@generic/styles/cell.styles';
import { useCellBorderStyles } from '../../../../game/hooks/use-cell-border-styles.hook';
import { useCellFontSize } from '../../../../game/hooks/use-cell-font-size.hook';
import { gameGetCellAccessibilityLabel } from '../../../../game/utils/game-get-cell-accessibility-label.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportBoardCellStyles as styles } from './import-board-cell.styles';

import type { CellInterface } from '@suuudokuuu/generator';

const boardSudoku = new Sudoku();
const digitEnterDurationMs = 200;
const digitEnterRowDelayMs = 25;
const digitEnterEasing = cubicBezier(...animationEaseOutCurveConstant);
const digitEnterKeyframes = {
    from: { opacity: 0, transform: [{ scale: 0.9 }] },
    to: { opacity: 1, transform: [{ scale: 1 }] }
};
const digitFadeKeyframes = { from: { opacity: 0 }, to: { opacity: 1 } };

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
    const isMotionReduced = useReduceMotion();
    const fontSize = useCellFontSize(cellSize);
    const borderStyles = useCellBorderStyles(boardSudoku, cell, cellMargin);

    const isEmpty = cell.value === defaultSudokuConfig.blankCellValue;
    const valueBackgroundColor = isEmpty ? theme.colors.surface.raised : theme.colors.board.filled;
    const backgroundColor = isConflict ? theme.colors.board.error : valueBackgroundColor;
    const containerStyles = [cellStyles.container(cellSize), { backgroundColor }, ...borderStyles];
    const ringStyles = [styles.ring, { borderColor: theme.colors.board.selected }];
    const cellText = isEmpty ? '' : String(cell.value);
    const accessibilityLabel = i18n._(gameGetCellAccessibilityLabel({ candidates: [], cell, isEmpty, isWrong: isConflict }));
    const accessibilityState = { selected: isSelected };
    const textStyles = {
        animationDelay: cell.y * digitEnterRowDelayMs,
        animationDuration: digitEnterDurationMs,
        animationFillMode: 'backwards' as const,
        animationName: isMotionReduced ? digitFadeKeyframes : digitEnterKeyframes,
        animationTimingFunction: digitEnterEasing,
        color: theme.colors.ink,
        fontSize
    };

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
            <Animated.Text allowFontScaling={false} style={textStyles}>
                {cellText}
            </Animated.Text>
            {isSelected ? <View pointerEvents="none" style={ringStyles} /> : null}
        </Pressable>
    );
};
