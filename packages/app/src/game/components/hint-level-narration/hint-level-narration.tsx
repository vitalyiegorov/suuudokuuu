import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, HintRegionKindEnum, getHintPatternStep, getHintRegion } from '@suuudokuuu/field-core';
import { use, useEffect } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from '../hint-step-narration/hint-step-narration.styles';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly hintLevel: HintLevelEnum;
    readonly stepScript: StepScriptInterface;
}

export const HintLevelNarration = ({ hintLevel, stepScript }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueName = i18n._(techniqueLabelsConstant[stepScript.technique]);
    const hintPatternStep = getHintPatternStep(stepScript);
    const region = getHintRegion(hintPatternStep?.patternCells ?? [], hintPatternStep?.narration.placement?.cell);
    const regionNumber = region?.number;

    const getNarrationText = () => {
        if (hintLevel === HintLevelEnum.PATTERN) {
            return t`${techniqueName}: the highlighted cells hold the pattern.`;
        }

        if (region?.kind === HintRegionKindEnum.ROW) {
            return t`Look for ${techniqueName} in row ${regionNumber}.`;
        }

        if (region?.kind === HintRegionKindEnum.COLUMN) {
            return t`Look for ${techniqueName} in column ${regionNumber}.`;
        }

        if (region?.kind === HintRegionKindEnum.BOX) {
            return t`Look for ${techniqueName} in box ${regionNumber}.`;
        }

        return t`Look for ${techniqueName}.`;
    };
    const narrationText = getNarrationText();

    const techniqueStyles = [styles.technique, { color: theme.colors.text.hint }];
    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BlackText numberOfLines={1} style={techniqueStyles} testID={HintStepNarrationSelectors.Technique}>
                    {techniqueName}
                </BlackText>
            </View>

            <BlackText style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                {narrationText}
            </BlackText>
        </View>
    );
};
