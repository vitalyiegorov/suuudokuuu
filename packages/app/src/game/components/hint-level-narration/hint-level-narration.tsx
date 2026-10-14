import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, HintRegionKindEnum } from '@suuudokuuu/field-core';
import { use, useEffect } from 'react';
import { AccessibilityInfo, ScrollView } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetPatternNarration } from '../../utils/game-get-pattern-narration.util';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from '../hint-step-narration/hint-step-narration.styles';

import type { HintRegionInterface, StepScriptInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly hintLevel: HintLevelEnum;
    readonly hintRegion: HintRegionInterface | null;
    readonly stepScript: StepScriptInterface;
}

export const HintLevelNarration = ({ hintLevel, hintRegion, stepScript }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueName = i18n._(techniqueLabelsConstant[stepScript.technique]);
    const regionNumber = hintRegion?.number;
    const regionCell = hintRegion?.cell;

    const getNarrationText = () => {
        if (hintLevel === HintLevelEnum.PATTERN) {
            return i18n._(gameGetPatternNarration(stepScript, hintRegion, techniqueName));
        }

        if (hintRegion?.kind === HintRegionKindEnum.ROW) {
            return t`Look for ${techniqueName} in row ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.COLUMN) {
            return t`Look for ${techniqueName} in column ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.BOX) {
            return t`Look for ${techniqueName} in box ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.CELL && isDefined(regionCell)) {
            const cellName = `R${regionCell.y + 1}C${regionCell.x + 1}`;

            return t`Look for ${techniqueName} around cell ${cellName}.`;
        }

        return t`Look for ${techniqueName}.`;
    };
    const narrationText = getNarrationText();

    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    return (
        <ScrollView style={styles.narrationScroll}>
            <BlackText accessibilityLiveRegion="polite" style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                {narrationText}
            </BlackText>
        </ScrollView>
    );
};
