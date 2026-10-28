import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import LucideX from 'lucide-react-native/icons/x';
import { use, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HintPanelEnterDurationMillisecondsConstant } from '../../constant/hint-panel-enter-duration.constant';
import { GameContext } from '../../context/game.context';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';

import type { HostInstance } from 'react-native';

export const HintPanelHeader = () => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);
    const headerRef = useRef<HostInstance>(null);

    const { hintLevel, stepIndex, stepScript } = snapshot;
    const technique =
        hintLevel === HintLevelEnum.WALKTHROUGH ? stepScript?.steps.at(stepIndex)?.narration.technique : stepScript?.technique;
    const chainTechniques = [...new Set(stepScript?.steps.map(step => step.narration.technique))];

    useEffect(() => {
        const focusTimeout = setTimeout(() => headerRef.current?.focus(), HintPanelEnterDurationMillisecondsConstant);

        return () => {
            clearTimeout(focusTimeout);
        };
    }, []);

    if (!isDefined(technique)) {
        return null;
    }

    const getTechniqueName = (stepTechnique: SolutionTechniqueEnum): string =>
        stepTechnique === SolutionTechniqueEnum.Guess ? t`Reveal` : i18n._(techniqueLabelsConstant[stepTechnique]);
    const techniqueName = getTechniqueName(technique);
    const isTechniqueChain = chainTechniques.length > 1;
    const techniqueChain = chainTechniques.map(getTechniqueName).join(' → ');
    const handleDismiss = () => {
        engine.stopStepScript();
    };

    return (
        <View ref={headerRef} style={styles.header} tabIndex={-1}>
            <View style={styles.titles}>
                <BlackText
                    maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                    numberOfLines={2}
                    role="heading"
                    style={styles.technique}
                    testID={HintStepNarrationSelectors.Technique}
                >
                    {techniqueName}
                </BlackText>
                {isTechniqueChain ? (
                    <BlackText
                        maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                        numberOfLines={2}
                        style={styles.techniqueChain}
                        testID={HintStepNarrationSelectors.TECHNIQUE_CHAIN}
                    >
                        {techniqueChain}
                    </BlackText>
                ) : null}
            </View>
            <AppIconButton
                accessibilityLabel={t`Close hint`}
                onPress={handleDismiss}
                size="compact"
                style={styles.dismissButton}
                testID={HintPanelSelectors.DismissButton}
                variant="ghost"
            >
                <LucideX color={theme.colors.text.primary} />
            </AppIconButton>
        </View>
    );
};
