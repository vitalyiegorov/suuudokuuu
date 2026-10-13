import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { GameContext } from '../../context/game.context';
import { HintPanelApplyButton } from '../hint-panel-apply-button/hint-panel-apply-button';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintStepperBack } from '../hint-stepper-back/hint-stepper-back';
import { HintStepperNext } from '../hint-stepper-next/hint-stepper-next';

export const HintStepper = () => {
    const { t } = useLingui();
    const { snapshot } = use(GameContext);

    const isLastPage = snapshot.hintPageIndex >= snapshot.hintPageCount - 1;
    const currentStepNumber = snapshot.hintPageIndex + 1;
    const stepCount = snapshot.hintPageCount;
    const stepLabel = t`Step ${currentStepNumber} of ${stepCount}`;

    return (
        <View style={styles.actions} testID={HintPanelSelectors.FOOTER}>
            <HintStepperBack />
            <BlackText
                accessibilityLabel={stepLabel}
                accessibilityLiveRegion="polite"
                numberOfLines={2}
                style={styles.stepperLabel}
                testID={HintPanelSelectors.Progress}
            >
                {stepLabel}
            </BlackText>
            {isLastPage ? <HintPanelApplyButton style={styles.stepperButton} /> : <HintStepperNext />}
        </View>
    );
};
