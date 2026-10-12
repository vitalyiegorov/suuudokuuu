import { useLingui } from '@lingui/react/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { use, useEffect, useRef } from 'react';
import { AccessibilityInfo, ScrollView, type ScrollViewInstance, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetStepNarration } from '../../utils/game-get-step-narration.util';
import { HintChainSentence } from '../hint-chain-sentence/hint-chain-sentence';
import { HintNarratedChain } from '../hint-narrated-chain/hint-narrated-chain';

import { HintStepNarrationSelectors } from './hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from './hint-step-narration.styles';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly stepScript: StepScriptInterface;
    readonly stepIndex: number;
    readonly value?: number;
}

export const HintStepNarration = ({ stepScript, stepIndex, value }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const narrationScrollRef = useRef<ScrollViewInstance>(null);
    const step = stepScript.steps[stepIndex];
    const techniqueName =
        step.narration.technique === SolutionTechniqueEnum.Guess ? t`Reveal` : i18n._(techniqueLabelsConstant[step.narration.technique]);
    const narrationText = i18n._(gameGetStepNarration(step, techniqueName));
    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];
    const chipStyles = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipTextStyles = [styles.chipText, { color: theme.colors.inkText }];
    const isWitness = step.kind === StepScriptStepKindEnum.SHOW_CHAIN || step.kind === StepScriptStepKindEnum.SHOW_BRANCH;
    const witnessSteps = stepScript.steps
        .slice(0, stepIndex + 1)
        .map((candidateStep, index) => ({ step: candidateStep, stepIndex: index }))
        .filter(
            candidate =>
                candidate.step.narration.technique === step.narration.technique &&
                (candidate.step.kind === StepScriptStepKindEnum.SHOW_CHAIN || candidate.step.kind === StepScriptStepKindEnum.SHOW_BRANCH)
        );

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    const handleNarrationContentSizeChange = () => {
        narrationScrollRef.current?.flashScrollIndicators();
    };

    return (
        <ScrollView
            key={`${stepIndex}-${narrationText}`}
            contentContainerStyle={styles.container}
            onContentSizeChange={handleNarrationContentSizeChange}
            persistentScrollbar
            ref={narrationScrollRef}
            style={styles.narrationScroll}
            testID={HintStepNarrationSelectors.NARRATION_SCROLL}
        >
            {isDefined(value) ? (
                <View style={chipStyles} testID={HintStepNarrationSelectors.Value}>
                    <BlackText style={chipTextStyles}>{value}</BlackText>
                </View>
            ) : null}
            {witnessSteps.length > 0 ? (
                <View style={styles.container} testID={HintStepNarrationSelectors.CHAIN_BLOCKS}>
                    {witnessSteps.map(candidate => {
                        if (
                            candidate.step.kind !== StepScriptStepKindEnum.SHOW_CHAIN &&
                            candidate.step.kind !== StepScriptStepKindEnum.SHOW_BRANCH
                        ) {
                            return null;
                        }

                        return (
                            <HintNarratedChain
                                currentStepIndex={stepIndex}
                                key={candidate.stepIndex}
                                step={candidate.step}
                                stepIndex={candidate.stepIndex}
                            />
                        );
                    })}
                </View>
            ) : null}
            {isWitness ? (
                <HintChainSentence narrationText={narrationText} step={step} />
            ) : (
                <BlackText accessibilityLiveRegion="polite" style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                    {narrationText}
                </BlackText>
            )}
        </ScrollView>
    );
};
