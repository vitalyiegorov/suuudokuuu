import { useLingui } from '@lingui/react';
import { use, useEffect } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetStepNarration } from '../../utils/game-get-step-narration.util';

import { HintStepNarrationSelectors } from './hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from './hint-step-narration.styles';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

interface Props {
    readonly isRoomyLayout: boolean;
    readonly lineCount: number;
    readonly step: StepScriptStepType;
    readonly value?: number;
}

export const HintStepNarration = ({ isRoomyLayout, lineCount, step, value }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueName = _(techniqueLabelsConstant[step.narration.technique]);
    const narrationText = _(gameGetStepNarration(step, techniqueName));

    const techniqueStyles = [styles.technique(isRoomyLayout), { color: theme.colors.accent }];
    const narrationStyles = [styles.narration(isRoomyLayout), { color: theme.colors.surface.raisedText }];
    const chipStyles = [styles.chip(isRoomyLayout), { backgroundColor: theme.colors.ink }];
    const chipTextStyles = [styles.chipText(isRoomyLayout), { color: theme.colors.inkText }];

    useEffect(() => void AccessibilityInfo.announceForAccessibility(narrationText), [narrationText]);

    return (
        <View style={styles.container(isRoomyLayout)}>
            <View style={styles.header(isRoomyLayout)}>
                {isDefined(value) ? (
                    <View style={chipStyles} testID={HintStepNarrationSelectors.Value}>
                        <BlackText style={chipTextStyles}>{value}</BlackText>
                    </View>
                ) : null}

                <BlackText numberOfLines={1} style={techniqueStyles} testID={HintStepNarrationSelectors.Technique}>
                    {techniqueName}
                </BlackText>
            </View>

            <BlackText numberOfLines={lineCount} style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                {narrationText}
            </BlackText>
        </View>
    );
};
