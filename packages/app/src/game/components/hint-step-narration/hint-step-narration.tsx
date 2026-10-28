import { useLingui } from '@lingui/react/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { use, useEffect, useRef } from 'react';
import { AccessibilityInfo, ScrollView, type ScrollViewInstance, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameGetStepNarration } from '../../utils/game-get-step-narration.util';
import { HintChainBlocks } from '../hint-chain-blocks/hint-chain-blocks';
import { HintChainSentence } from '../hint-chain-sentence/hint-chain-sentence';

import { HintStepNarrationSelectors } from './hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from './hint-step-narration.styles';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

interface Props {
    readonly step: StepScriptStepType;
    readonly revealedImplicationCount: number;
    readonly value: number | null | undefined;
}

export const HintStepNarration = ({ step, revealedImplicationCount, value }: Props) => {
    const { i18n } = useLingui();
    const { theme } = use(ThemeContext);
    const { snapshot } = use(GameContext);
    const narrationScrollRef = useRef<ScrollViewInstance>(null);
    const narrationText = i18n._(gameGetStepNarration(step, i18n, snapshot.stepScript?.steps));
    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];
    const chipStyles = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipTextStyles = [styles.chipText, { color: theme.colors.inkText }];
    const containerStyles = isDefined(value) ? [styles.container, styles.placementContainer] : styles.container;
    const isWitness = step.kind === StepScriptStepKindEnum.SHOW_CHAIN || step.kind === StepScriptStepKindEnum.SHOW_BRANCH;

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    const handleNarrationContentSizeChange = () => {
        narrationScrollRef.current?.flashScrollIndicators();
    };

    return (
        <ScrollView
            contentContainerStyle={containerStyles}
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
            {isWitness ? (
                <>
                    <HintChainBlocks revealedImplicationCount={revealedImplicationCount} step={step} />
                    <HintChainSentence narrationText={narrationText} revealedImplicationCount={revealedImplicationCount} step={step} />
                </>
            ) : (
                <BlackText accessibilityLiveRegion="polite" style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                    {narrationText}
                </BlackText>
            )}
        </ScrollView>
    );
};
