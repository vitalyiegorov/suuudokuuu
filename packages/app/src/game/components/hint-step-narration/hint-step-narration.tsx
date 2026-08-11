import { useLingui } from '@lingui/react';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetStepNarration } from '../../utils/game-get-step-narration.util';

import { HintStepNarrationSelectors } from './hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from './hint-step-narration.styles';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

interface Props {
    readonly step: StepScriptStepType;
}

export const HintStepNarration = ({ step }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueName = _(techniqueLabelsConstant[step.narration.technique]);
    const narrationText = _(gameGetStepNarration(step, techniqueName));

    const techniqueStyles = [styles.technique, { color: theme.colors.accent }];
    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];

    return (
        <View style={styles.container}>
            <BlackText numberOfLines={1} style={techniqueStyles} testID={HintStepNarrationSelectors.Technique}>
                {techniqueName}
            </BlackText>

            <BlackText style={narrationStyles} testID={HintStepNarrationSelectors.Narration}>
                {narrationText}
            </BlackText>
        </View>
    );
};
