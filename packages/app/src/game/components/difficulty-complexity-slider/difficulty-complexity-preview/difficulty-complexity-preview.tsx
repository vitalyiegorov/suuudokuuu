import { type ReactNode, use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ChallengeConditionsRow } from '../../../../challenge/components/challenge-conditions-row/challenge-conditions-row';
import { ThemeContext } from '../../../../theme/context/theme.context';
import {
    DifficultyComplexitySliderActiveCellBaseCount,
    DifficultyComplexitySliderActiveCellStep,
    DifficultyComplexitySliderGridCells,
    DifficultyComplexitySliderPreviewCellBaseOpacity,
    DifficultyComplexitySliderPreviewCellOpacityStep
} from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityPreviewCell } from '../difficulty-complexity-preview-cell/difficulty-complexity-preview-cell';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import { difficultyComplexityPreviewGetColors } from './utils/difficulty-complexity-preview-get-colors.util';

interface Props {
    readonly children: ReactNode;
    readonly isChallengeMode: boolean;
    readonly maxMistakes: number;
    readonly selectedDifficultyDescription: string;
    readonly selectedDifficultyLabel: string;
    readonly selectedIndex: number;
}

export const DifficultyComplexityPreview = (props: Props) => {
    const { children, isChallengeMode, maxMistakes, selectedDifficultyDescription, selectedDifficultyLabel, selectedIndex } = props;
    const { theme } = use(ThemeContext);
    const activeCellCount = DifficultyComplexitySliderActiveCellBaseCount + selectedIndex * DifficultyComplexitySliderActiveCellStep;
    const activeCellOpacity =
        DifficultyComplexitySliderPreviewCellBaseOpacity + selectedIndex * DifficultyComplexitySliderPreviewCellOpacityStep;
    const previewColors = difficultyComplexityPreviewGetColors(theme);
    const previewBorderColor = isChallengeMode ? theme.colors.text.primary : previewColors.borderColor;
    const previewStyles = [styles.preview, { backgroundColor: previewColors.backgroundColor, borderColor: previewBorderColor }];
    const challengeConditions = isChallengeMode ? <ChallengeConditionsRow /> : null;
    const previewGridFrameStyles = [styles.previewGridFrame, { borderColor: theme.colors.surface.border }];
    const titleStyles = [styles.previewTitle, { color: theme.colors.text.primary }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.text.hint }];
    const isRelaxedMistakes = maxMistakes > 3;
    const isStandardMistakes = maxMistakes === 3;
    const isHardcoreMistakes = maxMistakes === 0;

    const renderPreviewCell = (cellIndex: number) => (
        <DifficultyComplexityPreviewCell
            activeCellCount={activeCellCount}
            activeCellOpacity={activeCellOpacity}
            cellIndex={cellIndex}
            isHardcoreMistakes={isHardcoreMistakes}
            isRelaxedMistakes={isRelaxedMistakes}
            isStandardMistakes={isStandardMistakes}
            key={cellIndex}
        />
    );

    return (
        <View style={previewStyles}>
            <View style={previewGridFrameStyles}>
                <View style={styles.previewGrid}>{DifficultyComplexitySliderGridCells.map(renderPreviewCell)}</View>
            </View>
            <View style={styles.previewText}>
                <BlackText style={titleStyles}>{selectedDifficultyLabel}</BlackText>
                <BlackText style={subtitleStyles}>{selectedDifficultyDescription}</BlackText>
                {children}

                {challengeConditions}
            </View>
        </View>
    );
};
