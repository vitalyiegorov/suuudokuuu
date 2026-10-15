import { useLingui } from '@lingui/react/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import LucideX from 'lucide-react-native/icons/x';
import { use } from 'react';
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
    const { stepScript } = snapshot;
    const technique =
        stepScript?.steps.find(step => step.kind === StepScriptStepKindEnum.PlaceValue)?.narration.technique ?? stepScript?.technique;

    if (!isDefined(technique)) {
        return null;
    }

    const techniqueName = technique === SolutionTechniqueEnum.Guess ? t`Reveal` : i18n._(techniqueLabelsConstant[technique]);
    const focusHeader = (header: HostInstance | null) => {
        const focusTimeout = setTimeout(() => header?.focus(), HintPanelEnterDurationMillisecondsConstant);

        return () => {
            clearTimeout(focusTimeout);
        };
    };
    const handleDismiss = () => {
        engine.stopStepScript();
    };

    return (
        <View ref={focusHeader} style={styles.header} tabIndex={-1}>
            <BlackText numberOfLines={2} role="heading" style={styles.technique} testID={HintStepNarrationSelectors.Technique}>
                {techniqueName}
            </BlackText>
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
