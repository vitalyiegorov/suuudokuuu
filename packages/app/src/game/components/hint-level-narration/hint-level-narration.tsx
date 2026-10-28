import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, HintRegionKindEnum } from '@suuudokuuu/field-core';
import { use, useEffect, useRef } from 'react';
import { AccessibilityInfo, ScrollView, type ScrollViewInstance } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetCellName } from '../../utils/game-get-cell-name.util';
import { gameGetPatternNarration } from '../../utils/game-get-pattern-narration.util';
import { gameGetSubsetNarration } from '../../utils/game-get-subset-narration.util';
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
    const narrationScrollRef = useRef<ScrollViewInstance>(null);

    const regionNumber = hintRegion?.number;
    const regionCell = hintRegion?.cell;

    const subsetNudge = gameGetSubsetNarration(stepScript.steps, 0, i18n, HintLevelEnum.TECHNIQUE);

    const getNarrationText = () => {
        if (hintLevel === HintLevelEnum.PATTERN) {
            return i18n._(gameGetPatternNarration(stepScript, hintRegion, i18n));
        }

        if (isDefined(subsetNudge)) {
            return i18n._(subsetNudge);
        }

        if (hintRegion?.kind === HintRegionKindEnum.ROW) {
            return t`Look at row ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.COLUMN) {
            return t`Look at column ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.BOX) {
            return t`Look at box ${regionNumber}.`;
        }

        if (hintRegion?.kind === HintRegionKindEnum.CELL && isDefined(regionCell)) {
            const cellName = gameGetCellName(regionCell);

            return t`Look around cell ${cellName}.`;
        }

        return t`Look at the highlighted cells.`;
    };
    const narrationText = getNarrationText();

    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    const handleNarrationContentSizeChange = () => {
        narrationScrollRef.current?.flashScrollIndicators();
    };

    return (
        <ScrollView
            onContentSizeChange={handleNarrationContentSizeChange}
            persistentScrollbar
            ref={narrationScrollRef}
            style={styles.narrationScroll}
            testID={HintStepNarrationSelectors.NARRATION_SCROLL}
        >
            <BlackText accessibilityLiveRegion="polite" style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                {narrationText}
            </BlackText>
        </ScrollView>
    );
};
