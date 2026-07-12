import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
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

interface Props {
    readonly maxMistakes: number;
    readonly selectedDifficultyDescription: string;
    readonly selectedDifficultyLabel: string;
    readonly selectedIndex: number;
    readonly selectedMistakesDescription: string;
    readonly selectedMistakesLabel: string;
}

export const DifficultyComplexityPreview = (props: Props) => {
    const {
        maxMistakes,
        selectedDifficultyDescription,
        selectedDifficultyLabel,
        selectedIndex,
        selectedMistakesDescription,
        selectedMistakesLabel
    } = props;
    const { theme } = use(ThemeContext);
    const activeCellCount = DifficultyComplexitySliderActiveCellBaseCount + selectedIndex * DifficultyComplexitySliderActiveCellStep;
    const activeCellOpacity =
        DifficultyComplexitySliderPreviewCellBaseOpacity + selectedIndex * DifficultyComplexitySliderPreviewCellOpacityStep;
    const previewStyles = [styles.preview, { backgroundColor: theme.colors.candidate.bg, borderColor: theme.colors.label.main }];
    const previewGridFrameStyles = [styles.previewGridFrame, { borderColor: theme.colors.candidate.border }];
    const titleStyles = [styles.previewTitle, { color: theme.colors.label.main }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.label.hint }];
    const mistakeBadgeStyles = [styles.previewMistakeBadge, { backgroundColor: theme.colors.black, borderColor: theme.colors.black }];
    const mistakeBadgeTextStyles = [styles.previewMistakeBadgeText, { color: theme.colors.label.inverted }];
    const mistakeDescriptionStyles = [styles.previewMistakeDescription, { color: theme.colors.label.hint }];
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
                <View style={styles.previewMistakeRow}>
                    <View style={mistakeBadgeStyles}>
                        <BlackText style={mistakeBadgeTextStyles}>{selectedMistakesLabel}</BlackText>
                    </View>
                    <BlackText numberOfLines={1} style={mistakeDescriptionStyles}>
                        {selectedMistakesDescription}
                    </BlackText>
                </View>
            </View>
        </View>
    );
};
