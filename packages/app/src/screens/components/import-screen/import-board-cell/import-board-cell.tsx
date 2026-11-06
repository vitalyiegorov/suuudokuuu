import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { use } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { cubicBezier, interpolateColor } from 'react-native-reanimated';

import { animationEaseOutCurveConstant } from '../../../../@generic/constants/animation.constant';
import { useReduceMotion } from '../../../../@generic/hooks/use-reduce-motion.hook';
import { CellStyles as cellStyles } from '../../../../@generic/styles/cell.styles';
import { applyColorAlpha } from '../../../../@generic/utils/apply-color-alpha.util';
import { useCellBorderStyles } from '../../../../game/hooks/use-cell-border-styles.hook';
import { useCellFontSize } from '../../../../game/hooks/use-cell-font-size.hook';
import { gameGetCellAccessibilityLabel } from '../../../../game/utils/game-get-cell-accessibility-label.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportBoardCellStyles as styles } from './import-board-cell.styles';

import type { CellInterface } from '@suuudokuuu/generator';

const reviewTintAlpha = 0.15;
const conflictTintAlpha = 0.12;
const boardSudoku = new Sudoku();
const digitEnterDurationMs = 200;
const digitEnterRowDelayMs = 25;
const digitEnterEasing = cubicBezier(...animationEaseOutCurveConstant);
const digitEnterKeyframes = {
    from: { opacity: 0, transform: [{ scale: 0.9 }] },
    to: { opacity: 1, transform: [{ scale: 1 }] }
};
const digitFadeKeyframes = { from: { opacity: 0 }, to: { opacity: 1 } };

const errorForegroundBlend = 0.25;

interface Props {
    readonly tone: ImportCellToneEnum;
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly cellMargin: number;
    readonly isSelected: boolean;
    readonly onSelect: (cell: CellInterface) => void;
}

export const ImportBoardCell = ({ cell, cellSize, cellMargin, isSelected, tone, onSelect }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const isMotionReduced = useReduceMotion();
    const fontSize = useCellFontSize(cellSize);
    const borderStyles = useCellBorderStyles(boardSudoku, cell, cellMargin);

    const isConflict = tone === ImportCellToneEnum.CONFLICT;
    const isEntry = tone === ImportCellToneEnum.ENTRY || tone === ImportCellToneEnum.UNCERTAIN_ENTRY;
    const isUncertain = tone === ImportCellToneEnum.UNCERTAIN || tone === ImportCellToneEnum.UNCERTAIN_ENTRY;
    const isEmpty = cell.value === defaultSudokuConfig.blankCellValue;
    const valueBackgroundColor = isEmpty || isEntry ? theme.colors.surface.raised : theme.colors.board.filled;
    const checkedBackgroundColor = isUncertain ? applyColorAlpha(theme.colors.accent, reviewTintAlpha) : valueBackgroundColor;
    const backgroundColor = isConflict ? applyColorAlpha(theme.colors.danger, conflictTintAlpha) : checkedBackgroundColor;
    const containerStyles = [cellStyles.container(cellSize), { backgroundColor }, ...borderStyles];
    const ringStyles = [styles.ring, { borderColor: theme.colors.accent }];
    const cellText = isEmpty ? '' : String(cell.value);
    const cellLabel = i18n._(
        gameGetCellAccessibilityLabel({ candidates: [], cell, eliminatedCandidates: [], isEmpty, isWrong: isConflict })
    );
    const accessibilityLabel = [cellLabel, ...(isEntry ? [t`handwritten`] : []), ...(isUncertain ? [t`check this digit`] : [])].join(', ');
    const accessibilityState = { selected: isSelected };
    const errorColor = interpolateColor(errorForegroundBlend, [0, 1], [theme.colors.danger, theme.colors.text.primary]);
    const digitColor = isEntry ? applyColorAlpha(theme.colors.accent, 1) : theme.colors.text.primary;
    const textStyles = {
        animationDelay: cell.y * digitEnterRowDelayMs,
        animationDuration: digitEnterDurationMs,
        animationFillMode: 'backwards' as const,
        animationName: isMotionReduced ? digitFadeKeyframes : digitEnterKeyframes,
        animationTimingFunction: digitEnterEasing,
        color: isConflict ? errorColor : digitColor,
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
