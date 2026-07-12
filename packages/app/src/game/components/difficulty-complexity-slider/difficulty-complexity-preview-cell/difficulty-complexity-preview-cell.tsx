import { use } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ThemeContext } from '../../../../theme/context/theme.context';
import {
    DifficultyComplexitySliderCellRankMultiplier,
    DifficultyComplexitySliderHardcoreGuardCells,
    DifficultyComplexitySliderPreviewActiveCellScale,
    DifficultyComplexitySliderPreviewCellCount,
    DifficultyComplexitySliderPreviewDecoratedCellOpacity,
    DifficultyComplexitySliderPreviewInactiveCellOpacity,
    DifficultyComplexitySliderPreviewInactiveCellScale,
    DifficultyComplexitySliderPreviewLayoutAnimationDurationMs,
    DifficultyComplexitySliderRelaxedAccentCells,
    DifficultyComplexitySliderStandardMistakeCells
} from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

interface Props {
    readonly activeCellCount: number;
    readonly activeCellOpacity: number;
    readonly cellIndex: number;
    readonly isHardcoreMistakes: boolean;
    readonly isRelaxedMistakes: boolean;
    readonly isStandardMistakes: boolean;
}

export const DifficultyComplexityPreviewCell = (props: Props) => {
    const { activeCellCount, activeCellOpacity, cellIndex, isHardcoreMistakes, isRelaxedMistakes, isStandardMistakes } = props;
    const { theme } = use(ThemeContext);
    const previewLayoutTransition = LinearTransition.duration(DifficultyComplexitySliderPreviewLayoutAnimationDurationMs);
    const cellRank = (cellIndex * DifficultyComplexitySliderCellRankMultiplier) % DifficultyComplexitySliderPreviewCellCount;
    const isActive = cellRank < activeCellCount;
    const isMistakeCell =
        isStandardMistakes && DifficultyComplexitySliderStandardMistakeCells.some(mistakeCellIndex => mistakeCellIndex === cellIndex);
    const isRelaxedAccentCell =
        isRelaxedMistakes && DifficultyComplexitySliderRelaxedAccentCells.some(accentCellIndex => accentCellIndex === cellIndex);
    const isHardcoreGuardCell =
        isHardcoreMistakes && DifficultyComplexitySliderHardcoreGuardCells.some(guardCellIndex => guardCellIndex === cellIndex);
    const isDecoratedCell = isMistakeCell || isRelaxedAccentCell || isHardcoreGuardCell;
    let cellOpacity = DifficultyComplexitySliderPreviewInactiveCellOpacity;
    let cellScale = DifficultyComplexitySliderPreviewInactiveCellScale;
    let cellBackgroundColor = theme.colors.label.hint;

    if (isActive) {
        cellOpacity = activeCellOpacity;
        cellScale = DifficultyComplexitySliderPreviewActiveCellScale;
        cellBackgroundColor = theme.colors.label.main;
    }

    if (isDecoratedCell) {
        cellOpacity = DifficultyComplexitySliderPreviewDecoratedCellOpacity;
        cellScale = DifficultyComplexitySliderPreviewActiveCellScale;
    }

    if (isHardcoreGuardCell) {
        cellBackgroundColor = theme.colors.candidate.bg;
    }

    if (isRelaxedAccentCell) {
        cellBackgroundColor = theme.colors.blue;
    }

    if (isMistakeCell) {
        cellBackgroundColor = theme.colors.red;
    }

    const cellBorderColor = isHardcoreGuardCell ? theme.colors.label.main : cellBackgroundColor;
    const cellStyles = [
        styles.previewCell,
        {
            backgroundColor: cellBackgroundColor,
            borderColor: cellBorderColor,
            borderWidth: isHardcoreGuardCell ? 1 : 0,
            opacity: cellOpacity,
            transform: [{ scale: cellScale }]
        }
    ];

    return <Animated.View layout={previewLayoutTransition} style={cellStyles} />;
};
